import { useQuery } from 'react-query';
import { fetchData } from '../api/api'; // Importando função de API
import { CommonData } from '../interface/Interfaces';

export function useFetchData<T extends CommonData>(endpoint: string) {
  const query = useQuery({
    queryFn: () => fetchData<T>(endpoint),
    queryKey: [endpoint], 
    retry: 3, 
  });

  return {
    ...query,
    data: query.data?.data,
  };
}