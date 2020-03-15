import { update } from 'ramda';
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

export const getTargetsTableHeaders = (targets, probes) => targets.reduce((acc1, { id }) => {
  const targetProbes = probes
    .filter(({ targetId }) => targetId === id)
    .sort(
      ({ date: date1 }, { date: date2 }) => new Date(date1) - new Date(date2),
    );

  return {
    ...acc1,
    [id]: targetProbes.reduce((acc2, { type }) => {
      const lastItemIndex = acc2.length - 1;
      const lastItem = lastItemIndex >= 0 ? acc2[lastItemIndex] : null;
      if (lastItem && lastItem.type === type) {
        return update(
          lastItemIndex,
          {
            ...acc2[lastItemIndex],
            span: lastItem.span + 1,
          },
          acc2,
        );
      }
      return [...acc2, { type, span: 1 }];
    }, []),
  };
}, {});

export const sortByDate = arr => arr.sort(
  ({ date: date1 }, { date: date2 }) => new Date(date1) - new Date(date2),
);

export const getOrderedTargetProbes = (probes, targetId) => sortByDate(
  probes.filter(probe => probe.targetId === targetId),
);

export const isContinuingProbeStreak = (probe, prevProbe) => prevProbe
  && prevProbe.type === probe.type
  && prevProbe.response === true
  && probe.response === true;

export const getProbeStreak = (probes, probeType) => {
  const probeContinuesStreak = (probe, type) => probe && probe.response && probe.type === type;

  let counter = 0;
  while (probeContinuesStreak(probes[counter], probeType)) {
    counter += 1;
  }

  return counter;
};

export const getTargetsCellStreaks = (targets, probes) => {
  const probeStreaksByTarget = {};

  targets.forEach(({ id: targetId }) => {
    const targetProbes = getOrderedTargetProbes(probes, targetId);

    probeStreaksByTarget[targetId] = targetProbes.reduce((probeStreaks, probe, i) => {
      if (!probe.response) return [...probeStreaks, 0];

      if ([PROBE_TYPE.BASELINE, PROBE_TYPE.DAILY].includes(probe.type)) {
        const prevProbe = targetProbes[i - 1];

        return [
          ...probeStreaks,
          isContinuingProbeStreak(probe, prevProbe)
            ? probeStreaks[i - 1]
            : getProbeStreak(targetProbes.slice(i), probe.type),
        ];
      }

      return [...probeStreaks, 1];
    }, []);
  });

  return probeStreaksByTarget;
};

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

export const getUserRole = (sheet, user, sheetAccessRights) => {
  if (sheet && sheet.ownerId === user.id) return 'owner';
  const userAccessRight = sheetAccessRights.find(({ email }) => email === user.email);
  return userAccessRight ? userAccessRight.role : null;
};
