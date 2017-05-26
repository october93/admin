import Auth0Lock from 'auth0-lock'

const options = {
  allowedConnections: ['google-oauth2'],
  allowSignUp: false
}

export default class AuthService {
  constructor(clientID, domain) {
    this.lock = new Auth0Lock(clientID, domain, options)
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    this.login = this.login.bind(this)
  }

  _doAuthentication(authResult) {
    this.lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) {
        console.log(error)
        return;
      }
      localStorage.setItem("accessToken", authResult.accessToken);
      localStorage.setItem("profile", JSON.stringify(profile));
    });
    this.setToken(authResult.idToken)
  }

  login() {
    this.lock.show()
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
