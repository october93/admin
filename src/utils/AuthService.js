import Auth0Lock from 'auth0-lock'

const options = {
  allowedConnections: ['google-oauth2'],
  allowSignUp: false,
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
      localStorage.setItem("profile", JSON.stringify(profile));
      this.setToken(authResult.id_token)
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
    this.lock.logout({ returnTo: 'http://localhost:3000/admin/login' })
    localStorage.removeItem('id_token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('profile')
  }

  loggedIn() {
    return !!this.getToken()
  }

  setToken(idToken) {
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
    return localStorage.getItem('id_token')
  }
}
