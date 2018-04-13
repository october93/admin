import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

import * as create from "./creators/announcements"

export const getAnnouncements = () => async (dispatch) => {
  dispatch(create.getAnnouncementsRequest(true))

  try {
    const { data } = await GraphQLClient.Client().query({
      errorPolicy: "ignore",
      query: gql`
        {
          announcements {
            id,
            userID,
            cardID,
            message,
            createdAt,
            updatedAt,
            deletedAt,
          }
        }
      `
    })
    dispatch(create.getAnnouncementsSuccess(data.invites))
  } catch (e) {
    dispatch(create.getAnnouncementsError(e))
  }
}

export const createAnnouncement = ({ message, fromUser, forCard, toUsers }) => async (dispatch) => {
  dispatch(create.createAnnouncementRequest({ message, fromUser, forCard, toUsers }))

  try {
    const response = await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          createAnnouncement(fromUser:"${fromUser}", forCard:"${forCard}", message:"${message}", toUsers:${JSON.stringify(toUsers)}) {
            id,
            userID,
            cardID,
            message,
            createdAt,
            updatedAt,
            deletedAt,
          }
        }
      `
    })

    dispatch(create.createAnnouncementSuccess())
    return response.data.createAnnouncement
  } catch (e) {
    dispatch(create.createAnnouncementError(e))
  }
}

export const deleteAnnouncement = id => async (dispatch) => {
  dispatch(create.deleteAnnouncementRequest({ id }))

  try {
    const response = await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          deleteAnnouncement(id:"${id}")
        }
      `
    })

    dispatch(create.deleteAnnouncementSuccess())
    return response.data.deleteAnnouncement
  } catch (e) {
    dispatch(create.deleteAnnouncementError(e))
  }
}
