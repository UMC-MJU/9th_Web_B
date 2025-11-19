import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export const useCustomFetch = <T>(url: string): UseQueryResult<NoInfer<T>,
    Error> => {
    return useQuery({
        queryKey: [url],

        queryFn: async ({ signal }): Promise<T> => {
            const response = await fetch(url, { signal });


            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            return response.json() as Promise<T>;
        },

        retry: 10,

        // 지수 백오프 전략
        retryDelay: (attemptIndex): number => {
            return Math.min(1000 * Math.pow(2, attemptIndex), 30_000);
        },

        staleTime: 5 * 60 * 1_000,

        // 쿼리가 사용되지 않은 채로 10분이 지나면 캐시에서 제거
        gcTime: 10 * 60 * 1_000,
    });
};