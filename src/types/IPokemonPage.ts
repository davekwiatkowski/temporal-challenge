interface IPokemonPage {
  pokemon: { id: number; name: string; classfication: string }[];
  nextPage: string;
}

export default IPokemonPage;
