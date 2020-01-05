const DEFAULT_DAILY_PROBES_STREAK = 3;
const DEFAULT_BASELINE_PROBES = 3;

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('targets', [
    {
      name: 'Cible 1',
      baselineProbesNumber: DEFAULT_BASELINE_PROBES,
      dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK,
      ownerId: 2,
      sheetId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Cible 2',
      baselineProbesNumber: DEFAULT_BASELINE_PROBES,
      dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK,
      ownerId: 2,
      sheetId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Cible 3',
      baselineProbesNumber: DEFAULT_BASELINE_PROBES,
      dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK,
      ownerId: 2,
      sheetId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('targets', null, {}),
};
