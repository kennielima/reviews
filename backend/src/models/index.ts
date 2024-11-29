import { Sequelize } from 'sequelize';
import User from './User';
import Review from './Review';

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.PORT),
    logging: console.log
});

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
{}
(async () => {
    try {
        console.log('Starting database sync...');
        await sequelize.sync({ force: true });
        console.log('Database synced successfully!');
    } catch (error) {
        console.error('Failed to sync database:', error);
    }
})();

export default { User, Review, sequelize };
