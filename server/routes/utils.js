import { Op } from 'sequelize';

export const getVisibleSheetIds = async (req) => {
  const accessRights = await req.context.models.AccessRight.findAll({
    where: {
      email: req.user.email,
    },
  });
  const visibleSheetIds = accessRights.map(({ dataValues: { sheetId } }) => sheetId);

  return visibleSheetIds;
};

export const getEditableSheetIds = async (req) => {
  const accessRights = await req.context.models.AccessRight.findAll({
    where: {
      email: req.user.email,
      role: 'contributor',
    },
  });
  const editableSheetIds = accessRights.map(({ dataValues: { sheetId } }) => sheetId);

  return editableSheetIds;
};

export const getVisibleTargetIds = async (req) => {
  const visibleSheetIds = await getVisibleSheetIds(req);
  const visibleTargets = await req.context.models.Target.findAll({
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { sheetId: { [Op.in]: visibleSheetIds } },
      ],
    },
  });
  const visibleTargetIds = visibleTargets.map(({ dataValues: { id } }) => id);

  return visibleTargetIds;
};

export const getEditableTargetIds = async (req) => {
  const editableSheetIds = await getEditableSheetIds(req);
  const editableTargets = await req.context.models.Target.findAll({
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { sheetId: { [Op.in]: editableSheetIds } },
      ],
    },
  });
  const editableTargetIds = editableTargets.map(({ dataValues: { id } }) => id);

  return editableTargetIds;
};

export const getVisibleProbeIds = async (req) => {
  const visibleTargetIds = await getVisibleTargetIds(req);
  const visibleProbes = await req.context.models.Probe.findAll({
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { targetId: { [Op.in]: visibleTargetIds } },
      ],
    },
  });
  const visibleProbeIds = visibleProbes.map(({ dataValues: { id } }) => id);

  return visibleProbeIds;
};

export const getEditableProbeIds = async (req) => {
  const editableTargetIds = await getEditableTargetIds(req);
  const editableProbes = await req.context.models.Probe.findAll({
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { targetId: { [Op.in]: editableTargetIds } },
      ],
    },
  });
  const editableProbeIds = editableProbes.map(({ dataValues: { id } }) => id);

  return editableProbeIds;
};
