import { useState, useEffect } from 'react';
import axios, { type AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    },
});

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export const useFetch = <T,>(url: string, options?: AxiosRequestConfig): FetchState<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return;
        };

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get<T>(url, options);
                setData(response.data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [options, url]); 

    return { data, loading, error };
};