import Auth0Lock from 'auth0-lock'
import logo from '../components/AdminLayout/october.svg';

const loginURL = `${window.location.origin}/admin/login`

const options = {
  allowedConnections: ['google-oauth2'],
  allowSignUp: false,
  auth: {
    redirectUrl: loginURL,
    responseType: 'token'
  },
  theme: {
    logo: logo,
    primaryColor: '#1aafdb'
  },
  languageDictionary: {
    title: "October Admin Panel"
  }
}

export default class AuthService {
  constructor(clientID, domain) {
    this.lock = new Auth0Lock(clientID, domain, options)
    this.login = this.login.bind(this)
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    this.lock.on('authorization_error', this._handleError.bind(this))
    this.logout = this.logout.bind(this)
  }

  _doAuthentication(authResult) {
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      if (error) {
        console.log(error)
        return;
      }
      let expiresAt = authResult.idTokenPayload.exp * 1000
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("expires_at", expiresAt)
      this.setToken(authResult.idToken)
      location.pathname = '/admin'
    });
  }

  _handleError(error) {
    this.lock.show({
      flashMessage: {
        type: 'error',
        text: error.error_description
      }
    });
  }

  login() {
    this.lock.show()
  }

  logout() {
    this.lock.logout({ returnTo: loginURL })
    localStorage.removeItem('id_token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem("expires_at")
    localStorage.removeItem('profile')
  }

  loggedIn() {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return !!this.getToken() && new Date().getTime() < expiresAt;
  }

  setToken(token) {
    localStorage.setItem('accessToken', token)
  }

  getToken() {
    return localStorage.getItem('accessToken')
  }
}
