import { LoginDto } from "../dtos/login.dto";
import { UserTypeInterface } from "./user-type.interface";

export interface AuthServiceInterface {

    login(loginDto: LoginDto): Promise<UserTypeInterface>{}
    // validateUser(email: string, password: string): Promise<any>;
    // generateToken(user: any): string;
  }
  