// Definicion del modelo Session:

module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'Session',
        {
            sid: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            expires: {
                type: DataTypes.DATE
            },
            data: {
                type: DataTypes.STRING(50000)
            }
        });
};
