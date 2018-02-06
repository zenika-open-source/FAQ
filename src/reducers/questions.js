import * as types from '~/constants/ActionTypes'

import questions from '~/questions.json'
import Fuse from 'fuse.js'

const initialState = {
	questions,
	filtered: []
}

const fuseOptions = {
	shouldSort: true,
	includeScore: true,
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: [
		'question',
		'answer'
	]
}

const search = (state = initialState, action) => {
	switch (action.type) {
	case types.SEARCH:
		return {
			...state,
			filtered: (new Fuse(state.questions,fuseOptions)).search(action.text)
		}
	case types.CLEAR_SEARCH:
		return {
			...state,
			filtered: []
		}
	default:
		return state
	}
}

export default search
