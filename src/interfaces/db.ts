import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: "active" | "inactive" | "pending";
}

export interface Question {
  _id?: ObjectId;
  userId: ObjectId;
  content: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}
