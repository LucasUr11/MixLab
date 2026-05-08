import { motion } from 'framer-motion';
import { useMixStore } from '../../store/useMixStore';
import { fetchCocktailsByCategory, fetchCocktailsByAlcohol } from '../../api/cocktailApi';
import { Sparkle, Wine, GlassWater, Beer } from 'lucide-react';
import { useState } from 'react';
import type { Cocktail } from '../../types/cocktail';

const filters = [
    { id: 'all', label: 'Todos', icon: <Sparkle size={16} /> },
    { id: 'Ordinary_Drink', label: 'Clásicos', icon: <Wine size={16} /> },
    { id: 'Cocktail', label: 'Cócteles', icon: <GlassWater size={16} /> },
    { id: 'Non_Alcoholic', label: 'Sin Alcohol', icon: <Beer size={16} />, type: 'alcohol' },
];

const FilterBar = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const { setResults } = useMixStore();

    const handleFilterClick = async (filter: typeof filters[0]) => {
        setActiveFilter(filter.id);

        try {
            let results: Cocktail[] = [];

            if (filter.id === 'all') {
                const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
                const data = await response.json();

                if (data.drinks) {
                    results = data.drinks.map((d: any) => ({
                        id: d.idDrink,
                        name: d.strDrink,
                        image: d.strDrinkThumb,
                        category: d.strCategory,
                        isAlcoholic: d.strAlcoholic === 'Alcoholic',
                        ingredients: [],
                        instructions: d.strInstructions
                    }));
                }
            } else if (filter.type === 'alcohol') {
                results = await fetchCocktailsByAlcohol(filter.id);
            } else {
                results = await fetchCocktailsByCategory(filter.id);
            }

            setResults(results);

        } catch (error) {
            console.log("Error al filtrar: ", error);
        }
    };

    return (
        <div className="w-full py-8 overflow-x-auto no-scrollbar">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-4 flex-wrap">
                {filters.map((filter) => (
                    <motion.button
                        key={filter.id}
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95}}
                        onClick={() => handleFilterClick(filter)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                            activeFilter === filter.id
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600'
                        }`}
                    >
                        {filter.icon}
                        <span className="text-sm tracking-wide uppercase">{filter.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
