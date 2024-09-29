import { AxiosRequestHeaders } from 'axios';
import { METHODS } from '@/app/api/store/constants';

export type ApiClientRequest = {
  method: METHODS.GET | METHODS.POST | METHODS.PUT | METHODS.DELETE;
  url: string;
  data?: Record<string, unknown>;
  headers?: AxiosRequestHeaders;
  params?: Record<string, unknown>;
};
