import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

import Login from './Login';
import Admin from './Admin';
import SheetsListing from './SheetsListing';
import DataSheet from './DataSheet';

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

const MenuLinkView = styled(Link)`
  color: white;
  margin: .4em;
  text-decoration: none;
`;

export default () => (
  <div className="App">
    <Router>
      <MainView>
        <NavView>
          <MenuLinkView to="/">Home</MenuLinkView>
          <MenuLinkView to="/login">Login</MenuLinkView>
          <MenuLinkView to="/admin">Admin</MenuLinkView>
        </NavView>
        <Route path="/" exact component={SheetsListing} />
        <Route path="/login" exact component={Login} />
        <Route path="/admin" exact component={Admin} />
        <Route path="/datasheet/:sheetId" component={DataSheet} />
      </MainView>
    </Router>
  </div>
);
