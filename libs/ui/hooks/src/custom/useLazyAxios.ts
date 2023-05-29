import { useState } from 'react';
import axios from 'axios';
import { HEADER_TENANT_NAME } from '@okampus/shared/consts';
import { currentTenant } from '@okampus/ui/utils';

import type { AxiosRequestConfig } from 'axios';

export function useLazyAxios(onData?: (data: unknown) => void, onError?: (data: unknown) => void) {
  const [data, setData] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);

  const fetchData = async (params: AxiosRequestConfig) => {
    if (loading === null) setLoading(true);

    try {
      const headers = params.headers || {};
      const result = await axios.request({
        ...params,
        withCredentials: true,
        headers: { ...headers, [HEADER_TENANT_NAME]: currentTenant() },
      });
      setData(result.data);
      onData?.(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message);
      } else {
        setError('Unknown error.');
      }
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return [(params: AxiosRequestConfig) => fetchData(params), { data, error, loading }] as const;
}
