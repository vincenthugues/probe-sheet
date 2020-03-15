import {
  getProbeTdBackgroundColor,
  getFilteredSheetIds,
  getTargetsTableHeaders,
  sortByDate,
  getProbeStreak,
  getOrderedTargetProbes,
  isContinuingProbeStreak,
  getTargetsCellStreaks,
  getUserRole,
  guessNextProbeType,
} from './utils';
import { PROBE_TYPE } from '../constants';

describe('getProbeTdBackgroundColor', () => {
  it('should return proper daily probe color for incomplete streak', () => {
    const response = true;
    const type = PROBE_TYPE.DAILY;
    const count = 2;
    const dailyProbesStreak = 3;

    const expectedValue = 'none';

    expect(getProbeTdBackgroundColor(response, type, count, dailyProbesStreak)).toBe(expectedValue);
  });

  it('should return proper daily probe color for complete streak', () => {
    const response = true;
    const type = PROBE_TYPE.DAILY;
    const count = 3;
    const dailyProbesStreak = 3;

    const expectedValue = '#FFEE55';

    expect(getProbeTdBackgroundColor(response, type, count, dailyProbesStreak)).toBe(expectedValue);
  });
});

describe('getFilteredSheetIds', () => {
  it('should get filtered sheet ids without filters', () => {
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

  it('should get filtered sheet ids with student filter', () => {
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

  it('should get filtered sheet ids with skillDomain filter', () => {
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

  it('should get filtered sheet ids with student and skillDomain filters', () => {
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
});

describe('getTargetsTableHeaders', () => {
  it('should return targets\' table headers', () => {
    const targets = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const probes = [
      { targetId: 1, date: 0, type: PROBE_TYPE.BASELINE },
      { targetId: 1, date: 0, type: PROBE_TYPE.BASELINE },
      { targetId: 1, date: 0, type: PROBE_TYPE.BASELINE },
      { targetId: 1, date: 0, type: PROBE_TYPE.DAILY },
      { targetId: 2, date: 0, type: PROBE_TYPE.BASELINE },
    ];

    expect(getTargetsTableHeaders(targets, probes)).toStrictEqual({
      1: [{ type: PROBE_TYPE.BASELINE, span: 3 }, { type: PROBE_TYPE.DAILY, span: 1 }],
      2: [{ type: PROBE_TYPE.BASELINE, span: 1 }],
      3: [],
    });
  });
});

describe('sortByDate', () => {
  it('should sort elements according to their date property', () => {
    const arr = [
      { date: '2020-01-06T00:00:00.000Z' },
      { date: '2020-01-11T00:00:00.000Z' },
      { date: '2020-01-03T00:00:00.000Z' },
      { date: '2020-01-01T00:00:00.000Z' },
    ];

    expect(sortByDate(arr)).toStrictEqual([
      { date: '2020-01-01T00:00:00.000Z' },
      { date: '2020-01-03T00:00:00.000Z' },
      { date: '2020-01-06T00:00:00.000Z' },
      { date: '2020-01-11T00:00:00.000Z' },
    ]);
  });
});

describe('getProbeStreak', () => {
  it('should return 0 when starting with a "false" probe', () => {
    const probes = [
      { type: PROBE_TYPE.DAILY, response: false },
      { type: PROBE_TYPE.DAILY, response: true },
      { type: PROBE_TYPE.DAILY, response: true },
    ];

    expect(getProbeStreak(probes, PROBE_TYPE.DAILY)).toBe(0);
  });

  it('should return 1 for a "true" probe followed by a "false" probe', () => {
    const probes = [
      { type: PROBE_TYPE.DAILY, response: true },
      { type: PROBE_TYPE.DAILY, response: false },
      { type: PROBE_TYPE.DAILY, response: true },
      { type: PROBE_TYPE.DAILY, response: true },
    ];

    expect(getProbeStreak(probes, PROBE_TYPE.DAILY)).toBe(1);
  });

  it('should return 2 for 2 consecutive "true" probes', () => {
    const probes = [
      { type: PROBE_TYPE.DAILY, response: true },
      { type: PROBE_TYPE.DAILY, response: true },
      { type: PROBE_TYPE.DAILY, response: false },
      { type: PROBE_TYPE.DAILY, response: true },
    ];

    expect(getProbeStreak(probes, PROBE_TYPE.DAILY)).toBe(2);
  });
});

describe('getOrderedTargetProbes', () => {
  it('should return probes ordered by date', () => {
    const probes = [
      {
        targetId: 1, date: '2020-01-05T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-01T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: true,
      },
      {
        targetId: 1, date: '2020-01-06T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-02T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 1, date: '2020-01-03T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 1, date: '2020-01-10T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-11T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-08T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-04T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-07T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-09T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-12T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
    ];

    expect(getOrderedTargetProbes(probes, 1)).toStrictEqual([
      {
        targetId: 1, date: '2020-01-01T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: true,
      },
      {
        targetId: 1, date: '2020-01-02T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 1, date: '2020-01-03T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 1, date: '2020-01-04T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-05T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-06T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-07T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-08T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-09T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-10T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-11T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-12T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
    ]);
  });
});

describe('isContinuingProbeStreak', () => {
  it('should return false when probe or prevProbe response is false', () => {
    const falseProbe = { targetId: 1, type: PROBE_TYPE.DAILY, response: false };
    const trueProbe = { targetId: 1, type: PROBE_TYPE.DAILY, response: true };

    expect(isContinuingProbeStreak(falseProbe, trueProbe)).toBe(false);
    expect(isContinuingProbeStreak(trueProbe, falseProbe)).toBe(false);
    expect(isContinuingProbeStreak(falseProbe, falseProbe)).toBe(false);
  });

  it('should return false when probes are not of the same type', () => {
    const trueBaselineProbe = { targetId: 1, type: PROBE_TYPE.BASELINE, response: true };
    const trueDailyProbe = { targetId: 1, type: PROBE_TYPE.DAILY, response: true };

    expect(isContinuingProbeStreak(trueDailyProbe, trueBaselineProbe)).toBe(false);
  });

  it('should return true when probes\'s responses are true and of the same type', () => {
    const trueBaselineProbe = { targetId: 1, type: PROBE_TYPE.BASELINE, response: true };
    const trueDailyProbe = { targetId: 1, type: PROBE_TYPE.DAILY, response: true };

    expect(isContinuingProbeStreak(trueBaselineProbe, trueBaselineProbe)).toBe(true);
    expect(isContinuingProbeStreak(trueDailyProbe, trueDailyProbe)).toBe(true);
  });
});

describe('getTargetsCellStreaks', () => {
  it('should return targets\' cell streaks', () => {
    const targets = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const probes = [
      {
        targetId: 1, date: '2020-01-01T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: true,
      },
      {
        targetId: 1, date: '2020-01-02T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 1, date: '2020-01-03T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 1, date: '2020-01-04T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-05T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-06T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-07T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-08T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-09T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 1, date: '2020-01-10T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-11T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 1, date: '2020-01-12T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 2, date: '2020-01-01T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 2, date: '2020-01-02T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 2, date: '2020-01-03T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: true,
      },
      {
        targetId: 2, date: '2020-01-04T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 4, date: '2020-01-01T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 4, date: '2020-01-02T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 4, date: '2020-01-03T00:00:00.000Z', type: PROBE_TYPE.BASELINE, response: false,
      },
      {
        targetId: 4, date: '2020-01-04T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 4, date: '2020-01-06T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: false,
      },
      {
        targetId: 4, date: '2020-01-05T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 4, date: '2020-01-07T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
      {
        targetId: 4, date: '2020-01-08T00:00:00.000Z', type: PROBE_TYPE.DAILY, response: true,
      },
    ];

    expect(getTargetsCellStreaks(targets, probes)).toStrictEqual({
      1: [1, 0, 0, 0, 2, 2, 0, 1, 0, 3, 3, 3],
      2: [0, 0, 1, 1],
      3: [],
      4: [0, 0, 0, 0, 1, 0, 2, 2],
    });
  });
});

describe('getUserRole', () => {
  it('should get user role for owner', () => {
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

  it('should get user role for contributor', () => {
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

  it('should get user role for viewer', () => {
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

  it('should get user role for unallowed user', () => {
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
});

describe('guessNextProbeType', () => {
  it('should get next probe type for first probe', () => {
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

  it('should get next probe type after enough baseline probes', () => {
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

  it('should get next probe type after too few daily probes', () => {
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

  it('should get next probe type after enough daily probes', () => {
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
});
