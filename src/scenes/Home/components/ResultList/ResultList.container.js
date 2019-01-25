import { withRouter } from 'react-router'

import { compose, unserialize } from 'helpers'
import { query } from 'services/apollo'
import { withError, withPagination } from 'components'

import { searchNodes } from '../../queries'
import ResultList from './ResultList'
import Auth from 'services/auth'

import Auth from 'services/auth'

const RESULTS_PER_PAGE = 10

export default compose(
  withRouter,
  query(searchNodes, {
    variables: props => {
      const { tags, flags, page } = unserialize(props.location.search)

      return {
        text: props.searchText,
        tags,
        flags,
        first: RESULTS_PER_PAGE,
        skip: RESULTS_PER_PAGE * (page - 1),
<<<<<<< HEAD
        locale : Auth.getlocale()
=======
        locale: Auth.getLocale()
>>>>>>> 49a58c97bb87caeea8f0dda3d3edd22f226b50cd
      }
    },
    parse: ({ search = {} }) => ({ ...search })
  }),
  withPagination(),
  withError()
)(ResultList)
