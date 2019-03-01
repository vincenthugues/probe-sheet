const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PROBE_TYPE = {
  BASELINE: 'Baseline',
  DAILY: 'Daily',
  RETENTION: 'Retention',
};

let DB = {
  users: [
    {
      id: 1,
      name: 'Nia',
      email: 'example@email.com',
    },
    {
      id: 2,
      name: 'Anne',
      email: 'example@email.com',
    },
  ],
  sheets: [
    {
      id: 1,
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      userId: 1,
      student: 'J.D.',
      skillDomain: 'Language réceptif',
    },
    {
      id: 2,
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      userId: 1,
      student: 'A.B.',
      skillDomain: 'Language réceptif',
    },
    {
      id: 3,
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      userId: 1,
      student: 'J.D.',
      skillDomain: 'Motricité fine',
    },
  ],
  targetsData: [
    {
      id: 1,
      sheetId: 1,
      target: 'Donne "balle" (image parmi 8)',
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      isArchived: false,
      baselineProbesNumber: 3,
      dailyProbesStreak: 3,
      probes: [
        { type: PROBE_TYPE.BASELINE, date: '01/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.BASELINE, date: '02/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.BASELINE, date: '03/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '04/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '05/01', therapist: 'Nia', response: true, commentId: 1 },
        { type: PROBE_TYPE.DAILY, date: '06/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '07/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '08/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '09/01', therapist: 'Nia', response: true, commentId: 2 },
        { type: PROBE_TYPE.RETENTION, date: '10/01', therapist: 'Nia', response: true },
      ],
      comments: [
        { id: 1, text: "Premier commentaire" },
        { id: 2, text: "Notes additionnelles" },
      ],
    },
    {
      id: 2,
      sheetId: 1,
      target: 'Donne "balle" (objets parmi 8)',
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      isArchived: false,
      baselineProbesNumber: 3,
      dailyProbesStreak: 3,
      probes: [
        { type: PROBE_TYPE.BASELINE, date: '01/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.BASELINE, date: '02/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.BASELINE, date: '03/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '04/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '05/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '06/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.RETENTION, date: '07/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '08/01', therapist: 'Nia', response: true },
      ],
      comments: [],
    },
    {
      id: 3,
      sheetId: 2,
      target: 'Donne "balle" (objets parmi 8)',
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      isArchived: false,
      baselineProbesNumber: 3,
      dailyProbesStreak: 3,
      probes: [
        { type: PROBE_TYPE.BASELINE, date: '01/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.BASELINE, date: '02/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.BASELINE, date: '03/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '04/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '05/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '06/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.RETENTION, date: '07/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '08/01', therapist: 'Nia', response: true },
      ],
      comments: [],
    },
    {
      id: 4,
      sheetId: 1,
      target: 'Donne "balle" (objets parmi 8) v2',
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      isArchived: false,
      baselineProbesNumber: 3,
      dailyProbesStreak: 3,
      probes: [
        { type: PROBE_TYPE.BASELINE, date: '01/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.BASELINE, date: '02/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.BASELINE, date: '03/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '04/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '05/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '06/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.RETENTION, date: '07/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '08/01', therapist: 'Nia', response: true },
      ],
      comments: [],
    },
    {
      id: 5,
      sheetId: 1,
      target: 'Donne "balle" (objets parmi 8) v0',
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      isArchived: true,
      baselineProbesNumber: 3,
      dailyProbesStreak: 3,
      probes: [
        { type: PROBE_TYPE.BASELINE, date: '01/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.BASELINE, date: '02/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.BASELINE, date: '03/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '04/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '05/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.DAILY, date: '06/01', therapist: 'Nia', response: true },
        { type: PROBE_TYPE.RETENTION, date: '07/01', therapist: 'Nia', response: false },
        { type: PROBE_TYPE.DAILY, date: '08/01', therapist: 'Nia', response: true },
      ],
      comments: [],
    },
  ],
};

app.get('/api/users', (req, res) => {
  res.send(DB.users);
});

app.get('/api/sheets/:userId', (req, res) => {
  const reqUserId = parseInt(req.params.userId);
  res.send(DB.sheets.filter(({ userId }) => userId === reqUserId));
});

app.post('/api/sheets/:userId', (req, res) => {
  const reqUserId = parseInt(req.params.userId);
  const { sheet } = req.body;

  let maxId = 0;
  for ({ id } of DB.sheets) {
    if (id > maxId) maxId = id;
  }

  const newSheet = {
    ...sheet,
    id: maxId + 1,
    name: 'New sheet',
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    userId: reqUserId,
  };
  DB.sheets.push(newSheet);

  res.send(newSheet);
});

app.get('/api/targets-data/:sheetId', (req, res) => {
  const reqSheetId = parseInt(req.params.sheetId);
  res.send(DB.targetsData.filter(({ sheetId }) => sheetId === reqSheetId));
});

app.post('/api/target-data:targetId', (req, res) => {
  const { id, ...targetData } = req.body.targetData;
  const targetDataIndex = DB.targetsData.findIndex(item => item.id === id);
  // data.targetsData[targetDataIndex] = targetData;

  res.send(`POST request: id ${id}, targetDataIndex ${targetDataIndex}`);
});

app.post('/api/targets-data/:userId', (req, res) => {
  const { sheetId, targetData } = req.body;

  let maxId = 0;
  for ({ id } of DB.targetsData) {
    if (id > maxId) maxId = id;
  }

  const newTargetData = {
    ...targetData,
    id: maxId + 1,
    sheetId,
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    isArchived: false,
    probes: [],
    comments: [],
  };
  DB.targetsData.push(newTargetData);

  res.send(newTargetData);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
