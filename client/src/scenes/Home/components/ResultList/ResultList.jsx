import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Pluralize from 'react-pluralize'

import { DefaultPagination, Loading } from 'components'
import { useIntl } from 'services'
import NoResults from '../NoResults'
import Result from '../Result'
import { unserialize } from 'helpers'

const ResultList = ({
  searchText,
  searchData,
  searchLoading,
  searchMeta,
  onPageSelected,
  opened
}) => {
  const intl = useIntl(ResultList)
  const location = useLocation()

  const { entriesCount, pagesCount } = searchMeta || {}

  const pageCurrent = useMemo(() => unserialize(location.search).page, [location])

  const nodes = searchData?.nodes || []

  const shouldShowLoading = searchLoading && !searchData

  if (!shouldShowLoading && nodes.length === 0) {
    return <NoResults prefill={searchText} />
  }

  const Results = nodes.map(node => (
    <Result
      key={node.id + (opened ? '-opened' : '')}
      collapsed={!opened}
      node={node}
      style={{ marginBottom: '1rem' }}
    />
  ))

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
      {!shouldShowLoading ? Results : <Loading delay={0} />}
      <br />
      <DefaultPagination
        nbPages={pagesCount || 1}
        current={pageCurrent || 0}
        onPageSelected={index => {
          onPageSelected(index)
          window.scrollTo(0, 0)
        }}
      />
    </div>
  )
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
