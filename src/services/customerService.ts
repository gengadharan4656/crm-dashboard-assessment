import { api } from './api';
import type { Customer, CustomerListResponse } from '../types';

const STATUSES: Customer['status'][] = ['active', 'inactive', 'lead'];
const COMPANIES = ['Acme Inc', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Hooli', 'Pied Piper', 'Stark Industries'];
const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'Japan'];

function decorate(c: any): Customer {
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    age: c.age,
    gender: c.gender,
    username: c.username,
    image: c.image,
    status: STATUSES[c.id % STATUSES.length],
    company: COMPANIES[c.id % COMPANIES.length],
    country: COUNTRIES[c.id % COUNTRIES.length],
  };
}

export async function fetchCustomers(params: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<CustomerListResponse> {
  const { page, limit, search, sortBy, sortOrder } = params;
  const skip = (page - 1) * limit;

  let url = `/users?limit=${limit}&skip=${skip}&select=firstName,lastName,email,phone,age,gender,username,image`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${sortOrder || 'asc'}`;
  }

  let data: CustomerListResponse;
  if (search && search.trim()) {
    const res = await api.get<any>(`/users/search?q=${encodeURIComponent(search.trim())}&limit=${limit}&skip=${skip}&select=firstName,lastName,email,phone,age,gender,username,image`);
    data = { users: res.data.users.map(decorate), total: res.data.total, skip: res.data.skip, limit: res.data.limit };
  } else {
    const res = await api.get<any>(url);
    data = { users: res.data.users.map(decorate), total: res.data.total, skip: res.data.skip, limit: res.data.limit };
  }
  return data;
}

export async function fetchCustomerById(id: number): Promise<Customer> {
  const res = await api.get<any>(`/users/${id}`);
  return decorate(res.data);
}
