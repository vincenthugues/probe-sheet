import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

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

const Nav = () => (
  <NavView>
    <NavLinkView to="/">Index</NavLinkView>
    <NavLinkView to="/admin">Admin</NavLinkView>
    <NavLinkView to="/logout">Déconnexion</NavLinkView>
    <NavLinkView to="/login">Connexion</NavLinkView>
  </NavView>
);

const App = () => (
  <div className="App">
    <Router>
      <MainView>
        <Nav />
        <Route path="/" exact component={SheetsListing} />
        <Route path="/login" exact component={Login} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/admin" exact component={Admin} />
        <Route path="/datasheet/:sheetId" component={DataSheet} />
      </MainView>
    </Router>
  </div>
);

export default App;
