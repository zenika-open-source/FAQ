import ReactDOM from 'react-dom/client'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'

import 'normalize.css'

import { ErrorBoundary, PrivateRoute } from 'components'
import App from 'scenes/App/App'
import Auth from 'scenes/Auth/Auth'
import Home from 'scenes/Home/Home'
import NotFound from 'scenes/NotFound/NotFound'
import Question from 'scenes/Question/Question'
import Settings from 'scenes/Settings/Settings'
import UserProfile from 'scenes/UserProfile/UserProfile'
import ApolloWrapper from 'services/apollo'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="auth/*" element={<Auth />} errorElement={<ErrorBoundary />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} errorElement={<ErrorBoundary />} />
        <Route path="q/*" element={<Question />} errorElement={<ErrorBoundary />} />
        <Route path="user-profile" element={<UserProfile />} errorElement={<ErrorBoundary />} />
        <Route
          path="settings"
          element={<Settings />}
          errorElement={<ErrorBoundary />}
          admin
          specialist
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloWrapper>
    <RouterProvider router={router} />
  </ApolloWrapper>
)
