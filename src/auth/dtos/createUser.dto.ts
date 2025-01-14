import { UserCredential } from 'src/typeorm/entities/user_credentials.entity';
import { UserRole } from 'src/typeorm/entities/user_roles.entity';

export class createUserDto {
  id: string;
  name: string;
  email: string;
  password: string;
  role_details: UserRole;
  password_details: UserCredential;
}
