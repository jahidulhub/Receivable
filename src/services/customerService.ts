import { db } from '../database/db';
import { Customer, CreateCustomerInput } from '../models/customer';
import { v4 as uuidv4 } from 'uuid';

export const createCustomer = async (input: CreateCustomerInput): Promise<Customer> => {
  const customer: Customer = {
    id: uuidv4(),
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.customers.add(customer);
  return customer;
};

export const getCustomers = async (): Promise<Customer[]> => {
  return db.customers.toArray();
};

export const getCustomerById = async (id: string): Promise<Customer | undefined> => {
  return db.customers.get(id);
};

export const updateCustomer = async (id: string, updates: Partial<CreateCustomerInput>): Promise<void> => {
  await db.customers.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await db.customers.delete(id);
};

export const searchCustomers = async (query: string): Promise<Customer[]> => {
  const customers = await db.customers.toArray();
  const lowerQuery = query.toLowerCase();
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(query)
  );
};
