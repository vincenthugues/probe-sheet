export const DEFAULT_BASELINE_PROBES = 3;
export const DEFAULT_DAILY_PROBES_STREAK = 3;

export const PROBE_TYPE = {
  BASELINE: 'Baseline',
  DAILY: 'Daily',
  RETENTION: 'Retention',
};

export const PROBE_TABLE_HEADER_BY_TYPE = {
  [PROBE_TYPE.BASELINE]: 'Ligne de base',
  [PROBE_TYPE.DAILY]: 'Probes',
  [PROBE_TYPE.RETENTION]: 'Probe de rétention',
};

export const TARGETS_AUTO_ARCHIVING = false;
