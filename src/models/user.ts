export enum Role {
    Admin = 'Admin',
    User = 'User'
  }
  
  export interface User {
    id: string;
  
    username: string;
  
    password: string;
  
    role: Role;
  
    isActive: boolean;
  
    email: string;
  
    phone: string;
  }