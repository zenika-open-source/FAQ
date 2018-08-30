import { query } from 'services/apollo'

import { getAllNodes } from './queries'
import Home from './Home'

export default query(getAllNodes)(Home)
