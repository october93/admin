import {
  GET_FEATURE_SWITCHES_REQUEST,
  GET_FEATURE_SWITCHES_SUCCESS,
  GET_FEATURE_SWITCHES_ERROR,
} from '../actions/featureswitches'

export function featureSwitchesLoading(state = true, action) {
  switch (action.type) {
    case GET_FEATURE_SWITCHES_REQUEST:
      return true
    case GET_FEATURE_SWITCHES_SUCCESS:
    case GET_FEATURE_SWITCHES_ERROR:
      return false
    default:
      return state
  }
}


export function featureSwitches(state = [], action) {
  switch (action.type) {
    case GET_FEATURE_SWITCHES_SUCCESS:
      return action.switches.featureSwitches
    default:
      return state
  }
}
