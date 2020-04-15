import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'

import { Button } from 'components'
import { useIntl } from 'services'
import { unserialize, addToQueryString, useDebouncedText } from 'helpers'

import { Searchbar, ResultList } from './components'
import { useSearch } from './queries'

const NODES_PER_PAGE = 10

const Home = () => {
  const location = useLocation()
  const history = useHistory()
  const intl = useIntl(Home)

  const { q, page, tags } = unserialize(location.search)

  const [searchText, debouncedSearchText, setSearchText, setDebouncedSearchText] = useDebouncedText(
    q
  )
  const [currentPage, setCurrentPage] = useState(page)
  const [filterTags, setTags] = useState(tags)

  const [search, { loading: searchLoading, data: searchData }] = useSearch()
  const [searchMeta, setSearchMeta] = useState(searchData?.meta)
  const [preSearch] = useSearch()

  // Cache searchMeta for pagination in resultList
  useEffect(() => {
    if (searchData?.search?.meta) {
      setSearchMeta(searchData?.search?.meta)
    }
  }, [searchData])

  // Update state on url change
  useEffect(() => {
    const { q, page, tags } = unserialize(location.search)
    setSearchText(q)
    setDebouncedSearchText(q)
    setCurrentPage(page)
    setTags(prev => (prev.join('+') !== tags.join('+') ? tags : prev))
  }, [location, setSearchText, setDebouncedSearchText])

  // Update url on state change
  useEffect(() => {
    addToQueryString(history, {
      q: debouncedSearchText,
      tags: filterTags,
      page: 1
    })
  }, [history, debouncedSearchText, filterTags])

  // Update url on page change
  useEffect(() => {
    addToQueryString(history, {
      page: currentPage
    })
  }, [history, currentPage])

  // Search query
  useEffect(() => {
    search({
      variables: {
        text: debouncedSearchText,
        tags: filterTags,
        first: NODES_PER_PAGE,
        skip: NODES_PER_PAGE * (currentPage - 1)
      }
    })
  }, [search, debouncedSearchText, filterTags, currentPage])

  // Presearch query
  useEffect(() => {
    // Prefetch the second page after 5s
    if (currentPage === 1) {
      const timeout = setTimeout(
        () =>
          preSearch({
            variables: {
              text: debouncedSearchText,
              tags: filterTags,
              first: NODES_PER_PAGE,
              skip: NODES_PER_PAGE * currentPage
            }
          }),
        5 * 1000
      )

      return () => clearTimeout(timeout)
    }
  }, [preSearch, debouncedSearchText, filterTags, currentPage])

  return (
    <div>
      <Searchbar
        text={searchText}
        onTextChange={setSearchText}
        tags={filterTags}
        onTagsChange={setTags}
        loading={searchLoading}
      />
      <ResultList
        searchText={searchText}
        searchData={searchData?.search}
        searchLoading={searchLoading}
        searchMeta={searchMeta}
        onPageSelected={setCurrentPage}
        opened={debouncedSearchText || filterTags.length > 0}
      />
      <Link to="/q/new">
        <Button
          icon="record_voice_over"
          data-tooltip={intl('new_question')}
          style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
          primary
          round
          raised
          fixed
        />
      </Link>
    </div>
  )
}

Home.translations = {
  en: { new_question: 'New question' },
  fr: { new_question: 'Nouvelle question' }
}

export default Home
