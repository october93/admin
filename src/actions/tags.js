import GraphQLClient from '../store/GraphQLClient'
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
  type: GET_TAGS_FAILURE,
  error,
})

export const getTags = url => async (dispatch) => {
  dispatch(getTagsRequest(true))
  const client = new GraphQLClient(url)
  try {
    const response = await client.client.query({
      errorPolicy: "ignore",
      query: gql`
        {
          tags {
            id
            handle
            name
            info
            profile_image_path
            cover_image_path
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

export const createTag = (url, handle, name, info) => async (dispatch) => {
  const client = new GraphQLClient(url)
  try {
    const response = await client.client.mutate({
      errorPolicy: "ignore",
      mutation: gql`
        mutation {
          newTag(handle: "${handle}", name: "${name}", info: "${info}")
        }
        `
    })
    dispatch(createTagSuccess(response))
    dispatch(getTags(url))
  } catch (e) {
    dispatch(createTagsFailure(e))
  }
}
