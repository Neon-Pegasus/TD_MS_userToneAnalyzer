const { Answers, SOAnalysis, GHAnalysis } = require('./index');

const parseIds = (ids) => {
  return new Promise((resolve, reject) => {
    const idValues = ids.map((id) => {
      return id.dataValues.id;
    });
    // SOAnalysis.findAll({ where: { AnswerId: idValues } })
    resolve(SOAnalysis.findAll({
      where: { AnswerId: idValues },
    }));
    reject(new Error('Could not parse ID'));
  });
};

const queryForUser = ({ id }) => {
  return Answers.findAll({
    where: { UserId: id },
    attributes: ['id'],
  })
    .then(parseIds)
    .catch((err) => {
      return err;
    });
};

const queryForGitHubUser = ({ id }) => {
  return GHAnalysis.findAll({
    where: { UserId: id },
  })
    .catch((err) => {
      return err;
    });
};

module.exports.queryForGitHubUser = queryForGitHubUser;
module.exports.queryForUser = queryForUser;
