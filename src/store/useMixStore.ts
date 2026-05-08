import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cocktail } from '../types/cocktail';
import { searchCocktailsByName } from '../api/cocktailApi';

interface MixState {
    
    searchQuery: string;
    searchResults: Cocktail[];
    loading: boolean;
    setSearchQuery: (query: string) => void;
    searchDrinks: (query: string) => Promise<void>;
    
    favorites: Cocktail[];
    toggleFavorite: (cocktail: Cocktail) => void;
    isFavorite: (id: string) => boolean;
    
    setResults: (results: Cocktail[]) => void;

    dailyCocktail: Cocktail | null;
    fetchDaily: () => Promise<void>;
}

export const useMixStore = create<MixState>()(
    
    persist(
        (set, get) => ({
            // Lógica de Búsqueda.-
            searchQuery: '',
            searchResults: [] as Cocktail[],
            loading: false,
            setResults: (results) => set({ searchResults: results, loading: false}),
            setSearchQuery: (query) => set({ searchQuery: query }),
            searchDrinks: async (query) => {
                if (!query) {
                    set({ searchResults: [], loading: false });
                    return;
                }
                set({ loading: true });
                try {
                    const results = await searchCocktailsByName(query);
                    set({ searchResults: results, loading: false });
                } catch (error) {
                    console.error("Error en la búsqueda:", error);
                    set({ loading: false });
                }
            },

            // Lógica de Favoritos.-
            favorites: [],
            toggleFavorite: (cocktail) => {
                const { favorites } = get();
                const isAlreadyFav = favorites.some((fav) => fav.id === cocktail.id);

                if (isAlreadyFav) {
                    set({ favorites: favorites.filter((fav) => fav.id !== cocktail.id) });
                } else {
                    set({ favorites: [...favorites, cocktail] });
                }
            },
            isFavorite: (id) => {
                return get().favorites.some((fav) => fav.id === id);
            },
            
            // Lógica para el "parpadeo" en el Hero.-
            dailyCocktail: null,
            fetchDaily: async () => {
                if (get().dailyCocktail) return; // Si encuentra un trajo, corta la ejecución.-

                try {
                    const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
                    const data = await res.json();

                    if (data.drinks) {
                        const d = data.drinks[0];
                        const mapped = {
                            id: d.idDrink,
                            name: d.strDrink,
                            image: d.strDrinkThumb,
                            category: d.strCategory,
                            isAlcoholic: d.strAlcoholic === 'Alcoholic',
                            ingredients: [],
                            instructions: d.strInstructions
                        };

                        set({ dailyCocktail: mapped});
                    }
                } catch (error) {
                    console.log("Error al traer el trago diario: ", error);
                }
            }
            
        }),
        {
            name: 'mixlab-storage',
            partialize: (state) => ({ favorites: state.favorites }),
        }
    )
);