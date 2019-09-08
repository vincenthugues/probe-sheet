import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { isEmpty } from 'ramda';

import { fetchUser, createUser } from './apiHandler';

const USER_ID = 1;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      isSignUpOpen: false,
    };
  }

  onLoginConfirm = async () => {
    const user = await fetchUser(USER_ID);

    console.log('user', user);
  }

  onLoginCancel = async () => {
    this.setState({
      email: null,
      password: null,
      isSignUpOpen: false,
    });
  }

  onSignUpOpen = async () => {
    this.setState({
      password: null,
      isSignUpOpen: true,
    });
  }

  onSignUpConfirm = async () => {
    const { email, password } = this.state;
    const newUser = await createUser(email, password);

    console.log('newUser', newUser);
  }

  onSignUpCancel = () => {
    this.setState({
      password: null,
      isSignUpOpen: false,
    });
  }

  render() {
    const { email, password, isSignUpOpen } = this.state;

    return (
      <div style={{
        border: 'dashed #B0B0B0 1px',
        display: 'flex',
        flex: '1 0 auto',
        flexDirection: 'column',
        justifyContent: 'space-around',
        maxWidth: '400px',
        margin: 'auto',
        padding: '.4em',
      }}
      >
        {isSignUpOpen ? (
          <form>
            <input placeholder="email" value={email || ''} onChange={({ target: { value } }) => this.setState({ email: value })} />
            <input placeholder="password" value={password || ''} onChange={({ target: { value } }) => this.setState({ password: value })} />
            <div>
              <button type="button" disabled={isEmpty(email) || isEmpty(password)} onClick={this.onSignUpConfirm}>
                Confirmer
              </button>
              <button type="button" onClick={this.onSignUpCancel}>
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <Fragment>
            <input placeholder="email" value={email || ''} onChange={({ target: { value } }) => this.setState({ email: value })} />
            <input placeholder="password" value={password || ''} onChange={({ target: { value } }) => this.setState({ password: value })} />
            <div>
              <button type="button" disabled={isEmpty(email) || isEmpty(password)} onClick={this.onLoginConfirm}>
                Confirmer
              </button>
              <Link to="/">
                <button type="button" onClick={this.onLoginCancel}>
                  Annuler
                </button>
              </Link>
            </div>
            <div>
              <button type="button" onClick={this.onSignUpOpen}>
                Créer un compte
              </button>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
