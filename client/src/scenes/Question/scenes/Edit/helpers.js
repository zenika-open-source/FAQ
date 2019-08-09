import difference from 'lodash/difference'

export const canSubmit = ({ question, initialQuestion, tags, initialTags }) =>
  !(
    question.length === 0 ||
    (question === initialQuestion &&
      difference(tags, initialTags).length === 0 &&
      difference(initialTags, tags).length === 0)
  )
