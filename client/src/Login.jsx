import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { authenticate, createUser } from './apiHandler';

const MainView = styled.div`
  padding: 10px;
`;

class LoginBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'john.doe@example.com',
      password: 'admin',
    };
  }

  render() {
    const { onLoginConfirm, onSignupOpen } = this.props;
    const { email, password } = this.state;

    return (
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
        <button type="button" onClick={() => onLoginConfirm(email, password)}>Connexion</button>
        <br />
        <br />
        <button type="button" onClick={onSignupOpen}>Créer un compte</button>
      </Fragment>
    );
  }
}
LoginBlock.propTypes = {
  onLoginConfirm: PropTypes.func.isRequired,
  onSignupOpen: PropTypes.func.isRequired,
};

class SignupBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'john.doe@example.com',
      username: '',
      password: 'admin',
    };
  }

  render() {
    const { onSignupConfirm, onSignupClose } = this.props;
    const { email, username, password } = this.state;

    return (
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
        <button type="button" onClick={() => onSignupConfirm(email, username, password)}>Inscription</button>
        <br />
        <br />
        <button type="button" onClick={onSignupClose}>Annuler</button>
      </Fragment>
    );
  }
}
SignupBlock.propTypes = {
  onSignupConfirm: PropTypes.func.isRequired,
  onSignupClose: PropTypes.func.isRequired,
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignupOpen: false,
      errorMessage: null,
    };
  }

  login = async (email, password) => {
    try {
      const { token } = await authenticate(email, password);

      localStorage.setItem('token', token);

      this.setState({
        errorMessage: null,
        isUserAuthenticated: true,
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
        isUserAuthenticated: false,
      });
    }
  }

  signup = async (email, username, password) => {
    try {
      const { token } = await createUser(username, email, password);

      localStorage.setItem('token', token);

      this.setState({
        errorMessage: null,
        isUserAuthenticated: true,
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
        isUserAuthenticated: false,
      });
    }
  }

  render() {
    const { isUserAuthenticated, isSignupOpen, errorMessage } = this.state;

    return (
      <MainView>
        {isUserAuthenticated && <Redirect to="/" />}
        {errorMessage && <div>{errorMessage}</div>}
        {isSignupOpen ? (
          <SignupBlock
            onSignupConfirm={this.signup}
            onSignupClose={() => this.setState({ isSignupOpen: false })}
          />
        ) : (
          <LoginBlock
            onLoginConfirm={this.login}
            onSignupOpen={() => this.setState({ isSignupOpen: true })}
          />
        )}
      </MainView>
    );
  }
}

export default Login;
