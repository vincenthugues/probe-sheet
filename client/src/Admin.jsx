import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { fetchUsers } from './apiHandler';

const MainView = styled.div`
  padding: 10px;
`;

export default class SheetsListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      screen: null,
      data: null,
      username: '',
    };
  }

  componentDidMount = async () => {
    const users = await fetchUsers();

    // this.auth();
    this.readCookie();

    this.setState({
      users,
    });
  }

  auth = async () => {
    try {
      const { username, password } = this.state;
      const res = await axios.get('/authenticate', {
        auth: {
          username,
          password,
        },
      });

      if (res.data.screen !== undefined) {
        this.setState({ screen: res.data.screen });
      }
    } catch (e) {
      console.log(e);
    }
  };

  readCookie = async () => {
    try {
      const res = await axios.get('/read-cookie');

      if (res.data.screen !== undefined) {
        this.setState({ screen: res.data.screen });
      }
    } catch (e) {
      this.setState({ screen: 'auth' });
      console.log(e);
    }
  };

  deleteCookie = async () => {
    try {
      await axios.get('/clear-cookie');
      this.setState({ screen: 'auth' });
    } catch (e) {
      console.log(e);
    }
  };

  getData = async () => {
    try {
      const res = await axios.get('/get-data');
      console.log(res.data);
      this.setState({ data: res.data });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { users, screen, data } = this.state;

    return (
      <MainView>
        <h2>Users</h2>
        {users.map(({ id, username }) => (
          <div key={id}>
            {`[${id}] ${username}`}
          </div>
        ))}

        {screen === 'auth' ? (
          <div>
            <label htmlFor="username">
              Username:
              <br />
              <input id="username" type="text" onChange={e => this.setState({ username: e.target.value })} />
            </label>
            <br />
            <label htmlFor="password">
              Password:
              <br />
              <input id="password" type="password" onChange={e => this.setState({ password: e.target.value })} />
            </label>
            <br />
            <button type="button" onClick={this.auth}>Login</button>
          </div>
        ) : (
          <div>
            <p>{screen}</p>
            <p>{data}</p>
            <button type="button" onClick={this.getData}>Get Data</button>
            <button type="button" onClick={this.deleteCookie}>Logout</button>
          </div>
        )
      }
      </MainView>
    );
  }
}
