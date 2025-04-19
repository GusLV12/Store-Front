import { useState } from 'react';
import axios from 'axios';

const config = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
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

  const makeRequest = async (data = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios({
        ...config,
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
