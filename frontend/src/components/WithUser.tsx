import {
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'

interface TUserContext {
  user: TUser | false,
  set_user: (u: TUser | false) => void,
}

const UserContext = createContext<TUserContext>({ user: false, set_user: (u) => null})

export function useUser() {
  return useContext<TUserContext>(UserContext)
}

export const User: React.FC = function() {
  const { user, set_user } = useUser()

  const toggle_ratings = () => {
    if ( ! user ) return;

    user.hide_ratings = !user.hide_ratings
    set_user(user)
  }

  if ( user ) {
    return <div className="login logged-in">
      <strong>{user.name}</strong><br />
      <a onClick={toggle_ratings}>{user.hide_ratings ? "Show" : "Hide"} potential spoilers</a>
    </div>
  } else {
    return <div className="login">
      <a href="/login">Login with Twitch</a>
    </div>
  }
}

export const WithUser : React.FC = function({ children }) {
  const [ user, _set_user ] = useState<TUser | false>(false)

  const set_user = function(u: TUser | false) {
    // Don't care about the results of this...
    fetch("/api/me/prefs", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(u),
    })

    console.log("user is now:", u)

    _set_user(u)
  }

  const user_id = user && user.id

  useEffect(() => {
    fetch('/api/me')
      .then((resp) => resp.json())
      .then((result) => {
        set_user(result)
      })
  }, [ user_id ])

  const value = useMemo(() => ({user, set_user}), [user])

  return <UserContext.Provider value={value}>
    {children}
  </UserContext.Provider>
}
