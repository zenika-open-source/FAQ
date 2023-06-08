import React from 'react'
import PropTypes from 'prop-types'
import Pluralize from 'react-pluralize'

import { getIntl } from 'services'
import { Loading } from 'components'
import { DefaultPagination } from 'components/Pagination'

import NoResults from '../NoResults'
import Result from '../Result'

const ResultList = ({
  searchText,
  nodes = [],
  loading,
  entriesCount,
  pagesCount,
  pageCurrent,
  onPageSelected,
  meta
}) => {
  const intl = getIntl(ResultList)

  const shouldShowLoading = loading && (meta ? meta.pageCurrent !== pageCurrent : true)

  if (!loading && nodes.length === 0) {
    return <NoResults prefill={searchText} />
  }

  const Results = nodes.map(node => {
    const opened = !searchText
    return (
      <Result
        key={node.id + (opened ? '-opened' : '')}
        collapsed={opened}
        node={node}
        style={{ marginBottom: '1rem' }}
      />
    )
  })

  return (
    <div style={{ marginTop: '1rem' }}>
      {!shouldShowLoading && (
        <p
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 1rem'
          }}
        >
          <i>{searchText ? <span>{intl('count')(entriesCount)}</span> : intl('latest')}</i>
          <i>{intl('page')(pageCurrent)}</i>
        </p>
      )}
      {!shouldShowLoading ? Results : <Loading />}
      <br />
      <DefaultPagination
        nbPages={pagesCount}
        current={pageCurrent}
        onPageSelected={index => {
          onPageSelected(index)
          window.scrollTo(0, 0)
        }}
      />
    </div>
  )
}

ResultList.propTypes = {
  searchText: PropTypes.string,
  nodes: PropTypes.array,
  loading: PropTypes.bool,
  entriesCount: PropTypes.number,
  pagesCount: PropTypes.number,
  pageCurrent: PropTypes.number,
  onPageSelected: PropTypes.func,
  meta: PropTypes.object
}

ResultList.translations = {
  en: {
    latest: 'Latest questions',
    count: count => (
      <>
        <Pluralize singular="result" count={count} /> found
      </>
    ),
    page: current => <>Page {current}</>
  },
  fr: {
    latest: 'Dernières questions',
    count: count => (
      <>
        <Pluralize singular="résultat" count={count} /> trouvés
      </>
    ),
    page: current => <>Page {current}</>
  }
}

export default ResultList
