import 'styles'

import { AlertProvider, AlertStack, ErrorBoundary } from 'components'
import { AuthProvider, ConfigurationProvider, UserProvider } from 'contexts'
import { setDefaultOptions } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import { getNavigatorLanguage } from 'helpers'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router'

import Footer from './components/Footer'
import Navbar from './components/Navbar'

setDefaultOptions({
  locale: getNavigatorLanguage() === 'en' ? enUS : fr,
})

const App = () => {
  return (
    <div className="app theme">
      <Helmet>
        <title>FAQ</title>
      </Helmet>
      <AlertProvider>
        <ConfigurationProvider>
          <AuthProvider>
            <UserProvider>
              <Navbar />
              <main className="main">
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </main>
              <Footer />
            </UserProvider>
          </AuthProvider>
        </ConfigurationProvider>
        <AlertStack />
      </AlertProvider>
    </div>
  )
}

export default App
