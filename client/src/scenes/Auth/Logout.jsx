import { Loading } from 'components';
import { useAuth } from 'contexts';
import { useEffect } from 'react';

const Logout = () => {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
  }, [logout])

  return <Loading />
}

export default Logout
