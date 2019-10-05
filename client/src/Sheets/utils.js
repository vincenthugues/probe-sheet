import { PROBE_TYPE } from '../constants';

export const getProbeTdBackgroundColor = (response, type, count, dailyProbesStreak) => {
  if (!response) return 'none';

  if (type === PROBE_TYPE.DAILY && count >= dailyProbesStreak) {
    return '#FFEE55';
  }
  if (type === PROBE_TYPE.RETENTION) {
    return '#FF9DF3';
  }

  return 'none';
};

export const getFilteredSheetIds = (sheets, filters = {}) => sheets
  .filter(({ student }) => !filters.student || student === filters.student)
  .filter(({ skillDomain }) => !filters.skillDomain || skillDomain === filters.skillDomain)
  .map(({ id }) => id);

export const guessNextProbeType = (
  baselineProbesNumber, dailyProbesStreak, targetCellStreaks, probes,
) => {
  if (probes.length === 0 || probes.length < baselineProbesNumber) {
    return PROBE_TYPE.BASELINE;
  }

  const prevProbe = probes[probes.length - 1];
  const prevStreak = targetCellStreaks[probes.length - 1];
  if (prevProbe.type === PROBE_TYPE.BASELINE && prevStreak >= baselineProbesNumber) {
    return PROBE_TYPE.DAILY;
  }
  if (prevProbe.type === PROBE_TYPE.DAILY && prevStreak >= dailyProbesStreak) {
    return PROBE_TYPE.RETENTION;
  }
  if (prevProbe.type === PROBE_TYPE.RETENTION && prevProbe.response === false) {
    return PROBE_TYPE.DAILY;
  }

  return PROBE_TYPE.DAILY;
};
