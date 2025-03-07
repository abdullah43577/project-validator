import { sequelize } from "../utils/connectDB";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare id: CreationOptional<number>;
  declare author_name: string;
  declare project_title: string;
  declare date_of_submission: Date;
  declare abstract: string;
  declare aims: string;
  declare objectives: string[];
  declare supervisor: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    author_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_submission: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    abstract: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aims: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    objectives: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    supervisor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Project",
    timestamps: true,
  }
);

export default Project;
