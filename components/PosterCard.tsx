import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Eye } from 'lucide-react';

interface PosterCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const PosterCard: React.FC<PosterCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="group relative bg-brand-gray rounded-lg overflow-hidden border border-brand-gray hover:border-brand-accent/50 transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-brand-accent/10">
      <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img 
          src={product.imageURL} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-brand-accent text-brand-black text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
           <button 
             onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
             className="p-3 bg-white text-black rounded-full hover:bg-brand-accent transition-colors"
             aria-label="View Details"
           >
             <Eye size={20} />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
             className="p-3 bg-brand-black text-white rounded-full hover:bg-brand-accent hover:text-black transition-colors"
             aria-label="Add to Cart"
           >
             <ShoppingCart size={20} />
           </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-brand-accent uppercase tracking-wider mb-1">{product.category}</div>
        <h3 className="text-lg font-medium text-white mb-1 group-hover:text-brand-accent transition-colors truncate">{product.title}</h3>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
             <span className="text-white font-bold">₹{product.price - (product.price * product.discount / 100)}</span>
             {product.discount > 0 && (
               <span className="text-gray-500 text-sm line-through">₹{product.price}</span>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;