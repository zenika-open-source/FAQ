import React from 'react'
import PropTypes from 'prop-types'

import { DefaultPagination, Loading } from 'components'

import HistoryAction from './HistoryAction'

const HistoryActions = ({
  historyActions = [],
  pagesCount,
  pageCurrent,
  onPageSelected,
  loading,
  meta
}) => {
  const shouldShowLoading =
    loading && (meta ? meta.pageCurrent !== pageCurrent : true)

  const actions = historyActions.map(action => (
    <HistoryAction key={action.id} action={action} />
  ))

  return (
    <div>
      {shouldShowLoading && <Loading text=" " />}
      {!shouldShowLoading && actions}
      <DefaultPagination
        nbPages={pagesCount}
        current={pageCurrent}
        onPageSelected={onPageSelected}
      />
    </div>
  )
}

HistoryActions.propTypes = {
  historyActions: PropTypes.array,
  pagesCount: PropTypes.number,
  pageCurrent: PropTypes.number,
  onPageSelected: PropTypes.func,
  loading: PropTypes.bool,
  meta: PropTypes.object
}

export default HistoryActions
