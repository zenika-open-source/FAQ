import { Button } from 'components'
import { addToQueryString, unserialize } from 'helpers'
import debounce from 'lodash/debounce'
import { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { getIntl } from 'services'

import { ResultList, Searchbar } from './components'

const Home = () => {
  const intl = getIntl(Home)

  const location = useLocation()
  const params = unserialize(location.search)
  const [, setSearchParams] = useSearchParams()

  const [searchbarText, setSearchbarText] = useState(params.q)
  const [resultListSearchText, setResultListSearchText] = useState(searchbarText)

  const debouncedSetResultListSearchText = debounce(setResultListSearchText, 200)

  useEffect(() => {
    debouncedSetResultListSearchText(searchbarText)
    return () => {
      debouncedSetResultListSearchText.cancel()
    }
  }, [searchbarText])

  useEffect(() => {
    addToQueryString(setSearchParams, location, {
      q: resultListSearchText,
    })
  }, [resultListSearchText])

  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState(params.tags)

  const onTagsChange = (tags) => {
    const labels = tags.map((tag) => tag.name)

    setTags(labels)

    addToQueryString(setSearchParams, location, { tags: labels })
  }

  return (
    <div className="relative">
      <Searchbar
        text={searchbarText}
        tags={tags}
        loading={loading}
        onTextChange={setSearchbarText}
        onTagsChange={onTagsChange}
      />
      <ResultList searchText={resultListSearchText} setSearchLoading={setLoading} />
      <Link to="/q/new">
        <Button
          icon="record_voice_over"
          data-tooltip={intl('new_question')}
          className="!fixed bottom-4 right-4"
          intent="primary"
          shape="round"
          action="raised"
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
