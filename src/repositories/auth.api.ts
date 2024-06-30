import axiosInstance from "@/axios/axios-instance";
import { AccountResType } from "@/schemaValidations/account.schema";
import {
  LoginBodyType,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";

interface AuthApiInterface {
  register(data: RegisterBodyType): Promise<AccountResType>;
  login(data: LoginBodyType): Promise<AccountResType>;
}

export class AuthApi implements AuthApiInterface {
  async register(data: RegisterBodyType): Promise<AccountResType> {
    try {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginBodyType): Promise<AccountResType> {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
