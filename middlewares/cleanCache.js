const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  await next(); //do not clear cash if an error occurs on the root handler
  clearHash(req.user.id);
};
