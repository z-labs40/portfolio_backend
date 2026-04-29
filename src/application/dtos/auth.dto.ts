export interface RegisterUserDto {
  email: string;
  password?: string;
}

export interface LoginUserDto {
  email: string;
  password?: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
  };
  token: string;
}
