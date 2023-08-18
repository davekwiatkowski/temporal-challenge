import useSWR from 'swr';
import IPokemonPage from '../types/IPokemonPage';
import fetcher from './fetcher';
import { baseUrl } from '../constants/urlConstants';

function useFetchPokemonList(
  query: string | undefined,
  {
    page,
    chaos,
    flakiness,
  }: { page?: string; chaos?: boolean; flakiness?: number } = {}
) {
  const params = new URLSearchParams();
  if (page) {
    params.append('page', page);
  }
  if (chaos) {
    params.append('chaos', chaos ? 'true' : 'false');
  }
  if (flakiness) {
    params.append('flakiness', flakiness.toString());
  }

  const { data, error, isLoading } = useSWR<IPokemonPage>(
    query
      ? `${baseUrl}/api/pokemon/search/${query}?${params.toString()}`
      : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}

export default useFetchPokemonList;
