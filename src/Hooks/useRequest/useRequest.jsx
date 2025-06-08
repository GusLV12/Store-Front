import { useState } from 'react';
import axios from 'axios';

import { Url } from '@/Utils/globals.variables';
import { useAuth } from '@/Context';

const config = {
  baseURL: Url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const useRequest = (requestFunction = {}) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const tokenApi = localStorage.getItem('token');

  const makeRequest = async (data = null) => {
    setLoading(true);
    setError(null);
    console.log('Token en useRequest:', tokenApi);
    try {
      const res = await axios({
        ...config,
        headers:{
          ...config.headers,
          Authorization: `Bearer ${tokenApi}`,
        },
        ...requestFunction,
        data,
      });

      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, makeRequest };
};
