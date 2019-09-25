import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { setIsAuthenticatedActionCreator, setUserActionCreator } from '../actions';

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  resetUser: () => {
    dispatch(setUserActionCreator(null));
    dispatch(setIsAuthenticatedActionCreator(false));
  },
});

class Logout extends Component {
  componentDidMount = () => {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      this.logout();
    }
  }

  logout = () => {
    const { resetUser } = this.props;

    localStorage.removeItem('token');
    resetUser();
  }

  render() {
    return <Redirect to="/login" />;
  }
}
Logout.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  resetUser: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout);
