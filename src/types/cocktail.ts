
export interface Cocktail {
    id: string;
    name: string;
    category: string;
    image: string;
    instructions: string;
    ingredients: {name: string; measure: string}[];
    isAlcoholic: boolean;
}