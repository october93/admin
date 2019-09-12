import {
  CREATE_ANNOUNCEMENT_REQUEST,
  CREATE_ANNOUNCEMENT_SUCCESS,
  CREATE_ANNOUNCEMENT_ERROR,
  DELETE_ANNOUNCEMENT_REQUEST,
  DELETE_ANNOUNCEMENT_SUCCESS,
  DELETE_ANNOUNCEMENT_ERROR,
  GET_ANNOUNCEMENTS_REQUEST,
  GET_ANNOUNCEMENTS_SUCCESS,
  GET_ANNOUNCEMENTS_ERROR,
} from "./types"

export const createAnnouncementRequest = ({ message, fromUser, forCard, toUsers, sendPush }) => ({
  type: CREATE_ANNOUNCEMENT_REQUEST,
  message,
  fromUser,
  forCard,
  toUsers,
  sendPush,
})

export const createAnnouncementSuccess = announcement => ({
  type: CREATE_ANNOUNCEMENT_SUCCESS,
  announcement,
})

export const createAnnouncementError = error => ({
  type: CREATE_ANNOUNCEMENT_ERROR,
  error,
})


export const deleteAnnouncementRequest = ({id}) => ({
  type: DELETE_ANNOUNCEMENT_REQUEST,
  id,
})

export const deleteAnnouncementSuccess = () => ({
  type: DELETE_ANNOUNCEMENT_SUCCESS,
})

export const deleteAnnouncementError = error => ({
  type: DELETE_ANNOUNCEMENT_ERROR,
  error,
})


export const getAnnouncementsRequest = () => ({
  type: GET_ANNOUNCEMENTS_REQUEST,
})

export const getAnnouncementsSuccess = announcements => ({
  type: GET_ANNOUNCEMENTS_SUCCESS,
  announcements,
})

export const getAnnouncementsError = error => ({
  type: GET_ANNOUNCEMENTS_ERROR,
  error,
})
