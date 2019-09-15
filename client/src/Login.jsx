import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { authenticate, fetchAuthUser, createUser } from './apiHandler';

const MainView = styled.div`
  padding: 10px;
`;

export default class SheetsListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      user: null,
      email: 'john.doe@example.com',
      username: '',
      password: 'admin',
      isSignupOpen: false,
      errorMessage: null,
    };
  }

  componentDidMount = async () => {
    const { token } = this.state;

    try {
      if (token) {
        const user = await fetchAuthUser();
        this.setState({
          user,
          errorMessage: null,
        });
      }
    } catch (error) {
      this.setState({ errorMessage: error.message });
      this.logout();
    }
  }

  login = async () => {
    const { email, password } = this.state;

    try {
      const { user, token } = await authenticate(email, password);

      localStorage.setItem('token', token);

      this.setState({
        token,
        user,
        errorMessage: null,
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
        token: null,
      });
    }
  }

  logout = () => {
    localStorage.removeItem('token');

    this.setState({
      token: null,
      user: null,
      errorMessage: null,
    });
  }

  signup = async () => {
    const { username, email, password } = this.state;

    try {
      const { token, user } = await createUser(username, email, password);

      localStorage.setItem('token', token);

      this.setState({
        token,
        user,
        errorMessage: null,
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
        token: null,
      });
    }
  }

  // readCookie = async () => {
  //   try {
  //     const res = await axios.get('/read-cookie');

  //     if (res.data.screen !== undefined) {
  //       this.setState({ screen: res.data.screen });
  //     }
  //   } catch (e) {
  //     this.setState({ screen: 'auth' });
  //     console.log(e);
  //   }
  // };

  // deleteCookie = async () => {
  //   try {
  //     await axios.get('/clear-cookie');
  //     this.setState({ screen: 'auth' });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  render() {
    const {
      email,
      username,
      password,
      token,
      user,
      isSignupOpen,
      errorMessage,
    } = this.state;

    const Login = () => (
      <Fragment>
        <label htmlFor="email">
          Email:
          <br />
          <input id="email" type="text" value={email} onChange={e => this.setState({ email: e.target.value })} />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <br />
          <input id="password" type="password" value={password} onChange={e => this.setState({ password: e.target.value })} />
        </label>
        <br />
        <button type="button" onClick={this.login}>Connexion</button>
        <br />
        <br />
        <button type="button" onClick={() => this.setState({ isSignupOpen: true })}>Créer un compte</button>
      </Fragment>
    );

    const Signup = () => (
      <Fragment>
        <label htmlFor="username">
          Username:
          <br />
          <input id="username" type="text" value={username} onChange={e => this.setState({ username: e.target.value })} />
        </label>
        <br />
        <label htmlFor="email">
          Email:
          <br />
          <input id="email" type="text" value={email} onChange={e => this.setState({ email: e.target.value })} />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <br />
          <input id="password" type="password" value={password} onChange={e => this.setState({ password: e.target.value })} />
        </label>
        <br />
        <button type="button" onClick={this.signup}>Inscription</button>
        <br />
        <br />
        <button type="button" onClick={() => this.setState({ isSignupOpen: false })}>Annuler</button>
      </Fragment>
    );

    return (
      <MainView>
        {errorMessage && <div>{errorMessage}</div>}
        {token && (
          <Fragment>
            {user && <div>{`User ${user.username} authenticated`}</div>}
            <button type="button" onClick={this.logout}>Logout</button>
          </Fragment>
        )}
        {!token && (isSignupOpen ? <Signup id="signup" /> : <Login id="login" />)}
      </MainView>
    );
  }
}
