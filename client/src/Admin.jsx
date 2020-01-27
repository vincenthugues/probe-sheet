import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Container, Header, Table,
} from 'semantic-ui-react';

import { fetchUsers, validateUser } from './apiHandler';

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
      <Container>
        <Header as="h2" content="Users" />
        {users.length > 0 && (
          <Table compact striped selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>id</Table.HeaderCell>
                <Table.HeaderCell>username</Table.HeaderCell>
                <Table.HeaderCell>email</Table.HeaderCell>
                <Table.HeaderCell>role</Table.HeaderCell>
                <Table.HeaderCell>isValidated</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map(({
                id, username, email, role, isValidated,
              }) => (
                <Table.Row key={id}>
                  <Table.Cell>{id}</Table.Cell>
                  <Table.Cell>{username}</Table.Cell>
                  <Table.Cell>{email}</Table.Cell>
                  <Table.Cell>{role}</Table.Cell>
                  <Table.Cell>
                    <Button
                      content={isValidated ? 'Validated' : 'Validate'}
                      type="button"
                      disabled={isValidated}
                      onClick={async () => {
                        await validateUser(id);
                        const updatedUsers = await fetchUsers();
                        this.setState({ users: updatedUsers });
                      }}
                      size="mini"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Container>
    );
  }
}
