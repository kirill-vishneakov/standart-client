export interface User {
  id: number;
  full_name: string;
  role: 'admin' | 'employee' | 'client';
  email :string;
  phone : string
}

export interface LoginResponse {
  token: string;
  user: User;
}
