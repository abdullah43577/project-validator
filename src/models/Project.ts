import { sequelize } from "../utils/connectDB";
import { DataTypes, Model, Optional } from "sequelize";

// Define the attributes of your Project model
interface ProjectAttributes {
  id: number; // Assuming you have an auto-incrementing primary key
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

// Define which attributes are optional during creation
// The ID field is typically optional during creation as it's auto-generated
interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the Project model with proper TypeScript typing
class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public author_name!: string;
  public project_title!: string;
  public date_of_submission!: Date;
  public abstract!: string;
  public aims!: string;
  public objectives!: string[];
  public supervisor!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
