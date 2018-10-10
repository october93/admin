import {
	GET_ENGAGEMENT_SUCCESS
} from '../actions/creators/types'

export const engagements = (state = [], action) => {
	const excludeUsernames = {
		paul: true,
		eugene: true,
		chris: true,
		konrad: true,
		kai: true,
		kingsley: true,
		juan: true,
		tomas: true,
		richagoyal: true,
		root: true,
		october: true,
	}

	switch (action.type) {
		case GET_ENGAGEMENT_SUCCESS:
			action.engagements.users = action.engagements.users.filter(engagement => !excludeUsernames[engagement.username])
			return action.engagements
		default:
			return state
	}
}
