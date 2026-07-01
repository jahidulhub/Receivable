export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  address?: string;
}
