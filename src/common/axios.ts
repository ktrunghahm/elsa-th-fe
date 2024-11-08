import axios from 'axios';
import { createApiClient } from '../zodClient/client';
import { baseURL } from './config';

export const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const zodiosClient = createApiClient(baseURL, { axiosInstance });
