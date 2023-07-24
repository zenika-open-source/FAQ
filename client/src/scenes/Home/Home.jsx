import { Button } from 'components'
import { addToQueryString, unserialize } from 'helpers'
import debounce from 'lodash/debounce'
import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { getIntl } from 'services'

import { ResultList, Searchbar } from './components'

const Home = () => {
  const intl = getIntl(Home)

  const location = useLocation()
  const params = unserialize(location.search)
  const [, setSearchParams] = useSearchParams()

  const [searchText, setSearchText] = useState(params.q)
  let debouncedSearchText = searchText
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState(params.tags)

  const onSearchChange = (text) => {
    setSearchText(text)
    addToQueryString(setSearchParams, location, {
      q: text,
    })

    querySearchProvider()
  }

  const setDebounceTextSearch = () => {
    debouncedSearchText = searchText
  }

  const querySearchProvider = debounce(setDebounceTextSearch, 200)

  const setSearchLoading = (loading) => setLoading(loading)

  const onTagsChange = (tags) => {
    const labels = tags.map((tag) => tag.name)

    setTags(labels)

    addToQueryString(setSearchParams, location, { tags: labels })
  }

  return (
    <div>
      <Searchbar
        text={searchText}
        tags={tags}
        loading={loading}
        onTextChange={onSearchChange}
        onTagsChange={onTagsChange}
      />
      <ResultList searchText={debouncedSearchText} setSearchLoading={setSearchLoading} />
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
  fr: { new_question: 'Nouvelle question' },
}

export default Home
