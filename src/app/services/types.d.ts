export interface Pokemon {
  id: number;
  name: string;
  weight: number;
  height: number;
  base_experience: 64;
  abilities: Ability[];
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
  };
}

interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}
