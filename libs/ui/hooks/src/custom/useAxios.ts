import { useState, useEffect } from 'react';
import axios from 'axios';
import { HEADER_TENANT_NAME } from '@okampus/shared/consts';
import { currentTenant } from '@okampus/ui/utils';
import type { AxiosRequestConfig } from 'axios';

export function useAxios(request: AxiosRequestConfig) {
  const [data, setData] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (params: typeof request) => {
    try {
      const headers = params.headers || {};
      const result = await axios.request({
        ...params,
        withCredentials: true,
        headers: { ...headers, [HEADER_TENANT_NAME]: currentTenant() },
      });
      setData(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message);
      } else {
        setError('Unknown error.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(request);
  }, []);

  return { data, error, loading };
}
