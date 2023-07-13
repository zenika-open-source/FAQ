import { Navigate, Outlet, Route, Routes, useMatch } from 'react-router-dom'

import Callback from './Callback'
import Login from './Login'
import Logout from './Logout'

const Auth = () => {
  const { pathname } = useMatch('/auth')
  console.log(pathname)
  return (
    <Outlet />
    // <Routes>
    //   <Route path={`${pathname}/login`} element={<Login />} />
    //   <Route path={`${pathname}/callback`} element={<Callback />} />
    //   <Route path={`${pathname}/logout`} element={<Logout />} />
    //   <Route render={() => <Navigate to="/" />} />
    // </Routes>
  )
}

// Auth.propTypes = {
//   match: PropTypes.object.isRequired
// }

export default Auth
