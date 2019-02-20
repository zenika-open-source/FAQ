import { useContext } from 'react'

import { ConfigurationContext } from './ConfigurationProvider'

export const useConfiguration = () => useContext(ConfigurationContext)
