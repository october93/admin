import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

export function getSettings() {
  return (dispatch) => {
    return GraphQLClient.Client().query({
      errorPolicy: "ignore",
      query: gql`
        {
          settings {
            signupsFrozen
            maintenanceMode
          }
        }
      `
    })
      .then(response => response.data)
      .then(data => dispatch(homeGetSettingsSuccess(data)))
      .catch(error => console.log(error))
  }
}

export function setSignupsFrozen(on) {
  return (dispatch) => {
    return GraphQLClient.Client().mutate({
      errorPolicy: "ignore",
      mutation: gql`
        mutation {
          updateSettings(freezeSignups: ${on})
        }
      `
    })
      .then(response => response.data)
      .then(data => dispatch(homeSwitchFreezeSignups(on)))
      .catch(error => console.log(error))
  }
}

export function setMaintenanceMode(on) {
  return (dispatch) => {
    return GraphQLClient.Client().mutate({
      errorPolicy: "ignore",
      mutation: gql`
        mutation {
          updateSettings(maintenanceMode: ${on})
        }
      `
    })
      .then(response => response.data)
      .then(data => dispatch(homeSwitchMaintenanceMode(on)))
      .catch(error => console.log(error))
  }
}

export const HOME_SWITCH_FREEZE_SIGNUPS = 'HOME_SWITCH_FREEZE_SIGNUPS'

export function homeSwitchFreezeSignups(on) {
  return {
    type: HOME_SWITCH_FREEZE_SIGNUPS,
    on
  }
}

export const HOME_SWITCH_MAINTENANCE_MODE = 'HOME_SWITCH_MAINTENANCE_MODE'

export function homeSwitchMaintenanceMode(on) {
  return {
    type: HOME_SWITCH_MAINTENANCE_MODE,
    on
  }
}

export const HOME_GET_SETTINGS_SUCCESS = 'HOME_GET_SETTINGS_SUCCESS'

export function homeGetSettingsSuccess(data) {
  return {
    type: HOME_GET_SETTINGS_SUCCESS,
    data
  }
}
