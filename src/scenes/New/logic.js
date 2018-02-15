import { createLogic } from 'redux-logic'
import { NEW_QUESTION, newQuestionSaved } from './actions'
import { saveQuestion } from 'data/questions/actions'

const onNewQuestion = createLogic({
  type: NEW_QUESTION,

  process ({ getState, action }, dispatch, done) {
    // TODO: send question to DB

    const id = getState().data.questions.length + 1
    const avatar = getState().data.user.picture

    const question = {
      id,
      avatar,
      question: action.question
    }

    dispatch(saveQuestion(question))
    dispatch(newQuestionSaved(id))
    done()
  }
})

export const logic = [onNewQuestion]
