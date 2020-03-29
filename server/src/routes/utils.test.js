import {
  getVisibleSheetIds,
  getEditableSheetIds,
  getVisibleTargetIds,
  getEditableTargetIds,
  getVisibleProbeIds,
  getEditableProbeIds,
} from './utils';

const accessRights = [
  { sheetId: 1, email: 'user1@example.com', role: 'contributor' },
  { sheetId: 2, email: 'user1@example.com', role: 'viewer' },
  { sheetId: 3, email: 'user2@example.com', role: 'contributor' },
];
const sheets = [{ id: 1 }, { id: 2 }, { id: 3 }];
const targets = [{ id: 1 }, { id: 2 }, { id: 3 }];
const probes = [{ id: 1 }, { id: 2 }, { id: 3 }];
const contextMock = {
  models: {
    AccessRight: {
      findAll: ({ where: { email, role } }) => new Promise(resolve => resolve(
        accessRights
          .filter(accessRight => accessRight.email === email)
          .filter(accessRight => !role || accessRight.role === role),
      )),
    },
    Sheet: { findAll: () => new Promise(resolve => resolve(sheets)) },
    Target: { findAll: () => new Promise(resolve => resolve(targets)) },
    Probe: { findAll: () => new Promise(resolve => resolve(probes)) },
  },
};
const userMock = {
  email: 'user1@example.com',
};

describe('getVisibleSheetIds', () => {
  it('should return the ids of sheets the user is allowed to view', async () => {
    const context = contextMock;
    const user = userMock;

    await expect(getVisibleSheetIds({ context, user })).resolves.toStrictEqual([1, 2]);
  });
});

describe('getEditableSheetIds', () => {
  it('should return the ids of sheets the user is allowed to edit', async () => {
    const context = contextMock;
    const user = userMock;

    await expect(getEditableSheetIds({ context, user })).resolves.toStrictEqual([1]);
  });
});

describe('getVisibleTargetIds', () => {
  it('should return the ids of targets the user is allowed to view', async () => {
    const context = contextMock;
    const user = userMock;

    await expect(getVisibleTargetIds({ context, user })).resolves.toStrictEqual([1, 2, 3]);
  });
});

describe('getEditableTargetIds', () => {
  it('should return the ids of targets the user is allowed to edit', async () => {
    const context = contextMock;
    const user = userMock;

    await expect(getEditableTargetIds({ context, user })).resolves.toStrictEqual([1, 2, 3]);
  });
});

describe('getVisibleProbeIds', () => {
  it('should return the ids of probes the user is allowed to view', async () => {
    const context = contextMock;
    const user = userMock;

    await expect(getVisibleProbeIds({ context, user })).resolves.toStrictEqual([1, 2, 3]);
  });
});

describe('getEditableProbeIds', () => {
  it('should return the ids of probes the user is allowed to edit', async () => {
    const context = contextMock;
    const user = userMock;

    await expect(getEditableProbeIds({ context, user })).resolves.toStrictEqual([1, 2, 3]);
  });
});
