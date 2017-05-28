import Auth0Lock from 'auth0-lock'

const options = {
  allowedConnections: ['google-oauth2'],
  allowSignUp: false,
  auth: {
    redirectUrl: 'http://localhost:8080/oauth/authorize',
    responseMode: 'form_post',
    params: {
      scope: 'openid email'
    }
  }
}

export default class AuthService {
  constructor(clientID, domain) {
    this.lock = new Auth0Lock(clientID, domain, options)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  authenticate(accessToken, replace, callback) {
    this.lock.getUserInfo(accessToken, (error, profile) => {
      if (error) {
        console.log(error)
        return;
      }
      localStorage.setItem("profile", JSON.stringify(profile));
      this.setToken(accessToken)
      replace({ pathname: '/admin' })
      callback()
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
