

import { getIntl } from 'services'

import { Tab } from 'components'

import { TagsEditor } from '../components'

const Tags = ({ state, onTagsChange }) => {
  const intl = getIntl(Tags)

  return (
    <Tab label={intl('tab')}>
      <TagsEditor categories={state.tagCategories} onChange={onTagsChange} />
    </Tab>
  )
}

Tags.translations = {
  en: {
    tab: 'Tags',
    labels: {
      add: 'Add tags',
      more: 'More tags',
      key: 'Category',
      value: 'Tags'
    }
  },
  fr: {
    tab: 'Tags',
    labels: {
      add: 'Ajouter un tags',
      more: 'Plus de tags',
      key: 'Categorie',
      value: 'Tags'
    }
  }
}

export default Tags
