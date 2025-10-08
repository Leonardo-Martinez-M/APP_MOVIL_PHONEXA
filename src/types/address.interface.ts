export enum AddressType {
    BILLING = "BILLING",
    SHIPPING = "SHIPPING",
    BOTH = "BOTH",
  }

export interface Address {
    addressType: AddressType;
    firstName: string;
    lastName: string;
    street: string;
    neighborhood?: string; 
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
    isBillingDefault: boolean;
    isShippingDefault: boolean;
  }