import { Outlet, Route, Routes } from 'react-router-dom'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import NotFound from 'scenes/NotFound'
import Question from 'scenes/Question'
import Settings from 'scenes/Settings'
import UserProfile from 'scenes/UserProfile'

import { ErrorBoundary, Loading, PrivateRoute } from 'components'

import { useAuth, useConfiguration } from 'contexts'
import { getIntl } from 'services'
import Login from 'scenes/Auth/Login'
import Callback from 'scenes/Auth/Callback'
import Logout from 'scenes/Auth/Logout'

const AppBody = () => {
  const intl = getIntl(AppBody)

  const conf = useConfiguration()
  const auth = useAuth()

  return (
    <div className="main">
      {conf.loading || !auth.ready ? (
        <Loading text={intl('loading')} />
      ) : (
        <ErrorBoundary>
          <Routes>
            <Route path="auth" element={<Outlet />}>
              <Route path="login" element={<Login />} />
              <Route path="callback" element={<Callback />} />
              <Route path="logout" element={<Logout />} />
              <Route render={() => <Navigate to="/" />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="q" element={<Question />} />
              <Route path="user-profile" element={<UserProfile />} />
              <Route path="settings" element={<Settings />} admin specialist />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      )}
    </div>
  )
}

AppBody.translations = {
  en: { loading: 'Preparing the questions...' },
  fr: { loading: 'Préparation des questions...' }
}

export default AppBody
