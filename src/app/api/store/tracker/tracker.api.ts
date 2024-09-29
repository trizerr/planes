import apiClient from '@/app/api/store/client';
import { METHODS } from '@/app/api/store/constants';

const { GET } = METHODS;

const trackerApi = {
  getFlights: () => {
    return apiClient.request({
      url: '/flights',
      method: GET,
      data: {
        status: 'en-route',
      },
    });
  },
};

export default trackerApi;
