import GraphQLClient from '../store/GraphQLClient'
import gql from 'graphql-tag';

export const GET_FEATURE_SWITCHES_REQUEST = 'GET_FEATURE_SWITCHES_REQUEST'
export const GET_FEATURE_SWITCHES_SUCCESS = 'GET_FEATURE_SWITCHES_SUCCESS'
export const GET_FEATURE_SWITCHES_ERROR = 'GET_FEATURE_SWITCHES_ERROR'

const getFeatureSwitchesRequest = () => ({
    type: GET_FEATURE_SWITCHES_REQUEST,
})

const getFeatureSwitchesSuccess = switches => ({
    type: GET_FEATURE_SWITCHES_SUCCESS,
    switches,
})

const getFeatureSwitchesError = error => ({
    type: GET_FEATURE_SWITCHES_ERROR,
    error,
})

export const getSwitches = url => async (dispatch) => {
    dispatch(getFeatureSwitchesRequest())
    const client = new GraphQLClient(url)
    try {
      const response = await client.client.query({
        errorPolicy: "ignore",
        query: gql`
        {
          featureSwitches{
            id
            name
            state
            testingUsers
          }
        }
        `
      })

      dispatch(getFeatureSwitchesSuccess(response.data))
    } catch (e) {
      dispatch(getFeatureSwitchesError(e))
    }
}

export const SET_SWITCH_STATE_REQUEST = 'SET_SWITCH_STATE_REQUEST'
export const SET_SWITCH_STATE_SUCCESS = 'SET_SWITCH_STATE_SUCCESS'
export const SET_SWITCH_STATE_ERROR = 'SET_SWITCH_STATE_ERROR'

const setSwitchStateRequest = () => ({
    type: SET_SWITCH_STATE_REQUEST,
})

const setSwitchStateSuccess = switches => ({
    type: SET_SWITCH_STATE_SUCCESS,
    switches,
})

const setSwitchStateError = error => ({
    type: SET_SWITCH_STATE_ERROR,
    error,
})

export const setFeatureSwitchState = (url, featureID, state) => async (dispatch) => {
    dispatch(setSwitchStateRequest())
    const client = new GraphQLClient(url)
    try {
      await client.client.mutate({
        mutation: gql`
        mutation {
          setFeatureSwitchState(featureID:"${featureID}", state:"${state}" )
        }
        `,
      })

      dispatch(setSwitchStateSuccess())
    } catch (e) {
      dispatch(setSwitchStateError(e))
    }
}

export const NEW_SWITCH_REQUEST = 'NEW_SWITCH_REQUEST'
export const NEW_SWITCH_SUCCESS = 'NEW_SWITCH_SUCCESS'
export const NEW_SWITCH_ERROR = 'NEW_SWITCH_ERROR'

const newSwitchRequest = () => ({
    type: NEW_SWITCH_REQUEST,
})

const newSwitchSuccess = () => ({
    type: NEW_SWITCH_SUCCESS,
})

const newSwitchError = error => ({
    type: NEW_SWITCH_ERROR,
    error,
})

export const newFeatureSwitch = (url, name, state) => async (dispatch) => {
    dispatch(newSwitchRequest())
    const client = new GraphQLClient(url)
    try {
      await client.client.mutate({
        mutation: gql`
        mutation {
          newFeatureSwitch(name:"${name}", state:"${state}" )
        }
        `,
      })

      dispatch(newSwitchSuccess())
    } catch (e) {
      dispatch(newSwitchError(e))
    }
}

export const DELETE_SWITCH_REQUEST = 'DELETE_SWITCH_REQUEST'
export const DELETE_SWITCH_SUCCESS = 'DELETE_SWITCH_SUCCESS'
export const DELETE_SWITCH_ERROR = 'DELETE_SWITCH_ERROR'

const deleteSwitchRequest = () => ({
    type: DELETE_SWITCH_REQUEST,
})

const deleteSwitchSuccess = () => ({
    type: DELETE_SWITCH_SUCCESS,
})

const deleteSwitchError = error => ({
    type: DELETE_SWITCH_ERROR,
    error,
})

export const deleteFeatureSwitch = (url, id) => async (dispatch) => {
    dispatch(deleteSwitchRequest())
    const client = new GraphQLClient(url)
    try {
      await client.client.mutate({
        mutation: gql`
        mutation {
          deleteFeatureSwitch(featureID:"${id}" )
        }
        `,
      })

      dispatch(deleteSwitchSuccess())
    } catch (e) {
      dispatch(deleteSwitchError(e))
    }
}
