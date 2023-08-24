import api from '@/api/instance';
import ky from 'ky';

export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const loginShelter = async (data: LoginPayload) => {
  const response = await ky
    .post(`auth/shelter/login`, {
      prefixUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,
      json: data
    })
    .then(res => res.json<LoginResponse>());

  return response;
};

export const isExist = async (value: string, type: string) => {
  const response = await api
    .get(`auth/shelter/exist?value=${value}&type=${type}`)
    .then(res => res.json<Promise<Record<'isExist', boolean>>>());

  return response;
};
