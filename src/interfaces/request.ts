import { Request } from "express";
import { User } from "./db";

export interface RequestWithUser extends Request {
  user: User;
}
