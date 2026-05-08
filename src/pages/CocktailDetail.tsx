import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, GlassWater, ListCheck, Heart } from "lucide-react";
import { fetchCocktailById } from "../api/cocktailApi";
import { type Cocktail } from "../types/cocktail";
import { useMixStore } from "../store/useMixStore";

const CocktailDetail = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cocktail, setCocktail] = useState<Cocktail | null>(null);
    const [loading, setLoading] = useState(true);
    const { toggleFavorite, isFavorite } = useMixStore();

    useEffect(() => {
        if (id) {
            fetchCocktailById(id).then((data) => {
                setCocktail(data);
                setLoading(false);
            })
        }
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-amber-500">Cargando receta...</div>
    if (!cocktail) return <div className="min-h-screen flex items-center justify-center text-white">No se encontró el cóctel.</div>

    const fav = isFavorite(cocktail.id);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-slate-950 pb-20"
        >
            <div className="max-w-6xl mx-auto p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors mb-8 cursor-pointer"
                >
                    <ChevronLeft size={20} /> Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative aspect-square rounded-3xl overflow-hidden border border-slate-800"
                    >
                        <img src={cocktail.image} alt={cocktail.name} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/30">
                            <span className="text-amber-500 text-sm font-bold tracking-widest uppercase">
                                {cocktail.isAlcoholic ? 'Alcohólico' : 'Sin Alcohol'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Información */}
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="text-amber-500 font-medium tracking-tighter uppercase text-sm">{cocktail.category}</span>
                            <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
                                {cocktail.name}
                            </h1>
                            <button
                                onClick={() => toggleFavorite(cocktail)}
                                className={`p-4 mb-4 rounded-full border transition-all duration-300 cursor-pointer ${fav
                                    ? 'bg-amber border-amber-500 text-amber-500'
                                    : 'bg-transparent border-slate-700 text-white hover:border-amber-500'
                                    }`}>
                                <Heart fill={fav ? "currentColor" : "none"} size={24} />
                            </button>
                        </motion.div>

                        {/* Ingredientes */}
                        <div className="mb-10">
                            <h3 className="flex items-center gap-2 text-white text-xl font-medium mb-4">
                                <GlassWater className="text-amber-500" size={20} /> Ingredientes
                            </h3>
                            <ul className="space-y-3">
                                {cocktail.ingredients.map((ing, index) => (
                                    <li key={index} className="flex justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                                        <span className="text-slate-200">{ing.name}</span>
                                        <span className="text-amber-500/80 font-mono">{ing.measure}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Instrucciones */}
                        <div>
                            <h3 className="flex items-center gap-2 text-white text-xl font-medium mb-4">
                                <ListCheck className="text-amber-500" size={20} /> Instrucciones
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-lg bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50 italic">
                                "{cocktail.instructions}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
export default CocktailDetail;