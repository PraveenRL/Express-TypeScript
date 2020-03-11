import { Request } from "express";

import { IUser } from "../controllers/users/user.dto";

interface RequestWithUser extends Request{
    user: IUser;
}

export default RequestWithUser;