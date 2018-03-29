import APIClient from '../SocketClient'
import gql from 'graphql-tag';
import GraphQLClient from '../GraphQLClient'

import * as create from "./creators/login"


export const login = payload => async (dispatch) => {
	dispatch(create.loginRequest())

	try {
		const { data } = await APIClient.getInstance().authenticateWithPromise(
			payload.username,
			payload.password,
		)

		if (data) {
			APIClient.getInstance().updateAuthToken(data.session.id)
			dispatch(create.loginSuccess({ ...data, username: data.user.username }))
			localStorage.setItem("session", JSON.stringify(data.session))
      window.location.replace('/admin')
		} else {
			throw new Error("An error occurred!")
		}
	} catch (error) {
		dispatch(create.loginError(error.message))
	}
}

export const resetApp = (dispatch, resolve) => {
	dispatch(create.logout())
	localStorage.removeItem("session")
	window.location.replace('/admin/login')
	APIClient.getInstance().updateAuthToken(null)
	resolve()
}

export const logout = () => dispatch =>
	new Promise(async (resolve) => {
		const msg = { rpc: "logout" }
		try {
			await APIClient.getInstance().RPCRequest(msg)
			resetApp(dispatch, resolve)
		} catch (error) {
			resetApp(dispatch, resolve)
		}
	})

	export const resetPassword = usernames => async (dispatch) => {
	  dispatch(create.resetPasswordRequest(true))

	  try {
	    const response = await GraphQLClient.Client().mutate({
	      query: gql`
	        {
	          resetPassword(usernames:${usernames})
	        }
	      `
	    })
	    dispatch(create.resetPasswordSuccess(response.data))
	  } catch (e) {
	    dispatch(create.resetPasswordError(e))
	  }
	}
