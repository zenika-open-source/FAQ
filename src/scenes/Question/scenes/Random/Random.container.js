import { query } from 'services/apollo'

import { getRandomNode } from './queries'

import Random from './Random'

export default query(getRandomNode, {
  variables: props => ({
    tag: props.match.params.tag
  }),
  loadingText: 'Unleashing the randomizator...'
})(Random)
