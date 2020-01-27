import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { Container, Menu, Message } from 'semantic-ui-react';

import store from './store';
import { getAuthUserHandler, setIsAuthenticatedActionCreator } from './actions';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import Admin from './Admin';
import SheetsListing from './Sheets/SheetsListing';
import DataSheet from './Sheets/DataSheet';

const NavBar = ({ isAuthenticated, isAdmin }) => (
  <Menu>
    {isAuthenticated && (
      <Fragment>
        <Menu.Item><Link to="/">Feuilles</Link></Menu.Item>
        {isAdmin && <Menu.Item><Link to="/admin">Admin</Link></Menu.Item>}
      </Fragment>
    )}
    <Menu.Menu position="right">
      <Menu.Item>
        {isAuthenticated ? (
          <Link to="/logout">Déconnexion</Link>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);
NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

class MainRouter extends Component {
  async componentDidMount() {
    const { onAuth, getAuthUser } = this.props;

    if (localStorage.getItem('token')) {
      await getAuthUser();
      await onAuth();
    }
  }

  render() {
    const { isAuthenticated, isAdmin } = this.props;

    return (
      <Router>
        <NavBar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        <Container>
          <Route path="/" exact component={SheetsListing} />
          <Route path="/login" exact component={Login} />
          <Route path="/logout" exact component={Logout} />
          <Route path="/pending-validation" exact component={() => <Message>Compte en attente de validation</Message>} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/datasheet/:sheetId" component={DataSheet} />
        </Container>
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
