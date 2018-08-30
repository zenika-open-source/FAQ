import { query } from 'services/apollo'

import { getAllPersonalData } from './queries'

import UserProfile from './UserProfile'

export default query(getAllPersonalData)(UserProfile)
