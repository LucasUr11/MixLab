import { type Cocktail } from '../types/cocktail';
const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const fetchRandomCocktail = async(): Promise<Cocktail> => {
    
    const response = await fetch(`${BASE_URL}/random.php`);
    const data = await response.json();
    const drink = data.drinks[0];

    // Lista para unificar ingredientes y medidas en un array limpio.-
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const name = drink[`strIngredient${i}`];
        const measure = drink[`strIngredient${i}`];
        if (name) ingredients.push({name, measure: measure || ''});
    }

    return {
        id: drink.idDrink,
        name: drink.strDrink,
        category: drink.strCategory,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients,
        isAlcoholic: drink.strAlcoholic === 'Alcoholic'
    }
}

export const searchCocktailsByName = async (query: string): Promise<Cocktail[]> => {
    if (!query) return [];

    const response = await fetch (`${BASE_URL}/search.php?s=${query}`);
    const data = await response.json();

    if (!data.drinks) return [];

    return data.drinks.map((drink: any) => ({
        id: drink.idDrink,
        name: drink.strDrink,
        category: drink.strCategory,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients: [],
        isAlcoholic: drink.strAlcoholic === 'Alcoholic'
    }));
}

export const fetchCocktailById = async (id: string): Promise<Cocktail | null> => {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.drinks) return null;
    const drink = data.drinks[0];

    const ingredients = [];
    for(let i = 1; i <= 15; i++) {
        const name = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (name) ingredients.push({ name, measure: measure || ''});
    }

    return {
        id: drink.idDrink,
        name: drink.strDrink,
        category: drink.strCategory,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients,
        isAlcoholic: drink.strAlcoholic === 'Alcoholic'
    }

}

export const fetchCocktailsByCategory = async (category: string): Promise<Cocktail[]> => {
    const formattedCategory = category.replace(/ /g, '_');
    const response = await fetch(`${BASE_URL}/filter.php?c=${formattedCategory}`);
    const data = await response.json();

    if (!data.drinks) return [];

    return data.drinks.map((drink: any) => ({
        id: drink.idDrink,
        name: drink.strDrink,
        image: drink.strDrinkThumb,
        category: category,
        ingredients: [],
        instructions: '',
        isAlcoholic: true,
    }));
} ;

// Función para filtrar por tipo de alcohol.-
export const fetchCocktailsByAlcohol = async (type: string): Promise<Cocktail[]> => {
    const response = await fetch(`${BASE_URL}/filter.php?a=${type}`);
    const data = await response.json();

    if (!data.drinks) return [];

    return data.drinks.map((drink: any) => ({
        id: drink.idDrink,
        name: drink.strDrink,
        image: drink.strDrinkThumb,
        category: '',
        ingredients: [],
        instruntions: '',
        isAlcoholic: type === 'Alcoholic',
    }));
};