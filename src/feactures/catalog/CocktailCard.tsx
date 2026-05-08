import { motion } from 'framer-motion';
import { type Cocktail } from '../../types/cocktail';
import { Link } from 'react-router-dom';

interface Props {
    cocktail: Cocktail;
}

const CocktailCard = ({ cocktail }: Props) => {
    return (
        <Link to={`/cocktail/${cocktail.id}`}>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900/40 border border-slate-800 p-3 rounded-2xl hover:border-amber-500/50 transition-colors group"
            >
                <div className="overflow-hidden rounded-xl aspect-square mb-4">
                    <img
                        src={cocktail.image}
                        alt={cocktail.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="px-2 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                        {cocktail.category}
                    </span>
                    <h3 className="text white font-serif text-xl truncate">{cocktail.name}</h3>
                </div>
            </motion.div>
        </Link>
    )
}

export default CocktailCard;