import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

import * as create from "./creators/engagement"

export const getEngagement = () => async (dispatch) => {
  dispatch(create.getEngagementRequest(true))

  try {
    const { data } = await GraphQLClient.Client().query({
      errorPolicy: "ignore",
      query: gql`
				{
					users {
						username
						engagement {
							daysActive
							postCount
							commentCount
							votedCount
							receivedVotesCount
							reactedCount
							receivedReactionsCount
							followedUsersCount
							invitedCount
			        score
						}
					}
				}
      `
    })
    dispatch(create.getEngagementSuccess(data.users))
  } catch (e) {
    dispatch(create.getEngagementError(e))
  }
}
