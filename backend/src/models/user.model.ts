export interface UserModel {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
