import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';

export default class Logout extends Component {
  componentDidMount = async () => {
    if (localStorage.getItem('token')) {
      this.logout();
    }
  }

  logout = () => {
    localStorage.removeItem('token');
  }

  render() {
    return (
      <Fragment>
        <Redirect to="/login" />
      </Fragment>
    );
  }
}
