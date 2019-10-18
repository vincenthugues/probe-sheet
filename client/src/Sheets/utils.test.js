import {
  getProbeTdBackgroundColor,
  getFilteredSheetIds,
  getUserRole,
  guessNextProbeType,
} from './utils';
import { PROBE_TYPE } from '../constants';

test('returns proper daily probe color for incomplete streak', () => {
  const response = true;
  const type = PROBE_TYPE.DAILY;
  const count = 2;
  const dailyProbesStreak = 3;

  const expectedValue = 'none';

  expect(getProbeTdBackgroundColor(response, type, count, dailyProbesStreak)).toBe(expectedValue);
});

test('returns proper daily probe color for complete streak', () => {
  const response = true;
  const type = PROBE_TYPE.DAILY;
  const count = 3;
  const dailyProbesStreak = 3;

  const expectedValue = '#FFEE55';

  expect(getProbeTdBackgroundColor(response, type, count, dailyProbesStreak)).toBe(expectedValue);
});

test('gets filtered sheet ids without filters', () => {
  const sheets = [
    { id: 1, student: 'student A', skillDomain: 'skillDomain A' },
    { id: 2, student: 'student A', skillDomain: 'skillDomain B' },
    { id: 3, student: 'student B', skillDomain: 'skillDomain A' },
    { id: 4, student: 'student B', skillDomain: 'skillDomain C' },
  ];
  const filters = undefined;

  const expectedValue = [1, 2, 3, 4];

  expect(getFilteredSheetIds(sheets, filters)).toEqual(expectedValue);
});

test('gets filtered sheet ids with student filter', () => {
  const sheets = [
    { id: 1, student: 'student A', skillDomain: 'skillDomain A' },
    { id: 2, student: 'student A', skillDomain: 'skillDomain B' },
    { id: 3, student: 'student B', skillDomain: 'skillDomain A' },
    { id: 4, student: 'student B', skillDomain: 'skillDomain C' },
  ];
  const filters = { student: 'student A' };

  const expectedValue = [1, 2];

  expect(getFilteredSheetIds(sheets, filters)).toEqual(expectedValue);
});

test('gets filtered sheet ids with skillDomain filter', () => {
  const sheets = [
    { id: 1, student: 'student A', skillDomain: 'skillDomain A' },
    { id: 2, student: 'student A', skillDomain: 'skillDomain B' },
    { id: 3, student: 'student B', skillDomain: 'skillDomain A' },
    { id: 4, student: 'student B', skillDomain: 'skillDomain C' },
  ];
  const filters = { skillDomain: 'skillDomain A' };

  const expectedValue = [1, 3];

  expect(getFilteredSheetIds(sheets, filters)).toEqual(expectedValue);
});

test('gets filtered sheet ids with student and skillDomain filters', () => {
  const sheets = [
    { id: 1, student: 'student A', skillDomain: 'skillDomain A' },
    { id: 2, student: 'student A', skillDomain: 'skillDomain B' },
    { id: 3, student: 'student B', skillDomain: 'skillDomain A' },
    { id: 4, student: 'student B', skillDomain: 'skillDomain C' },
  ];
  const filters = { student: 'student B', skillDomain: 'skillDomain A' };

  const expectedValue = [3];

  expect(getFilteredSheetIds(sheets, filters)).toEqual(expectedValue);
});

test('gets user role for owner', () => {
  const sheet = {
    ownerId: 1,
  };
  const user = {
    id: 1,
    email: 'user1@example.com',
  };
  const sheetAccessRights = [];

  const expectedValue = 'owner';

  expect(getUserRole(sheet, user, sheetAccessRights)).toBe(expectedValue);
});

test('gets user role for contributor', () => {
  const sheet = {
    ownerId: 1,
  };
  const user = {
    id: 2,
    email: 'user2@example.com',
  };
  const sheetAccessRights = [
    {
      email: 'user2@example.com',
      role: 'contributor',
    },
  ];

  const expectedValue = 'contributor';

  expect(getUserRole(sheet, user, sheetAccessRights)).toBe(expectedValue);
});

test('gets user role for viewer', () => {
  const sheet = {
    ownerId: 1,
  };
  const user = {
    id: 3,
    email: 'user3@example.com',
  };
  const sheetAccessRights = [
    {
      email: 'user3@example.com',
      role: 'viewer',
    },
  ];

  const expectedValue = 'viewer';

  expect(getUserRole(sheet, user, sheetAccessRights)).toBe(expectedValue);
});

test('gets user role for unallowed user', () => {
  const sheet = {
    ownerId: 1,
  };
  const user = {
    id: 4,
    email: 'user4@example.com',
  };
  const sheetAccessRights = [];

  const expectedValue = null;

  expect(getUserRole(sheet, user, sheetAccessRights)).toBe(expectedValue);
});

test('gets next probe type for first probe', () => {
  const baselineProbesNumber = 3;
  const dailyProbesStreak = 3;
  const targetCellsStreaks = [];
  const probes = [];

  expect(guessNextProbeType(
    baselineProbesNumber,
    dailyProbesStreak,
    targetCellsStreaks,
    probes,
  )).toBe(PROBE_TYPE.BASELINE);
});

test('gets next probe type after enough baseline probes', () => {
  const baselineProbesNumber = 3;
  const dailyProbesStreak = 3;
  const targetCellsStreaks = [0, 0, 0];
  const probes = [
    { type: PROBE_TYPE.BASELINE, response: false },
    { type: PROBE_TYPE.BASELINE, response: false },
    { type: PROBE_TYPE.BASELINE, response: false },
  ];

  expect(guessNextProbeType(
    baselineProbesNumber,
    dailyProbesStreak,
    targetCellsStreaks,
    probes,
  )).toBe(PROBE_TYPE.DAILY);
});

test('gets next probe type after too few daily probes', () => {
  const baselineProbesNumber = 1;
  const dailyProbesStreak = 2;
  const targetCellsStreaks = [0, 0, 0];
  const probes = [
    { type: PROBE_TYPE.BASELINE, response: false },
    { type: PROBE_TYPE.DAILY, response: false },
    { type: PROBE_TYPE.DAILY, response: false },
  ];

  expect(guessNextProbeType(
    baselineProbesNumber,
    dailyProbesStreak,
    targetCellsStreaks,
    probes,
  )).toBe(PROBE_TYPE.DAILY);
});

test('gets next probe type after enough daily probes', () => {
  const baselineProbesNumber = 1;
  const dailyProbesStreak = 2;
  const targetCellsStreaks = [0, 0, 1, 2];
  const probes = [
    { type: PROBE_TYPE.BASELINE, response: false },
    { type: PROBE_TYPE.DAILY, response: false },
    { type: PROBE_TYPE.DAILY, response: true },
    { type: PROBE_TYPE.DAILY, response: true },
  ];

  expect(guessNextProbeType(
    baselineProbesNumber,
    dailyProbesStreak,
    targetCellsStreaks,
    probes,
  )).toBe(PROBE_TYPE.RETENTION);
});
