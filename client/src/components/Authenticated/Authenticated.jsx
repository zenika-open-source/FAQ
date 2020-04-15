import { useAuth, useUser } from 'services'

const Authenticated = ({ admin, children }) => {
  const auth = useAuth()
  const user = useUser()

  const hasAccess = auth.ready && user && (!admin || (admin && user?.admin))

  return hasAccess ? children : null
}

export default Authenticated
