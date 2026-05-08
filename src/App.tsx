import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { Heart, Martini } from 'lucide-react'
import { useMixStore } from "./store/useMixStore"
import Hero from "./components/shared/Hero"
import CocktailGrid from "./feactures/catalog/CocktailGrid"
import CocktailDetail from "./pages/CocktailDetail"
import Favorites from "./pages/Favorites"
import FilterBar from "./feactures/catalog/FilterBar"
import { useEffect } from "react"

function App() {
  const { favorites } = useMixStore(); // Se obtienen los favoritos.-
  const { setResults } = useMixStore();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a'); // La busqueda se hace con la 'a' para asegurar de siempre tener datos.-
        const data = await response.json();

        if (data.drinks) {
          const mappedClassics = data.drinks.map((d: any) => ({
            id: d.idDrink,
            name: d.strDrink,
            image: d.strDrinkThumb,
            category: d.strCategory,
            isAlcoholic: d.strAlcoholic === 'Alcoholic',
            ingredients: [],
            instructions: d.strInstructions
          }));

          setResults(mappedClassics);

        }
      } catch (error) {
        console.log("Error cargando datos iniciales: ", error);
      }
    };

    loadInitialData();
  }, [setResults]);

  return (
    <BrowserRouter>
      <main className="min-h-screen bg-slate-950 text-slate-200">

        <nav className="flex justify-around py-2 sticky top-0 z-500 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="p-2 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform">
              <Martini size={20} className="text-slate-950"/>
            </div>
            <span className="font-serif text-xl tracking-tight text-white">MixLab</span>
          </Link>

          <Link
            to="/favorites"
            className="flex items-center gap-2 px-4 py-2 rounded-full boreder border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all group"
          >
            <Heart 
              size={18}
              className={favorites.length > 0 ? "text-amber-500 fill-amber-500" : "text-slate-400 group-hover:text-amber-500"}
            />
            <span className="text.sm font-medium">Mi Bar</span>

            {favorites.length > 0 && (
              <span className="ml-1 bg-amber-500 text-slate-950 text-[10px] font-blod px-1.5 py-0.5 rounded-full">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>

         <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <FilterBar />
              <CocktailGrid />
            </>
          } />
          <Route path="/cocktail/:id" element={<CocktailDetail />}/>
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
