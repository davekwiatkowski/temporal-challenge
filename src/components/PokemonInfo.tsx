import { FC } from 'react';
import useFetchPokemonInfo from '../util/useFetchPokemonInfo';
import { Spin, Table } from 'antd';

const columns = [
  { title: 'Stat', dataIndex: 'key', key: 'key' },
  { title: 'Value', dataIndex: 'value', key: 'value' },
];

const PokemonInfo: FC<{ id?: number }> = ({ id }) => {
  const { data, isLoading, error } = useFetchPokemonInfo(id);

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : error ? (
        <>Error</>
      ) : (
        <>
          {data && (
            <Table
              columns={columns}
              dataSource={Object.entries(data).map(([key, value]) => ({
                key,
                value,
              }))}
            />
          )}
        </>
      )}
    </>
  );
};

export default PokemonInfo;
