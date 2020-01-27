import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Button, Container, Form, Grid, Header, Icon, Message, Segment,
} from 'semantic-ui-react';

import { isEmpty } from 'ramda';
import { authenticate, createUser } from '../apiHandler';
import { setIsAuthenticatedActionCreator, setUserActionCreator } from '../actions';

const LoginForm = ({ onLoginConfirm, onSignupOpen }) => {
  const [state, setState] = useState({ email: '', password: '' });
  const { email, password } = state;

  const handleChange = (e, { name, value }) => setState({ ...state, [name]: value });
  const handleSubmit = () => onLoginConfirm(email, password);

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="top">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="user circle" size="small" />
          Connexion
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment>
            <Form.Input
              placeholder="Email"
              name="email"
              value={email}
              fluid
              icon="mail"
              iconPosition="left"
              autoComplete="email"
              onChange={handleChange}
            />
            <Form.Input
              placeholder="Mot de passe"
              name="password"
              value={password}
              type="password"
              fluid
              icon="lock"
              iconPosition="left"
              autoComplete="current-password"
              onChange={handleChange}
            />

            <Button color="teal" content="Se connecter" disabled={isEmpty(email) || isEmpty(password)} />
          </Segment>
        </Form>
        <Message>
          Pas de compte ?
          {' '}
          <Button basic compact type="button" content="Créer un compte utilisateur" onClick={onSignupOpen} />
        </Message>
      </Grid.Column>
    </Grid>
  );
};
LoginForm.propTypes = {
  onLoginConfirm: PropTypes.func.isRequired,
  onSignupOpen: PropTypes.func.isRequired,
};

const SignupForm = ({ onSignupConfirm, onSignupClose }) => {
  const [state, setState] = useState({
    email: '',
    username: '',
    password: '',
  });
  const { email, username, password } = state;

  const handleChange = (e, { name, value }) => setState({ ...state, [name]: value });
  const handleSubmit = () => onSignupConfirm(email, username, password);

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="top">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="user circle" size="small" />
          Inscription
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment>
            <Form.Input
              placeholder="Nom d'utilisateur"
              name="username"
              value={username}
              fluid
              icon="user"
              iconPosition="left"
              autoComplete="username"
              onChange={handleChange}
            />
            <Form.Input
              placeholder="Email"
              name="email"
              value={email}
              fluid
              icon="mail"
              iconPosition="left"
              autoComplete="email"
              onChange={handleChange}
            />
            <Form.Input
              placeholder="Mot de passe"
              name="password"
              value={password}
              type="password"
              fluid
              icon="lock"
              iconPosition="left"
              autoComplete="new-password"
              onChange={handleChange}
            />
            <Button color="teal" type="submit" content="Inscription" disabled={isEmpty(email) || isEmpty(username) || isEmpty(password)} />
          </Segment>
        </Form>
        <Message>
          Déjà un compte ?
          {' '}
          <Button basic compact type="button" content="Se connecter" onClick={onSignupClose} />
        </Message>
      </Grid.Column>
    </Grid>
  );
};
SignupForm.propTypes = {
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

const Login = ({ isAuthenticated, onAuth }) => {
  const [state, setState] = useState({
    isSignupOpen: false,
    errorMessage: null,
  });
  const { isSignupOpen, errorMessage } = state;

  const login = async (email, password) => {
    try {
      const { token, user } = await authenticate(email, password);

      localStorage.setItem('token', token);

      setState({ ...state, errorMessage: null });

      onAuth(user);
    } catch (error) {
      setState({ ...state, errorMessage: error.message });
    }
  };

  const signup = async (email, username, password) => {
    try {
      const { token, user } = await createUser(username, email, password);

      localStorage.setItem('token', token);

      setState({ ...state, errorMessage: null });

      onAuth(user);
    } catch (error) {
      setState({ ...state, errorMessage: error.message });
    }
  };

  return (
    <Container>
      {isAuthenticated && <Redirect to="/" />}
      {errorMessage && <div>{errorMessage}</div>}
      {isSignupOpen ? (
        <SignupForm
          onSignupConfirm={signup}
          onSignupClose={() => setState({ ...state, isSignupOpen: false })}
        />
      ) : (
        <LoginForm
          onLoginConfirm={login}
          onSignupOpen={() => setState({ ...state, isSignupOpen: true })}
        />
      )}
    </Container>
  );
};
Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
