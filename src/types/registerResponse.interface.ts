export interface RegisterResponse {
  success: boolean;
  data: RegisterResponseData;
}

export interface RegisterResponseData {
  message: string;
  database: DatabaseResponse;
  stripe: StripeResponse;
}

export interface DatabaseResponse {
  message: string;
  userId: number;
  addressId: number;
}

export interface StripeResponse {
  message: string;
  stripeCustomerId: string;
}
