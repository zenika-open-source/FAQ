export const NEW_QUESTION = 'NEW_QUESTION'
export const NEW_QUESTION_SAVED = 'NEW_QUESTION_SAVED'

export const newQuestion = question => ({ type: NEW_QUESTION, question })
export const newQuestionSaved = id => ({ type: NEW_QUESTION_SAVED, id })
