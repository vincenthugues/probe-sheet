import Sequelize from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

const models = {
  User: sequelize.import('./user'),
  Sheet: sequelize.import('./sheet'),
  Target: sequelize.import('./target'),
  Probe: sequelize.import('./probe'),
  Comment: sequelize.import('./comment'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export default models;
