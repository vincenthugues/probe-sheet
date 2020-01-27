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

// TODO: refactor getTargetsCellStreaks logic
export const getTargetsCellStreaks = (targets, probes) => {
  let counters = [];

  return targets.reduce((acc, { id }) => {
    const targetProbes = probes
      .filter(({ targetId }) => targetId === id)
      .sort(
        ({ date: date1 }, { date: date2 }) => new Date(date1) - new Date(date2),
      );

    return {
      ...acc,
      [id]: targetProbes.map(({ type, response }, i) => {
        let counter = response ? 1 : 0;
        if (response && [PROBE_TYPE.BASELINE, PROBE_TYPE.DAILY].includes(type)) {
          if (
            i > 0
              && targetProbes[i - 1].type === type
              && targetProbes[i - 1].response === true
          ) {
            counter = counters[i - 1];
          } else {
            while (
              targetProbes[i + counter]
                && targetProbes[i + counter].type === type
                && targetProbes[i + counter].response === true
            ) {
              counter += 1;
            }
          }
        }

        counters = [...counters, counter];

        return counter;
      }),
    };
  }, {});
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
