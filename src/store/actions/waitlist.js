import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

export const getWaitlist = () => async (dispatch) => {
  dispatch(waitlistRequest(true))
  try {
    const response = await GraphQLClient.Client().query({
      query: gql`
        {
          waitlist {
            email
            name
            comment
            createdAt
          }
        }
      `
    })
    dispatch(waitlistSuccess(response.data.waitlist))
    dispatch(waitlistRequest(false))
  } catch (e) {
    dispatch(waitlistFailure(e))
    dispatch(waitlistRequest(false))
  }
}

export const updateWaitlist = (email, comment) => async (dispatch) => {
  GraphQLClient.Client().mutate({
    errorPolicy: "ignore",
    mutation: gql`
        mutation {
          updateWaitlist(email: "${email}", comment: "${comment}")
        }
      `
  })
}

export const WAITLIST_REQUEST = 'WAITLIST_REQUEST'

export function waitlistRequest(request) {
  return {
    type: WAITLIST_REQUEST,
    request
  }
}

export const WAITLIST_SUCCESS = 'WAITLIST_SUCCESS'

export function waitlistSuccess(waitlist) {
  return {
    type: WAITLIST_SUCCESS,
    waitlist,
  }
}

export const WAITLIST_FAILURE = 'WAITLIST_FAILURE'

export function waitlistFailure(error) {
  return {
    type: WAITLIST_FAILURE,
    error
  }
}
