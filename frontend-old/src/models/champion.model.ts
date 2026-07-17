export interface Spell {
  name: string;
  description: string;
  image: {
    full: string;
  };
}

export interface Champion {
  id: string;
  name: string;
  title: string;
  blurb: string;
  tags: string[];
  info: {
    attack: string;
    defense: string;
    magic: string;
    difficulty: string;
  };
  lore: string;
  passive: Spell;
  spells: Spell[];
  skins: number[];
}

export type PartialChampion = Omit<
  Champion,
  'lore' | 'passive' | 'spells' | 'skins'
>;
