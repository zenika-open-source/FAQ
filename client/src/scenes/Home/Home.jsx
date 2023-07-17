import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'components'

import { addToQueryString, unserialize } from 'helpers'
import { getIntl } from 'services'

import { useState } from 'react'
import { ResultList, Searchbar } from './components'

const Home = () => {
  const intl = getIntl(Home)

  const location = useLocation()
  const params = unserialize(location.search)
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState(params.q)
  const [debouncedSearchText, setDebouncedSearchText] = useState(params.q)
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState(params.tags)

  const onSearchChange = text => {
    setSearchText(text)

    addToQueryString(navigate, location, {
      q: text
    })

    querySearchProvider()
  }

  const setDebounceTextSearch = () => {
    setDebouncedSearchText(searchText)
  }

  const querySearchProvider = debounce(setDebounceTextSearch, 200)

  const setSearchLoading = loading => setLoading(loading)

  const onTagsChange = tags => {
    const labels = tags.map(tag => tag.name)

    setTags(labels)

    addToQueryString(navigate, location, { tags: labels })
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

Home.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

Home.translations = {
  en: { new_question: 'New question' },
  fr: { new_question: 'Nouvelle question' }
}

export default Home
