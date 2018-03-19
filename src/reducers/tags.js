import {
  GET_TAGS_REQUEST,
  GET_TAGS_SUCCESS,
  GET_TAGS_FAILURE,
  CREATE_TAG_SUCCESS,
  CREATE_TAGS_FAILURE
} from '../actions/tags'

export function tagsLoading(state = true, action) {
  switch (action.type) {
    case GET_TAGS_REQUEST:
      return action.isLoading
    default:
      return state
  }
}

export function getTagsSuccessful(state = {}, action) {
  switch (action.type) {
    case GET_TAGS_SUCCESS:
      return action.tags
    default:
      return state
  }
}

export function getTagsFailed(state = null, action) {
  switch (action.type) {
    case GET_TAGS_FAILURE:
      return action.error
    default:
      return state
  }
}

export function createTagSuccessful(state = null, action) {
  switch (action.type) {
    case CREATE_TAG_SUCCESS:
      return true
    default:
      return state
  }
}

export function createTagFailed(state = null, action) {
  switch (action.type) {
    case CREATE_TAGS_FAILURE:
      return action.error
    default:
      return state
  }
}
