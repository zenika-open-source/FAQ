import ReactDOM from 'react-dom/client'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import './index.css'

import { PrivateRoute } from 'components'
import App from 'scenes/App/App'
import Auth from 'scenes/Auth/Auth'
import Home from 'scenes/Home/Home'
import NotFound from 'scenes/NotFound/NotFound'
import QuestionRoutes from 'scenes/Question/QuestionRoutes'
import Settings from 'scenes/Settings/Settings'
import UserProfile from 'scenes/UserProfile/UserProfile'
import ApolloWrapper from 'services/apollo'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="auth/*" element={<Auth />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="q/*" element={<QuestionRoutes />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="settings" element={<Settings />} admin specialist />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloWrapper>
    <RouterProvider router={router} />
  </ApolloWrapper>,
)
