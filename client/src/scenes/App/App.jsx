import { Helmet } from 'react-helmet'

import { AuthProvider, ConfigurationProvider, UserProvider } from 'contexts'

import { AlertProvider, AlertStack } from 'components'

import Footer from './components/Footer'
import Navbar from './components/Navbar'

import { Outlet } from 'react-router'
import 'styles'

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
                <Outlet />
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
