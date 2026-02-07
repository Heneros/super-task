export interface Image {
  id: number;
  posterUrl: string;
  isMain: boolean;
}

export interface SuperHero {
  id: number;
  nickname: string;
  origin_description: string;
  superpowers: string[];
  catch_phrase: string;
  mainImage: string
}
