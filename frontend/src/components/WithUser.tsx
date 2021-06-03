import {
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react'

const UserContext = createContext<TUser | false>(false)

export function useUser() {
  return useContext<TUser | false>(UserContext)
}

export const User: React.FC = function() {
  const user = useUser()

  if ( user ) {
    return <strong>{user.name}</strong>
  } else {
    return <a href="/login">Login with Twitch</a>
  }
}


export const WithUser : React.FC = function({ children }) {
  const [ user, set_user ] = useState<TUser | false>(false)

  useEffect(() => {
    fetch('/api/me')
      .then((resp) => resp.json())
      .then((result) => {
        set_user(result)
      })
  }, [ user && user.id ])

  return <UserContext.Provider value={user}>
    {children}
  </UserContext.Provider>
}
