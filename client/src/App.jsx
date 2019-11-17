import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import styled from 'styled-components';

import store from './store';
import { getAuthUserHandler, setIsAuthenticatedActionCreator } from './actions';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import Admin from './Admin';
import SheetsListing from './Sheets/SheetsListing';
import DataSheet from './Sheets/DataSheet';

const MainView = styled.div`
  text-align: center;
`;

const NavView = styled.nav`
  display: flex;
  flex: 1 0 auto;
  justify-items: center;

  background-color: #282c34;
  align-items: center;
  font-size: 1.4rem;
  color: white;
  padding-bottom: 10px;
`;

const NavLinkView = styled(Link)`
  color: white;
  margin: .4em;
  text-decoration: none;
`;

const NavBar = ({ isAuthenticated, isAdmin }) => (
  <NavView>
    {isAuthenticated ? (
      <Fragment>
        <NavLinkView to="/">Index</NavLinkView>
        {isAdmin ? <NavLinkView to="/admin">Admin</NavLinkView> : null}
        <NavLinkView to="/logout">Déconnexion</NavLinkView>
      </Fragment>
    ) : (
      <NavLinkView to="/login">Connexion</NavLinkView>
    )}
  </NavView>
);
NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

class MainRouter extends Component {
  componentDidMount() {
    const { onAuth, getAuthUser } = this.props;

    if (localStorage.getItem('token')) {
      getAuthUser();
      onAuth();
    }
  }

  render() {
    const { isAuthenticated, isAdmin } = this.props;

    return (
      <Router>
        <MainView>
          <NavBar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
          <Route path="/" exact component={SheetsListing} />
          <Route path="/login" exact component={Login} />
          <Route path="/logout" exact component={Logout} />
          <Route path="/pending-validation" exact component={() => <div>Account pending validation</div>} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/datasheet/:sheetId" component={DataSheet} />
        </MainView>
      </Router>
    );
  }
}
MainRouter.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired,
  getAuthUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { isAuthenticated, user } }) => ({
  isAuthenticated,
  isValidated: !!(user && user.isValidated),
  isAdmin: !!(user && user.role === 'admin'),
});

const mapDispatchToProps = dispatch => ({
  onAuth: () => dispatch(setIsAuthenticatedActionCreator(true)),
  getAuthUser: getAuthUserHandler(dispatch),
});

const ConnectedMainRouter = connect(mapStateToProps, mapDispatchToProps)(MainRouter);

const App = () => (
  <div className="App">
    <Provider store={store}>
      <ConnectedMainRouter />
    </Provider>
  </div>
);

export default App;
