import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}


export default function useCustomFetch<T>(url: string, deps: unknown[] = []) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    setState({ data: null, loading: true, error: null });

    axios
      .get<T>(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      })
      .then((res) => {
        if (isMounted) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: AxiosError) => {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error:
              err.response?.status === 404
                ? "데이터를 찾을 수 없습니다"
                : "서버 요청 중 오류가 발생했습니다",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, deps);

  return state;
}