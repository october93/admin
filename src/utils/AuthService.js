import Auth0Lock from 'auth0-lock'

const options = {
  allowedConnections: ['google-oauth2'],
  allowSignUp: false,
  redirectUrl: 'http://localhost:3000/admin'
}

export default class AuthService {
  constructor(clientID, domain) {
    this.lock = new Auth0Lock(clientID, domain, options)
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
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
