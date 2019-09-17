import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { fetchUsers } from './apiHandler';

const MainView = styled.div`
  padding: 10px;
`;

export default class SheetsListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserAuthenticated: !!localStorage.getItem('token'),
      users: [],
    };
  }

  componentDidMount = async () => {
    try {
      if (localStorage.getItem('token')) {
        const users = await fetchUsers();
        this.setState({ users });
      }
    } catch (err) {
      console.log('error:', err);
    }
  }

  render() {
    const { isUserAuthenticated, users } = this.state;

    if (!isUserAuthenticated) return <Redirect to="/login" />;

    return (
      <MainView>
        {users.length > 0 && (
          <Fragment>
            <h2>Users</h2>
            { users.map(({ id, username }) => (
              <div key={id}>
                {`[${id}] ${username}`}
              </div>
            ))}
          </Fragment>
        )}
      </MainView>
    );
  }
}
