import axios from 'axios';
import { ApiClientRequest } from '@/app/api/store/types';

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AVIATION_BASE_URL,
  headers: {
    // 'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  },
  params: {
    key: process.env.NEXT_PUBLIC_AVIATION_API_KEY,
  },
});

const request = async ({
  url,
  method,
  headers,
  data = {},
  params = {},
}: ApiClientRequest) => {
  try {
    const response = await axiosClient.request({
      url,
      method,
      data,
      headers,
      params,
    });

    return response && response.data
      ? { response: response.data, error: null }
      : { response: null, error: null };
  } catch (error: any) {
    if (error.response) {
      return {
        response: null,
        error: {
          data: error.response.data,
          status: error.response.status,
        },
      };
    }
    return {
      response: null,
      error: {
        data: error,
        status: 418,
      },
    };
  }
};

const apiClient = {
  request,
};

export default apiClient;
