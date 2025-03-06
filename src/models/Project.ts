import { sequelize } from "../utils/connectDB";
import { DataTypes, Model, Optional } from "sequelize";

interface ProjectAttributes {
  id: number;
  author_name: string;
  project_title: string;
  date_of_submission: Date;
  abstract: string;
  aims: string;
  objectives: string[];
  supervisor: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id" | "createdAt" | "updatedAt"> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> {}

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
