import { Navigate, Route, Routes } from 'react-router-dom'

import Callback from './Callback'
import Login from './Login'
import Logout from './Logout'

const Auth = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default Auth
