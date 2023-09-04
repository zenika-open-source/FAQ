// import 'styles'

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
    <div className="flex flex-col bg-background text-primary min-h-full overflow-hidden text-base">
      <Helmet>
        <title>FAQ</title>
      </Helmet>
      <AlertProvider>
        <ConfigurationProvider>
          <AuthProvider>
            <UserProvider>
              <Navbar />
              <main className="mt-navbar w-full overflow-auto pb-8 flex-1 main">
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
