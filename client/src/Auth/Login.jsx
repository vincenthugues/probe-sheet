import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { authenticate, createUser } from '../apiHandler';
import { setIsAuthenticatedActionCreator, setUserActionCreator } from '../actions';

const MainView = styled.div`
  padding: 10px;
`;

class LoginBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  render() {
    const { onLoginConfirm, onSignupOpen } = this.props;
    const { email, password } = this.state;

    return (
      <Fragment>
        <form onSubmit={(e) => {
          onLoginConfirm(email, password);
          e.preventDefault();
        }}
        >
          <label htmlFor="email">
            Email:
            <br />
            <input id="email" type="text" autoComplete="email" value={email} onChange={e => this.setState({ email: e.target.value })} />
          </label>
          <br />
          <label htmlFor="password">
            Password:
            <br />
            <input id="password" type="password" autoComplete="current-password" value={password} onChange={e => this.setState({ password: e.target.value })} />
          </label>
          <br />
          <button type="submit">Connexion</button>
        </form>
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
      email: '',
      username: '',
      password: '',
    };
  }

  render() {
    const { onSignupConfirm, onSignupClose } = this.props;
    const { email, username, password } = this.state;

    return (
      <form onSubmit={(e) => {
        onSignupConfirm(email, username, password);
        e.preventDefault();
      }}
      >
        <label htmlFor="username">
          Username:
          <br />
          <input id="username" type="text" autoComplete="username" value={username} onChange={e => this.setState({ username: e.target.value })} />
        </label>
        <br />
        <label htmlFor="email">
          Email:
          <br />
          <input id="email" type="text" autoComplete="email" value={email} onChange={e => this.setState({ email: e.target.value })} />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <br />
          <input id="password" type="password" autoComplete="new-password" value={password} onChange={e => this.setState({ password: e.target.value })} />
        </label>
        <br />
        <button type="button">Inscription</button>
        <br />
        <br />
        <button type="button" onClick={onSignupClose}>Annuler</button>
      </form>
    );
  }
}
SignupBlock.propTypes = {
  onSignupConfirm: PropTypes.func.isRequired,
  onSignupClose: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  onAuth: (user) => {
    dispatch(setUserActionCreator(user));
    dispatch(setIsAuthenticatedActionCreator(true));
  },
});

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
      const { onAuth } = this.props;
      const { token, user } = await authenticate(email, password);

      localStorage.setItem('token', token);

      this.setState({ errorMessage: null });

      onAuth(user);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  signup = async (email, username, password) => {
    try {
      const { onAuth } = this.props;
      const { token, user } = await createUser(username, email, password);

      localStorage.setItem('token', token);

      this.setState({ errorMessage: null });

      onAuth(user);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    const { isAuthenticated } = this.props;
    const { isSignupOpen, errorMessage } = this.state;

    return (
      <MainView>
        {isAuthenticated && <Redirect to="/" />}
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
Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
