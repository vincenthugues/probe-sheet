const DEFAULT_DAILY_PROBES_STREAK = 3;
const DEFAULT_BASELINE_PROBES = 3;

const PROBE_TYPE = {
  BASELINE: 'Baseline',
  DAILY: 'Daily',
  RETENTION: 'Retention',
};

// USER
// username
// email
// password
// role
// isValidated

const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
    role: 'admin',
    isValidated: true,
  },
  {
    username: 'Jane Doe',
    email: 'jane@example.com',
    password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
    isValidated: true,
  },
  {
    username: 'John Doe',
    email: 'john@example.com',
    password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
    isValidated: true,
  },
  {
    username: 'Jim',
    email: 'jim@example.com',
    password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
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
  {
    ownerId: 1,
    name: 'Cible 3',
    creationDate: new Date(),
    baselineProbesNumber: DEFAULT_BASELINE_PROBES,
    dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK,
    sheetId: 3,
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
  {
    ownerId: 1,
    therapist: 'Jane Doe',
    targetId: 3,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: false,
    comment: null,
  },
  {
    ownerId: 1,
    therapist: 'Jane Doe',
    targetId: 3,
    creationDate: new Date(),
    type: PROBE_TYPE.BASELINE,
    date: new Date(),
    response: false,
    comment: null,
  },
];

// COMMENT
// text
// // probeId (Probe)
// // ownerId (User)

const comments = [
  {
    text: 'Test comment',
    probeId: 1,
    ownerId: 1,
  },
  {
    text: 'Comment 2',
    probeId: 8,
    ownerId: 1,
  },
];

// ACCES_RIGHTS
// email
// role (enum)
// // sheetId (Sheet)

const accessRights = [
  {
    email: 'john@example.com',
    role: 'contributor',
    sheetId: 1,
  },
  {
    email: 'john@example.com',
    role: 'viewer',
    sheetId: 2,
  },
];

export default {
  users,
  sheets,
  targets,
  probes,
  comments,
  accessRights,
};
