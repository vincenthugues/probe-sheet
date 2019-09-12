/* eslint-disable no-console */

import axios from 'axios';
import { pick } from 'ramda';

const SERVER_URL = 'http://localhost:5000';

// ////////////////
// USERS
// ////////////////

export const fetchUsers = async () => {
  try {
    const { data: users } = await axios.get(`${SERVER_URL}/users`);

    return users;
  } catch (err) {
    console.error('error fetching users', err);
    throw err;
  }
};

export const fetchUser = async (userId) => {
  try {
    const { data: user } = await axios.get(`${SERVER_URL}/users/${userId}`);

    return user;
  } catch (err) {
    console.error('error fetching user', err);
    throw err;
  }
};

export const createUser = async (email, password) => {
  try {
    const { data: user } = await axios.post(
      `${SERVER_URL}/users`,
      JSON.stringify({ email, password }), // TODO
    );

    return user;
  } catch (err) {
    console.error('error creating user', err);
    throw err;
  }
};

// ////////////////
// SHEETS
// ////////////////

export const fetchSheets = async () => {
  try {
    const { data: sheets } = await axios.get(`${SERVER_URL}/sheets`);

    return sheets;
  } catch (err) {
    console.error('error fetching sheets', err);
    throw err;
  }
};

export const createSheet = async (draft) => {
  try {
    console.log('draft', draft);
    const { data: sheet } = await axios.post(
      `${SERVER_URL}/sheets`,
      pick([
        'student',
        'skillDomain',
      ], draft),
    );

    return sheet;
  } catch (err) {
    console.error('error creating sheet', err);
    throw err;
  }
};

// ////////////////
// TARGETS
// ////////////////

export const fetchTargets = async (sheetId) => {
  try {
    const { data: targets } = await axios.get(`${SERVER_URL}/targets`);

    return targets.filter(({ sheetId: targetSheetId }) => targetSheetId === sheetId);
  } catch (err) {
    console.error('error fetching targets', err);
    throw err;
  }
};

export const updateTarget = async (target) => {
  const { match: { param: { sheetId } } } = this.props;
  const response = await fetch(`${SERVER_URL}/targets/${sheetId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ target }),
  });
  const body = await response.json();
  console.log('body', body);
};

export const createTarget = async (draft) => {
  try {
    const { data: target } = await axios.post(
      `${SERVER_URL}/targets`,
      pick([
        'name',
        'creationDate',
        'baselineProbesNumber',
        'dailyProbesStreak',
        'ownerId',
        'sheetId',
      ], draft),
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

export const fetchProbes = async () => { // TODO: handle targetId
  try {
    const { data: probes } = await axios.get(`${SERVER_URL}/probes`);

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

export const fetchComments = async () => {
  try {
    const { data: comments } = await axios.get(`${SERVER_URL}/comments`);

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
    );

    return comment;
  } catch (err) {
    console.error('error creating comment', err);
    throw err;
  }
};
