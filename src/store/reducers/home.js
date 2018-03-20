import {
  HOME_SWITCH_FREEZE_SIGNUPS,
  HOME_SWITCH_MAINTENANCE_MODE,
  HOME_GET_SETTINGS_SUCCESS
} from '../actions/home'

export function homeFreezeSignupsSwitched(state = null, action) {
  switch (action.type) {
    case HOME_SWITCH_FREEZE_SIGNUPS:
      return action.on
    default:
      return state
  }
}

export function homeMaintenanceModeSwitched(state = null, action) {
  switch (action.type) {
    case HOME_SWITCH_MAINTENANCE_MODE:
      return action.on
    default:
      return state
  }
}

export function homeGetSettingsSuccess(state = {signupsFrozen: false, maintenanceMode: false}, action) {
  switch (action.type) {
    case HOME_GET_SETTINGS_SUCCESS:
      return action.data.settings
    default:
      return state
  }
}
