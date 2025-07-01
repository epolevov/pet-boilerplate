export enum UserRole {
  Owner = 'owner',
  Supervisor = 'supervisor',
  User = 'user',
  System = 'system',
}

export type Account = {
  _id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  patronymicName: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  accessToken: string;
};

export type UpdateAccountDTO = {
  _id?: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  patronymicName?: string | null;
  avatarFile?: string;
  oldPassword?: string;
  newPassword1?: string;
  newPassword2?: string;
};

export type UpdateAccountRequestDTO = {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  patronymicName?: string | null;
  oldPassword?: string;
  newPassword?: string;
};
