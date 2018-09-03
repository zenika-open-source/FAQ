import { query } from 'services/apollo'
import queryString from 'query-string'

import { getAllNodes } from './queries'
import Home from './Home'

export default query(getAllNodes, {
  variables: props => {
    const page = queryString.parse(props.location.search).page || 1
    return {
      first: 10,
      skip: 10 * (page - 1)
    }
  },
  fetchPolicy: 'network-only'
})(Home)
