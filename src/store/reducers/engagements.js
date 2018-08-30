import {
	GET_ENGAGEMENT_SUCCESS
} from '../actions/creators/types'

export const engagements = (state = [], action) => {
	switch (action.type) {
		case GET_ENGAGEMENT_SUCCESS:
			return action.engagements
		default:
			return state
	}
}
