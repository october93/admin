import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

export const GET_TAGS_REQUEST   = 'GET_TAGS_REQUEST'
export const GET_TAGS_SUCCESS   = 'GET_TAGS_SUCCESS'
export const GET_TAGS_FAILURE   = 'GET_TAGS_FAILURE'
export const CREATE_TAG_SUCCESS = 'CREATE_TAG_SUCCESS'
export const CREATE_TAG_FAILURE = 'CREATE_TAG_FAILURE'

const getTagsRequest = (isLoading) => ({
  type: GET_TAGS_REQUEST,
  isLoading,
})

const getTagsSuccess = tags => ({
  type: GET_TAGS_SUCCESS,
  tags,
})

const getTagsFailure = error => ({
  type: GET_TAGS_FAILURE,
  error,
})

const createTagSuccess = () => ({
  type: CREATE_TAG_SUCCESS
})

const createTagsFailure = error => ({
  type: CREATE_TAG_FAILURE,
  error,
})

export const getTags = () => async (dispatch) => {
  dispatch(getTagsRequest(true))
  try {
    const response = await GraphQLClient.Client().query({
      errorPolicy: "ignore",
      query: gql`
        {
          tags {
            id
            handle
            name
            info
            profileImagePath
            coverImagePath
          }
        }
        `
    })
    dispatch(getTagsSuccess(response.data))
    dispatch(getTagsRequest(false))
  } catch (e) {
    dispatch(getTagsFailure(e))
  }
}

export const createTag = (handle) => async (dispatch) => {
  try {
    const response = await GraphQLClient.Client().mutate({
      variables: {
        tag: {
          handle: handle,
        },
      },
      mutation: gql`
        mutation CreateTag($tag: TagInput!) {
          createTag(tag: $tag) {
            id
            name
            handle
          }
        }
        `
    })

    dispatch(createTagSuccess(response))
    dispatch(getTags())
  } catch (e) {
    dispatch(createTagsFailure(e))
  }
}
