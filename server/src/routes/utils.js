import { Op } from 'sequelize';

export const getVisibleSheetIds = async (req) => {
  const { models: { AccessRight } } = req.context;

  const accessRights = await AccessRight.findAll({
    attributes: ['sheetId'],
    where: {
      email: req.user.email,
    },
    raw: true,
  });
  const visibleSheetIds = accessRights.map(({ sheetId }) => sheetId);

  return visibleSheetIds;
};

export const getEditableSheetIds = async (req) => {
  const { models: { AccessRight } } = req.context;

  const accessRights = await AccessRight.findAll({
    attributes: ['sheetId'],
    where: {
      email: req.user.email,
      role: 'contributor',
    },
    raw: true,
  });
  const editableSheetIds = accessRights.map(({ sheetId }) => sheetId);

  return editableSheetIds;
};

export const getVisibleTargetIds = async (req) => {
  const userId = req.user.id;
  const { models: { Sheet, Target } } = req.context;

  const visibleSheetIds = await getVisibleSheetIds(req);
  const visibleTargets = await Target.findAll({
    attributes: ['id'],
    where: {
      [Op.or]: [
        { ownerId: userId },
        { sheetId: { [Op.in]: visibleSheetIds } },
        { '$sheet.ownerId$': userId },
      ],
    },
    include: {
      model: Sheet,
      attributes: ['ownerId'],
    },
    raw: true,
  });
  const visibleTargetIds = visibleTargets.map(({ id }) => id);

  return visibleTargetIds;
};

export const getEditableTargetIds = async (req) => {
  const { models: { Target } } = req.context;

  const editableSheetIds = await getEditableSheetIds(req);
  const editableTargets = await Target.findAll({
    attributes: ['id'],
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { sheetId: { [Op.in]: editableSheetIds } },
      ],
    },
    raw: true,
  });
  const editableTargetIds = editableTargets.map(({ id }) => id);

  return editableTargetIds;
};

export const getVisibleProbeIds = async (req) => {
  const { models: { Probe } } = req.context;

  const visibleTargetIds = await getVisibleTargetIds(req);
  const visibleProbes = await Probe.findAll({
    attributes: ['id'],
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { targetId: { [Op.in]: visibleTargetIds } },
      ],
    },
    raw: true,
  });
  const visibleProbeIds = visibleProbes.map(({ id }) => id);

  return visibleProbeIds;
};

export const getEditableProbeIds = async (req) => {
  const { models: { Probe } } = req.context;

  const editableTargetIds = await getEditableTargetIds(req);
  const editableProbes = await Probe.findAll({
    attributes: ['id'],
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { targetId: { [Op.in]: editableTargetIds } },
      ],
    },
    raw: true,
  });
  const editableProbeIds = editableProbes.map(({ id }) => id);

  return editableProbeIds;
};
