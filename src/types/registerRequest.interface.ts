import { Address } from "./address.interface";

export interface RegisterRequest {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: Address;
  }
  