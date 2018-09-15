import {
	GET_CHANNELS_SUCCESS,
	UPDATE_CHANNEL_REQUEST,
	NEW_CHANNEL_SUCCESS,
} from '../actions/creators/types'

export const channels = (state = [], action) => {
	switch (action.type) {
		case GET_CHANNELS_SUCCESS:
			return action.channels
		case UPDATE_CHANNEL_REQUEST:
			return state.map(c => c.id === action.id ? {...c, name: action.name} : c)
		case NEW_CHANNEL_SUCCESS:
			return [...state, { id: action.id, name: action.name }]
		default:
			return state
	}
}
