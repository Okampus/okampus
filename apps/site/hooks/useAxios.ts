import { currentTenant } from '../utils/current-tenant';
import { HEADER_TENANT_NAME } from '@okampus/shared/consts';
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export function useAxios(request: AxiosRequestConfig, inDomain = false) {
  const [data, setData] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (params: typeof request) => {
      try {
        const result = await axios.request({
          ...params,
          withCredentials: true,
          headers: { ...params.headers, ...(inDomain && { [HEADER_TENANT_NAME]: currentTenant() }) },
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

    fetchData(request);
  }, [inDomain, request]);

  return { data, error, loading };
}
