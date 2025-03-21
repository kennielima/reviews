

import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sequelize";
import Product from "./Product";
import User from "./User";
import UserRating from "./UserRating";

declare module 'sequelize' {
    interface Model {
        id: string;
        title: string;
        brand: string;
        content: string;
        rating: number;
        productId: string;
        userId: string,
        anonymous: boolean,
    }
}

class Review extends Model {
    declare id: string
}

Review.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.DECIMAL(2),
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    anonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
},
    {
        sequelize,
        modelName: 'Review',
        tableName: 'Reviews',
        timestamps: true,
    }
);
User.hasMany(Review, {
    foreignKey: 'userId',
    as: 'reviews',
    sourceKey: 'id'
});

Review.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    targetKey: 'id'
});

User.hasMany(UserRating, {
    foreignKey: 'userId',
    as: 'userratings',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

UserRating.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user'
});

Product.hasMany(Review, {
    foreignKey: 'productId',
    as: 'reviews',
    sourceKey: 'id'
});

Review.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
    targetKey: 'id'
});

Product.hasMany(UserRating, {
    foreignKey: 'productId',
    as: 'rating',
    sourceKey: 'id'
});

UserRating.belongsTo(Product, {
    foreignKey: 'productId',
    targetKey: 'id',
    as: 'product'
});

export default Review;