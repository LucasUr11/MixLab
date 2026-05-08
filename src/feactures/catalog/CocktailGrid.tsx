import { useMixStore } from "../../store/useMixStore";
import CocktailCard from "./CocktailCard";
import { motion, AnimatePresence } from "framer-motion";

const CocktailGrid = () => {
    const { searchResults, loading, searchQuery } = useMixStore();

    if (loading) return <div className="text-center text-amber-500 py-10">Buscando Mixturas...</div>
    // Si no hay búsqueda activa, no mostrar nada.-
    if (!searchQuery && searchResults.length === 0) return null;

    return (
        <section className="max-w7xl mx-auto px-6 py-12">
            <h2 className="text-white font-serif text-3xl mb-8">
                {searchQuery ? (
                    <>Resultados para: <span className="text-amber-500">{searchQuery}</span></>
                ) : (
                    "Nuestas Recomendaciones"
                )}
            </h2>

            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"    
            >
                <AnimatePresence>
                    {searchResults.map((cocktail) => (
                        <CocktailCard key={cocktail.id} cocktail={cocktail} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {searchResults.length === 0 && (
                <p className="text slate-500 text-center py-10">No encontramos ningún trago con ese nombre.</p>
            )}
        </section>
    )
}

export default CocktailGrid;