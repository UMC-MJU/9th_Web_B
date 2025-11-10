import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

export default function useGetLpDetail(lpid: string) {
  return useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid,
    staleTime: 1000 * 60 * 2,
  });
}
