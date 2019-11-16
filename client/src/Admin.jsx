import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { fetchUsers, validateUser } from './apiHandler';

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
      const users = await fetchUsers();
      this.setState({ users });
    } catch (err) {
      console.log('error:', err);
    }
  }

  render() {
    const { isUserAuthenticated, users } = this.state;

    if (!isUserAuthenticated) return <Redirect to="/login" />;

    return (
      <MainView>
        <h2>Users</h2>
        {users.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>username</th>
                <th>email</th>
                <th>role</th>
                <th>isValidated</th>
              </tr>
            </thead>
            <tbody>
              { users.map(({
                id, username, email, role, isValidated,
              }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{username}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>
                    <button
                      type="button"
                      disabled={isValidated}
                      onClick={async () => {
                        await validateUser(id);
                        const updatedUsers = await fetchUsers();
                        this.setState({ users: updatedUsers });
                      }}
                    >
                      {isValidated ? 'Validated' : 'Validate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </MainView>
    );
  }
}
