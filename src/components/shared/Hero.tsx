import { motion, AnimatePresence } from 'framer-motion';
import { Search, Martini } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchRandomCocktail } from '../../api/cocktailApi';
import { type Cocktail } from '../../types/cocktail';
import { useMixStore } from '../../store/useMixStore';

const Hero = () => {

  const { searchQuery, setSearchQuery, searchDrinks } = useMixStore();
  const [displayValue, setDisplayValue] = useState(searchQuery);

  const [featuredCocktail, setFeaturedCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);

  const { dailyCocktail, fetchDaily } = useMixStore();

  useEffect(() => {
    const getHeroDrink = async () => {
      try {
        const drink = await fetchRandomCocktail();
        setFeaturedCocktail(drink);
      } catch (error) {
        console.log("Error cargando el cóctel del Hero:", error);
      } finally {
        setLoading(false);
      }
    };

    getHeroDrink();
  }, []);

  // Efecto de debounce para la búsqueda.-
  useEffect(() => {
    const timber = setTimeout(() => {
      searchDrinks(displayValue);
    }, 500);

    return () => clearTimeout(timber);
  }, [displayValue, searchDrinks]);


  useEffect(() => {
    fetchDaily();
  }, [dailyCocktail]);

  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden bg-slate-950">

      {/* Luces difusas de fondo.- */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />

      <div className="z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Texto + Buscador.- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            The Art of <br />
            <span className="text-amber-500">Mixology</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-md">
            Explorá recetas exclusivas o descubrí qué podés preparar con los ingredientes que tenés en casa.
          </p>

          {/* Buscador Estilizado */}
          <div className="relative group max-w-md">

            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
            </div>

            <input
              type="text"
              value={displayValue}
              onChange={(e) => {
                setDisplayValue(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="Buscá un cóctel (ej: Margarita)..."
              className="w-full bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 rounded-full py-4 pl-12 pr-6 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all backdrop-blur-sm"
            />

          </div>
        </motion.div>

        {/* Lado Derecho: Preview de Trago Aleatorio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <AnimatePresence mode="wait">

            {!loading && featuredCocktail ? (
              <motion.div
                key={featuredCocktail.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative group p-4 bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-md hover:border-amber-500/30 transition-all duration-500"
              >

                <div className="overflow-hidden rounded-2xl w-full aspect-4/5 md:w-80">
                  <img
                    src={featuredCocktail.image}
                    alt={featuredCocktail.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="mt-4 flex justify-between items-center px-2">

                  <div>
                    <span className='text-xs font-medium uppercase tracking-widest text-amber-500'>
                      {featuredCocktail.isAlcoholic ? 'Con Alcohol' : 'Sin Alcohol'}
                    </span>
                    <h3 className='text-xl font-serif text-white'>{featuredCocktail.name}</h3>
                  </div>

                  <div className='p-2 bg-slate-800 rounded-full text-white'>
                    <Martini size={18} />
                  </div>

                </div>
              </motion.div>

            ) : (

              // Skeleton de carga para el cóctel destacado.-
              <div className="w-80 h-100 bg-slate-900 animate-pulse rounded-3xl border border-slate-800" />

            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;