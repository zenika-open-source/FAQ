import { query } from 'services/apollo'

import { me } from './queries'
import Navbar from './Navbar'

export default query(me)(Navbar)
