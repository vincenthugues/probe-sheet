const DEFAULT_DAILY_PROBES_STREAK = 3;
const DEFAULT_BASELINE_PROBES = 3;

const PROBE_TYPE = {
  BASELINE: 'Baseline',
  DAILY: 'Daily',
  RETENTION: 'Retention',
};

const users = [
  {
    id: 1,
    email: 'test@email.com',
    password: '123',
    name: 'Therapist1',
  },
];

// SHEET
// creationDate
// lastUpdateDate
// student
// skillDomain
// // ownerId (User)

const sheets = [
  {
    id: 1,
    ownerId: 1,
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    student: 'J.D.',
    skillDomain: 'Language réceptif',
  },
  {
    id: 2,
    ownerId: 1,
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    student: 'A.B.',
    skillDomain: 'Language réceptif',
  },
  {
    id: 3,
    ownerId: 1,
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    student: 'J.D.',
    skillDomain: 'Motricité fine',
  },
];

// TARGET
// name
// creationDate
// baselineProbesNumber
// dailyProbesStreak
// // ownerId (User)
// // sheetId (Sheet)

const targets = [
  {
    id: 1,
    ownerId: 1,
    name: 'Cible 1',
    creationDate: new Date(),
    baselineProbesNumber: DEFAULT_BASELINE_PROBES,
    dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK,
    sheetId: 1,
  },
  {
    id: 2,
    ownerId: 1,
    name: 'Cible 2',
    creationDate: new Date(),
    baselineProbesNumber: DEFAULT_BASELINE_PROBES,
    dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK,
    sheetId: 1,
  },
];

// PROBE
// creationDate
// type
// date
// response
// comment
// // ownerId (User)
// // therapistId (User)
// // targetId (Target)

const probes = [
  {
    id: 1,
    ownerId: 1,
    therapistId: 1,
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: false,
    comment: null,
  },
  {
    id: 2,
    ownerId: 1,
    therapistId: 1,
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: true,
    comment: null,
  },
  {
    id: 3,
    ownerId: 1,
    therapistId: 1,
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: false,
    comment: null,
  },
  {
    id: 4,
    ownerId: 1,
    therapistId: 1,
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.DAILY,
    date: new Date(),
    response: false,
    comment: null,
  },
  {
    id: 5,
    ownerId: 1,
    therapistId: 1,
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.DAILY,
    date: new Date(),
    response: true,
    comment: null,
  },
  {
    id: 6,
    ownerId: 1,
    therapistId: 1,
    targetId: 2,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: false,
    comment: null,
  },
];

// COMMENT
// text
// creationDate
// // probeId (Probe)
// // authorId (User)

const comments = [
  {
    id: 1,
    text: 'Test comment',
    creationDate: new Date(),
    probeId: 1,
    authorId: 1,
  },
];

export default {
  users,
  sheets,
  targets,
  probes,
  comments,
};
