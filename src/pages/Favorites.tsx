import { motion, AnimatePresence } from 'framer-motion';
import { useMixStore } from '../store/useMixStore';
import CocktailCard from '../feactures/catalog/CocktailCard';
import { Martini, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
    const { favorites } = useMixStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer'>
                        <ArrowLeft size={20} /> Volver
                    </button>
                    <div className="text-right">
                        <h1 className="text-4xl font-serif text-white mb-2">Mi Bar</h1>
                        <p className="text-amber-500/80 text-sm -tracking-widest uppercase">Colección Personale</p>
                    </div>
                </div>

                {favorites.length > 0 ? (
                    <motion.div
                        layout
                        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                    >
                        <AnimatePresence>
                            {favorites.map((cocktail) => (
                                <CocktailCard key={cocktail.id} cocktail={cocktail} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex flex-col items-center justify-center py-20 text-center'
                    >
                        <div className="p-6 bg-slate-900 rounded-full mb-6 border border-slate-800">
                            <Martini size={48} className='text-slate-700' />
                        </div>
                        <h2 className="text.2xl text-white font-serif mb-2">Tu Bar está vacío</h2>
                        <p className="text-slate-500 max.-w-xs">
                            Explora nuevas recetas y guarda tus favoritas para tenerlas siempre a mano.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Favorites