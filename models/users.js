
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    mobile: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
  }, {});
  users.associate = function (models) {};
  return users;
};
