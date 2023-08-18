import useSWR from 'swr';
import IPokemonPage from '../types/IPokemonPage';
import fetcher from './fetcher';
import { baseUrl } from '../constants/urlConstants';

function useFetchPokemonInfo(id?: number) {
  const { data, error, isLoading } = useSWR<IPokemonPage>(
    id ? `${baseUrl}/api/pokemon/${id}` : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}

export default useFetchPokemonInfo;
