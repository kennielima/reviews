import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';
import Review from './Review';

declare module 'sequelize' {
  interface Model {
    id: string;
    fullName: string;
    email: string;
    username: string;
    password: string;
  }
}
class User extends Model {
  declare id: string
}

User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  }
)
export default User;