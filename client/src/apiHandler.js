/* eslint-disable no-console */

import axios from 'axios';
import { pick } from 'ramda';

const SERVER_URL = '/api';

export const getHeadersConfig = () => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};

// ////////////////
// AUTH
// ////////////////

export const authenticate = async (email, password) => {
  try {
    const { data: { token, user } } = await axios.post(
      `${SERVER_URL}/auth`,
      JSON.stringify({
        email,
        password,
      }),
      getHeadersConfig(),
    );

    return { token, user };
  } catch (err) {
    console.error('error authenticating', err);
    throw err;
  }
};

export const fetchAuthUser = async () => {
  try {
    const { data: user } = await axios.get(`${SERVER_URL}/auth/user`, getHeadersConfig());

    return user;
  } catch (err) {
    console.error('error fetching auth user', err);
    throw err;
  }
};

// ////////////////
// USERS
// ////////////////

export const fetchUsers = async () => {
  try {
    const { data: users } = await axios.get(`${SERVER_URL}/users`, getHeadersConfig());

    return users;
  } catch (err) {
    console.error('error fetching users', err);
    throw err;
  }
};

export const fetchUser = async (userId) => {
  try {
    const { data: user } = await axios.get(`${SERVER_URL}/users/${userId}`, getHeadersConfig());

    return user;
  } catch (err) {
    console.error('error fetching user', err);
    throw err;
  }
};

export const createUser = async (username, email, password) => {
  try {
    const { data: { token, user } } = await axios.post(
      `${SERVER_URL}/users`,
      { username, email, password },
    );

    return { token, user };
  } catch (err) {
    console.error('error creating user', err);
    throw err;
  }
};

export const validateUser = async (userId) => {
  try {
    const { data: { user } } = await axios.post(
      `${SERVER_URL}/users/${userId}/validate`,
      null,
      getHeadersConfig(),
    );

    return user;
  } catch (err) {
    console.error('error validating user', err);
    throw err;
  }
};

// ////////////////
// SHEETS
// ////////////////

export const fetchSheets = async () => {
  try {
    const { data: sheets } = await axios.get(`${SERVER_URL}/sheets`, getHeadersConfig());

    return sheets;
  } catch (err) {
    console.error('error fetching sheets', err);
    throw err;
  }
};

export const fetchSheet = async (sheetId) => {
  try {
    const { data: sheet } = await axios.get(`${SERVER_URL}/sheets/${sheetId}`, getHeadersConfig());

    return sheet;
  } catch (err) {
    console.error('error fetching sheet', err);
    throw err;
  }
};

export const createSheet = async (draft) => {
  try {
    const { data: sheet } = await axios.post(
      `${SERVER_URL}/sheets`,
      pick([
        'student',
        'skillDomain',
      ], draft),
      getHeadersConfig(),
    );

    return sheet;
  } catch (err) {
    console.error('error creating sheet', err);
    throw err;
  }
};

export const fetchSheetAccessRights = async (sheetId) => {
  try {
    const { data: accessRights } = await axios.get(`${SERVER_URL}/sheets/${sheetId}/access-rights`, getHeadersConfig());

    return accessRights;
  } catch (err) {
    console.error("error fetching sheet's access rights", err);
    throw err;
  }
};

export const createSheetAccessRight = async (sheetId, email, role) => {
  try {
    const { data: accessRight } = await axios.post(
      `${SERVER_URL}/sheets/${sheetId}/access-rights`,
      { sheetId, email, role },
      getHeadersConfig(),
    );

    return accessRight;
  } catch (err) {
    console.error("error creating sheet's access right", err);
    throw err;
  }
};

// ////////////////
// TARGETS
// ////////////////

export const fetchTargets = async (sheetId) => {
  try {
    const { data: targets } = await axios.get(`${SERVER_URL}/targets${sheetId ? `?sheetId=${sheetId}` : ''}`, getHeadersConfig());

    return targets;
  } catch (err) {
    console.error('error fetching targets', err);
    throw err;
  }
};

export const updateTarget = async (target) => {
  try {
    const { match: { param: { sheetId } } } = this.props;
    const { data: updatedTarget } = await axios.patch(
      `${SERVER_URL}/targets/${sheetId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target }),
      },
      getHeadersConfig(),
    );

    return updatedTarget;
  } catch (err) {
    console.error('error fetching targets', err);
    throw err;
  }
};

export const createTarget = async (draft) => {
  try {
    const { data: target } = await axios.post(
      `${SERVER_URL}/targets`,
      pick([
        'name',
        'baselineProbesNumber',
        'dailyProbesStreak',
        'ownerId',
        'sheetId',
        'createdAt',
      ], draft),
      getHeadersConfig(),
    );

    return target;
  } catch (err) {
    console.error('error creating target', err);
    throw err;
  }
};

// ////////////////
// PROBES
// ////////////////

export const fetchProbes = async (targetId) => {
  try {
    const { data: probes } = await axios.get(`${SERVER_URL}/probes?targetId=${targetId}`, getHeadersConfig());

    return probes;
  } catch (err) {
    console.error('error fetching probes', err);
    throw err;
  }
};

export const createProbe = async (draft) => {
  try {
    const { data: probe } = await axios.post(
      `${SERVER_URL}/probes`,
      pick([
        'ownerId',
        'therapist',
        'targetId',
        'type',
        'date',
        'response',
      ], draft),
      getHeadersConfig(),
    );

    return probe;
  } catch (err) {
    console.error('error creating probe', err);
    throw err;
  }
};

// ////////////////
// COMMENTS
// ////////////////

export const fetchComments = async (probeId) => {
  try {
    const { data: comments } = await axios.get(`${SERVER_URL}/comments?probeId=${probeId}`, getHeadersConfig());

    return comments;
  } catch (err) {
    console.error('error fetching comments', err);
    throw err;
  }
};

export const createComment = async (text, probeId) => {
  try {
    const { data: comment } = await axios.post(
      `${SERVER_URL}/comments`,
      {
        text,
        probeId,
      },
      getHeadersConfig(),
    );

    return comment;
  } catch (err) {
    console.error('error creating comment', err);
    throw err;
  }
};
