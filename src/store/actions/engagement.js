import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

import * as create from "./creators/engagement"

export const getEngagement = (startDate, endDate) => async (dispatch) => {
  dispatch(create.getEngagementRequest(true))

  try {
    const { data } = await GraphQLClient.Client().query({
      errorPolicy: "ignore",
      query: gql`
				{
					users {
						username
						engagement(from: "${startDate.format()}", to: "${endDate.format()}") {
							daysActive
							postCount
							commentCount
							reactedCount
							receivedReactionsCount
							followedUsersCount
			        followedCount
							invitedCount
			        score
						}
					}
					cardEngagement(from: "${startDate.format()}", to: "${endDate.format()}") {
			      id
						uniqueUserCommentCount
						totalLikeCount
						totalReplyCount
					}
				}
      `
    })
    dispatch(create.getEngagementSuccess(data))
  } catch (e) {
		console.error(e)
    dispatch(create.getEngagementError(e))
  }
}
