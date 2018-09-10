import {
	GET_ENGAGEMENT_REQUEST,
	GET_ENGAGEMENT_SUCCESS,
	GET_ENGAGEMENT_ERROR
} from './types'

export const getEngagementRequest = () => ({
	type: GET_ENGAGEMENT_REQUEST,
})

export const getEngagementSuccess = engagements => ({
	type: GET_ENGAGEMENT_SUCCESS,
	engagements
})

export const getEngagementError = () => ({
	type: GET_ENGAGEMENT_ERROR,
})
