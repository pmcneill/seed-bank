import {
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'

interface TSessionContext {
  user: TUser | false,
  set_user: (u: TUser | false) => void,
  spoilers: boolean,
  set_spoilers: (v: boolean) => void,
}

const SessionContext = createContext<TSessionContext>({
  user: false,
  set_user: (_u) => null,
  spoilers: false,
  set_spoilers: (_v) => null,
})

export function useSession() {
  return useContext<TSessionContext>(SessionContext)
}

export const User: React.FC = function() {
  const { user, set_user, spoilers, set_spoilers } = useSession()

  const toggle_ratings = () => {
    if ( ! user ) return;

    set_spoilers(!spoilers)
    user.spoilers = !spoilers
    set_user(user)
  }

  if ( user ) {
    return <div className="login logged-in">
      <strong>{user.name}</strong><br />
      <a onClick={toggle_ratings}>{spoilers ? "Show" : "Hide"} potential spoilers</a>
    </div>
  } else {
    return <div className="login">
      <a href="/login">Login with Twitch</a>
    </div>
  }
}

export const WithSession : React.FC = function({ children }) {
  const [ user, _set_user ] = useState<TUser | false>(false)
  const [ spoilers, set_spoilers ] = useState<boolean>(false)

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
        set_spoilers(result.spoilers)
      })
  }, [ user_id ])

  const value = useMemo(() => ({user, set_user, spoilers, set_spoilers}), [user, spoilers])

  return <SessionContext.Provider value={value}>
    {children}
  </SessionContext.Provider>
}
