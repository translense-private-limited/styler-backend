import { LoginDto } from "../dtos/login.dto";
import { UserTypeInterface } from "./user-type.interface";

export interface AuthServiceInterface {
  login(loginDto: LoginDto): Promise<UserTypeInterface>;
  // Uncomment the methods below if you plan to include them in the interface
  // validateUser(email: string, password: string): Promise<any>;
  // generateToken(user: any): string;
}
