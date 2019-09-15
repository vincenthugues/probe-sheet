import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { authenticate, createUser } from './apiHandler';

const MainView = styled.div`
  padding: 10px;
`;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      email: 'john.doe@example.com',
      username: '',
      password: 'admin',
      isSignupOpen: false,
      errorMessage: null,
    };
  }

  login = async () => {
    const { email, password } = this.state;

    try {
      const { token } = await authenticate(email, password);

      localStorage.setItem('token', token);

      this.setState({
        token,
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
      errorMessage: null,
    });
  }

  signup = async () => {
    const { username, email, password } = this.state;

    try {
      const { token } = await createUser(username, email, password);

      localStorage.setItem('token', token);

      this.setState({
        token,
        errorMessage: null,
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
        token: null,
      });
    }
  }

  render() {
    const {
      email,
      username,
      password,
      token,
      isSignupOpen,
      errorMessage,
    } = this.state;

    const LoginBlock = () => (
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

    const SignupBlock = () => (
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
        {token && <Redirect to="/" />}
        {errorMessage && <div>{errorMessage}</div>}
        {isSignupOpen ? <SignupBlock id="signup" /> : <LoginBlock id="login" />}
      </MainView>
    );
  }
}
