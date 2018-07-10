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
            user {
              id,
            },
            card {
              id,
            },
            message,
            createdAt,
            updatedAt,
          }
        }
      `
    })
    dispatch(create.getAnnouncementsSuccess(data.announcements))
  } catch (e) {
    dispatch(create.getAnnouncementsError(e))
  }
}

export const createAnnouncement = ({ message, fromUser, forCard, toUsers, sendPush }) => async (dispatch) => {
  dispatch(create.createAnnouncementRequest({ message, fromUser, forCard, toUsers, sendPush }))

  try {
    const response = await GraphQLClient.Client().mutate({
      variables: {
        announcement: {
          fromUser,
          toUsers,
          forCard,
          message,
        },
        sendPush,
      },
      mutation: gql`
        mutation CreateAnnouncement($announcement: AnnouncementInput!, $sendPush: Boolean) {
          createAnnouncement(announcement: $announcement, $sendPush) {
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

    dispatch(create.createAnnouncementSuccess(response.data.createAnnouncement))
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
