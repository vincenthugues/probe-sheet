import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutHandler } from '../actions';

class Logout extends Component {
  constructor(props) {
    super(props);
    const { isAuthenticated, logout } = this.props;

    if (isAuthenticated) {
      logout();
    }
  }

  render() {
    return <Redirect to="/login" />;
  }
}
Logout.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  logout: logoutHandler(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout);
