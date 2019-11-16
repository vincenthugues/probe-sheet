export default (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(401).json({ msg: 'User is not admin' });
  }

  return next();
};
