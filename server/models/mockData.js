const DEFAULT_DAILY_PROBES_STREAK = 3;
const DEFAULT_BASELINE_PROBES = 3;

const PROBE_TYPE = {
  BASELINE: 'Baseline',
  DAILY: 'Daily',
  RETENTION: 'Retention',
};

const users = [
  {
    email: 'test@email.com',
    password: '123',
    username: 'Jane Doe',
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
    ownerId: 1,
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    student: 'J.D.',
    skillDomain: 'Language réceptif',
  },
  {
    ownerId: 1,
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    student: 'A.B.',
    skillDomain: 'Language réceptif',
  },
  {
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
    ownerId: 1,
    name: 'Cible 1',
    creationDate: new Date(),
    baselineProbesNumber: DEFAULT_BASELINE_PROBES,
    dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK,
    sheetId: 1,
  },
  {
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
// therapist
// comment
// // ownerId (User)
// // targetId (Target)

const probes = [
  {
    ownerId: 1,
    therapist: 'John Doe',
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: false,
    comment: null,
  },
  {
    ownerId: 1,
    therapist: 'John Doe',
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: true,
    comment: null,
  },
  {
    ownerId: 1,
    therapist: 'John Doe',
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: false,
    comment: null,
  },
  {
    ownerId: 1,
    therapist: 'John Doe',
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.DAILY,
    date: new Date(),
    response: false,
    comment: null,
  },
  {
    ownerId: 1,
    therapist: 'John Doe',
    targetId: 1,
    creationDate: new Date(),
    type: PROBE_TYPE.DAILY,
    date: new Date(),
    response: true,
    comment: null,
  },
  {
    ownerId: 1,
    therapist: 'John Doe',
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
