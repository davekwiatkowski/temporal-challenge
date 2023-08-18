import { Content } from 'antd/es/layout/layout';
import './App.css';
import { Button, Input, Layout, List, Spin, theme } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useCallback, useEffect, useState } from 'react';
import useDebounce from './util/useDebounce';
import useFetchPokemonList from './util/useFetchPokemonList';
import PokemonInfo from './components/PokemonInfo';

/* 
  Note: SWR uses the exponential backoff algorithm(opens in a new tab) to retry the request on error. 
  The algorithm allows the app to recover from errors quickly, but not waste resources retrying too often.
  https://swr.vercel.app/docs/error-handling#error-retry 
*/

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [query, setQuery] = useState<string>();
  const debouncedQuery = useDebounce(query, 300);

  const [nextPage, setNextPage] = useState<string>();
  const [nextPage2, setNextPage2] = useState<string>();

  const [page, setPage] = useState(0);
  const [id, setId] = useState<number>();

  const { data, isLoading, error } = useFetchPokemonList(debouncedQuery, {
    page: nextPage2,
    chaos: true,
  });

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useFetchPokemonList(debouncedQuery, { page: nextPage });

  const handleSearchPokemon = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setPage(0);
      setNextPage(undefined);
      setNextPage2(undefined);
    },
    []
  );

  const handleNextPageChange = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  useEffect(() => {
    if (page % 2 === 0 && data?.nextPage) {
      setNextPage(data.nextPage);
    } else if (page % 2 === 1 && data2?.nextPage) {
      setNextPage2(data2.nextPage);
    }
  }, [data?.nextPage, data2?.nextPage, page]);

  return (
    <Layout>
      <Sider style={{ background: colorBgContainer }}>
        <Input
          placeholder='Search for Pokemon'
          onChange={handleSearchPokemon}
        />
        {(isLoading && page % 2 === 0) || (isLoading2 && page % 2 === 1) ? (
          <Spin />
        ) : (error && page % 2 === 0) || (error2 && page % 2 === 1) ? (
          <>Error</>
        ) : (
          <>
            <List
              dataSource={page % 2 === 0 ? data?.pokemon : data2?.pokemon}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  onClick={() => setId(item.id)}
                  style={{ cursor: 'pointer' }}>
                  <List.Item.Meta
                    avatar={item.id}
                    title={item.name}
                    description={item.classfication}
                  />
                </List.Item>
              )}
            />
          </>
        )}
        {((page % 2 === 0 && data?.nextPage) ||
          (page % 2 === 1 && data2?.nextPage)) && (
          <Button onClick={handleNextPageChange}>Next page</Button>
        )}
      </Sider>
      <Content>
        <PokemonInfo id={id} />
      </Content>
    </Layout>
  );
}

export default App;
