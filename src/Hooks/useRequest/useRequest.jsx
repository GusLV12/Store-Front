// useRequest.jsx
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

// El hook ahora acepta opcionalmente una función que retorne el requestConfig
export const useRequest = (requestFactory) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const tokenApi = localStorage.getItem('token');

  // Ahora makeRequest puede recibir los argumentos que necesita el factory
  const makeRequest = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      // Si requestFactory es función, la ejecutas, si es objeto, lo usas directo
      const requestConfig =
        typeof requestFactory === 'function'
          ? requestFactory(...args)
          : requestFactory;

      const res = await axios({
        ...config,
        ...requestConfig,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${tokenApi}`,
        },
        // Si mandas data/params por props en tu objeto, sigue funcionando
        ...requestConfig,
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
