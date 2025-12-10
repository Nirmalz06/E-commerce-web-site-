import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  Filter, 
  Sparkles, 
  Send,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCcw,
  CreditCard
} from 'lucide-react';
import { DUMMY_PRODUCTS, CATEGORIES, POSTER_SIZES } from './constants';
import { Product, CartItem, User, ViewState, FilterState, ChatMessage } from './types';
import PosterCard from './components/PosterCard';
import { getProductRecommendations } from './services/geminiService';

// --- Helper Components defined in same file for single-file constraint structure ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-accent text-brand-black hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(0,220,130,0.3)]",
    secondary: "bg-brand-gray text-white hover:bg-zinc-700",
    outline: "border border-brand-gray text-white hover:border-brand-accent hover:text-brand-accent bg-transparent"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    className="w-full bg-brand-dark border border-brand-gray rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors placeholder-gray-600"
    {...props} 
  />
);

const App = () => {
  // --- Global State ---
  const [view, setView] = useState<ViewState>('HOME');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // --- UI State ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // --- Filter State ---
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    minPrice: 0,
    maxPrice: 10000,
    search: ''
  });

  // --- AI Chat State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I am your AI Art Curator. Tell me about your space or mood, and I will find the perfect poster for you.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  // --- Handlers ---

  const handleAddToCart = (product: Product, sizeValue: string = POSTER_SIZES[0].value) => {
    const sizeObj = POSTER_SIZES.find(s => s.value === sizeValue) || POSTER_SIZES[0];
    const adjustedPrice = product.price * sizeObj.multiplier;

    setCart(prev => {
      const existing = prev.find(p => p._id === product._id && p.selectedSize === sizeValue);
      if (existing) {
        return prev.map(p => (p._id === product._id && p.selectedSize === sizeValue) ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, price: adjustedPrice, quantity: 1, selectedSize: sizeValue }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item._id === id && item.selectedSize === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item._id === id && item.selectedSize === size)));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend auth
    setUser({
      _id: 'user_123',
      name: 'Demo User',
      email: 'user@example.com',
      role: 'user',
      token: 'jwt_mock_token'
    });
    setView('HOME');
  };

  const handleLogout = () => {
    setUser(null);
    setView('HOME');
    setCart([]);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    const response = await getProductRecommendations(userMsg.text, products);

    setIsTyping(false);
    setChatMessages(prev => [...prev, {
      role: 'model',
      text: response.text,
      isProductRecommendation: response.recommendedIds.length > 0,
      recommendedProductIds: response.recommendedIds
    }]);
  };

  // --- Computed ---
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.price - (item.price * item.discount / 100);
    return sum + (price * item.quantity);
  }, 0);

  const filteredProducts = products.filter(p => {
    const matchesCategory = filters.category === 'All' || p.category === filters.category;
    const matchesSearch = p.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // --- Render Components ---

  const Navbar = () => (
    <nav className="fixed top-0 w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setView('HOME')}>
            <h1 className="text-2xl font-bold tracking-tighter text-white">
              TRIZO<span className="text-brand-accent">VERZE</span>
            </h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setView('HOME')} className={`text-sm font-medium hover:text-brand-accent transition ${view === 'HOME' ? 'text-brand-accent' : 'text-gray-300'}`}>Home</button>
            <button onClick={() => setView('SHOP')} className={`text-sm font-medium hover:text-brand-accent transition ${view === 'SHOP' ? 'text-brand-accent' : 'text-gray-300'}`}>Shop</button>
            <div className="relative group">
               <button className="text-sm font-medium text-gray-300 hover:text-brand-accent flex items-center gap-1">Categories</button>
               <div className="absolute top-full left-0 mt-2 w-48 bg-brand-gray border border-zinc-700 rounded-md shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, category: cat }));
                        setView('SHOP');
                      }}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-brand-gray text-sm rounded-full pl-4 pr-10 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-accent text-white w-48"
                value={filters.search}
                onChange={(e) => {
                   setFilters(prev => ({ ...prev, search: e.target.value }));
                   if (view !== 'SHOP') setView('SHOP');
                }}
              />
              <Search className="absolute right-3 top-2 text-gray-400" size={16} />
            </div>

            <button 
              className="relative p-2 text-gray-300 hover:text-brand-accent transition"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-brand-accent font-bold">
                    {user.name.charAt(0)}
                 </div>
                 <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-white"><LogOut size={16}/></button>
              </div>
            ) : (
              <button 
                onClick={() => setView('LOGIN')}
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-brand-accent transition"
              >
                <UserIcon size={20} />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              className="relative p-2 text-gray-300"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-brand-gray px-4 pt-2 pb-6 space-y-4">
           <button onClick={() => { setView('HOME'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-300">Home</button>
           <button onClick={() => { setView('SHOP'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-300">Shop</button>
           {!user && <button onClick={() => { setView('LOGIN'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-300">Login</button>}
           {user && <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400">Logout</button>}
        </div>
      )}
    </nav>
  );

  const CartDrawer = () => (
    <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-brand-dark border-l border-brand-gray shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-brand-gray">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="text-brand-accent" /> Your Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
              <p>Your cart is empty.</p>
              <button 
                onClick={() => { setIsCartOpen(false); setView('SHOP'); }}
                className="mt-4 text-brand-accent hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item._id}-${item.selectedSize}-${idx}`} className="flex gap-4">
                <img src={item.imageURL} alt={item.title} className="w-20 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="font-medium text-white line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.category} • {item.selectedSize}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-brand-accent">₹{(item.price - (item.price * item.discount / 100)).toFixed(0)}</span>
                    <div className="flex items-center bg-brand-gray rounded-md border border-zinc-700">
                      <button onClick={() => handleUpdateQuantity(item._id, item.selectedSize, -1)} className="p-1 hover:text-white text-gray-400"><Minus size={14}/></button>
                      <span className="px-2 text-sm text-white">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item._id, item.selectedSize, 1)} className="p-1 hover:text-white text-gray-400"><Plus size={14}/></button>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleRemoveFromCart(item._id, item.selectedSize)} className="text-gray-500 hover:text-red-500 self-start">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-brand-gray bg-brand-black">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-xl font-bold text-white">₹{cartTotal.toFixed(0)}</span>
          </div>
          <Button 
            className="w-full" 
            disabled={cart.length === 0}
            onClick={() => { setIsCartOpen(false); setView('CHECKOUT'); }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );

  const ChatAssistant = () => (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isChatOpen ? 'w-80 sm:w-96 h-[500px]' : 'w-14 h-14 rounded-full'} bg-brand-dark border border-brand-gray shadow-2xl flex flex-col overflow-hidden`}>
      {isChatOpen ? (
        <>
          <div className="bg-brand-accent p-4 flex justify-between items-center">
             <div className="flex items-center gap-2 text-brand-black font-bold">
               <Sparkles size={18} /> AI Curator
             </div>
             <button onClick={() => setIsChatOpen(false)} className="text-brand-black hover:bg-black/10 rounded p-1">
               <X size={18} />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-gray/50">
             {chatMessages.map((msg, idx) => (
               <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-brand-accent text-brand-black rounded-tr-none' : 'bg-brand-gray border border-zinc-700 text-gray-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  {msg.isProductRecommendation && msg.recommendedProductIds && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                       {products.filter(p => msg.recommendedProductIds?.includes(p._id)).map(p => (
                         <div key={p._id} className="bg-brand-black border border-zinc-700 rounded p-2 w-32 cursor-pointer hover:border-brand-accent" onClick={() => { setSelectedProduct(p); setView('PRODUCT_DETAILS'); }}>
                            <img src={p.imageURL} alt="" className="w-full h-24 object-cover rounded mb-1"/>
                            <p className="text-[10px] text-white truncate">{p.title}</p>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
             ))}
             {isTyping && (
               <div className="flex items-start">
                 <div className="bg-brand-gray px-4 py-2 rounded-lg rounded-tl-none border border-zinc-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>
          <div className="p-3 bg-brand-dark border-t border-brand-gray flex gap-2">
             <input 
               type="text" 
               className="flex-1 bg-brand-gray text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-accent"
               placeholder="Ask for recommendations..."
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
             />
             <button onClick={handleSendChat} className="p-2 bg-brand-accent text-brand-black rounded-md hover:bg-emerald-400">
               <Send size={16} />
             </button>
          </div>
        </>
      ) : (
        <button onClick={() => setIsChatOpen(true)} className="w-full h-full flex items-center justify-center bg-brand-accent text-brand-black rounded-full hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,220,130,0.4)]">
          <Sparkles size={24} />
        </button>
      )}
    </div>
  );

  const Hero = () => (
    <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-60" 
          alt="Hero" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 to-transparent" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        <div className="inline-block px-4 py-1.5 mb-6 border border-brand-accent/30 rounded-full bg-brand-accent/10 backdrop-blur-md">
           <span className="text-brand-accent text-sm font-medium tracking-wide uppercase">New Collection Drop 2024</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-2xl">
          ART THAT <span className="text-brand-accent">SPEAKS</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
          Transform your space with premium, curated posters from the world's best digital artists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setView('SHOP')} className="px-10 py-4 text-lg shadow-lg shadow-brand-accent/20">
            Shop Collection <ArrowRight size={20} />
          </Button>
          <Button variant="outline" onClick={() => setIsChatOpen(true)} className="px-10 py-4 text-lg backdrop-blur-sm bg-black/20">
            Ask AI Curator
          </Button>
        </div>
      </div>
    </div>
  );

  const ProductDetails = ({ product }: { product: Product }) => {
    const [selectedSize, setSelectedSize] = useState(POSTER_SIZES[0].value);
    
    if (!product) return null;
    
    // Calculate price based on size
    const sizeObj = POSTER_SIZES.find(s => s.value === selectedSize) || POSTER_SIZES[0];
    const basePrice = product.price * sizeObj.multiplier;
    const finalPrice = basePrice - (basePrice * product.discount / 100);

    const relatedProducts = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

    return (
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setView('SHOP')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">&larr; Back to Shop</button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-brand-gray rounded-lg overflow-hidden border border-zinc-800 shadow-2xl relative group">
             <img src={product.imageURL} alt={product.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
             <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-lg"></div>
          </div>
          <div className="flex flex-col justify-center">
             <div className="text-brand-accent font-medium mb-2 uppercase tracking-widest text-xs">{product.category}</div>
             <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{product.title}</h1>
             <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-white">₹{finalPrice.toFixed(0)}</span>
                {product.discount > 0 && <span className="text-xl text-gray-500 line-through">₹{basePrice.toFixed(0)}</span>}
                {product.discount > 0 && <span className="px-3 py-1 bg-brand-accent text-brand-black text-sm font-bold rounded-full">SAVE {product.discount}%</span>}
             </div>
             
             <p className="text-gray-300 mb-8 leading-relaxed text-lg border-l-2 border-brand-accent pl-4">
               {product.description}
             </p>

             <div className="space-y-8 mb-8 p-6 bg-brand-gray/30 rounded-xl border border-white/5">
               {/* Size Selection */}
               <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">Select Size <span className="text-xs text-gray-500 font-normal">(Inches)</span></h3>
                  <div className="grid grid-cols-3 gap-3">
                    {POSTER_SIZES.map(size => (
                      <button
                        key={size.value}
                        onClick={() => setSelectedSize(size.value)}
                        className={`px-2 py-3 rounded-lg text-sm font-medium transition-all ${
                          selectedSize === size.value 
                          ? 'bg-brand-accent text-brand-black shadow-lg shadow-brand-accent/20 scale-105' 
                          : 'bg-brand-gray border border-zinc-700 text-gray-400 hover:border-gray-500 hover:text-white'
                        }`}
                      >
                        {size.label.split('(')[0]}<br/>
                        <span className="text-xs opacity-70">{size.value}</span>
                      </button>
                    ))}
                  </div>
               </div>
               
               <div className="flex items-center gap-2 text-sm">
                 <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 {product.stock > 0 ? <span className="text-green-400 font-medium">{product.stock} in stock - Ready to ship</span> : <span className="text-red-500">Out of Stock</span>}
               </div>
             </div>

             <div className="flex gap-4">
               <Button onClick={() => handleAddToCart(product, selectedSize)} className="flex-1 py-4 text-lg font-bold">Add to Cart</Button>
               <button className="p-4 border border-brand-gray bg-brand-gray/50 rounded-md text-white hover:border-brand-accent hover:text-brand-accent transition shadow-lg">
                 <Sparkles size={24} />
               </button>
             </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-zinc-800 pt-16">
            <h3 className="text-2xl font-bold mb-8">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               {relatedProducts.map(p => (
                 <PosterCard key={p._id} product={p} onAddToCart={(p) => handleAddToCart(p)} onViewDetails={(p) => { setSelectedProduct(p); setView('PRODUCT_DETAILS'); }} />
               ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const Checkout = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const handlePlaceOrder = () => {
       setLoading(true);
       setTimeout(() => {
          setLoading(false);
          setStep(3);
          setCart([]);
       }, 2000);
    };

    if (step === 3) {
      return (
        <div className="pt-32 pb-12 max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h2>
          <p className="text-gray-400 mb-8">Thank you for your purchase. Your art is being prepared for shipment.</p>
          <Button onClick={() => setView('HOME')}>Continue Shopping</Button>
        </div>
      );
    }

    return (
      <div className="pt-24 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
         <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               {/* Section 1: Address */}
               <div className="bg-brand-gray p-6 rounded-lg border border-zinc-800">
                  <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2"><div className="w-6 h-6 bg-brand-accent text-black rounded-full text-sm flex items-center justify-center font-bold">1</div> Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input placeholder="First Name" />
                     <Input placeholder="Last Name" />
                     <Input placeholder="Address" className="md:col-span-2" />
                     <Input placeholder="City" />
                     <Input placeholder="Postal Code" />
                  </div>
               </div>
               
               {/* Section 2: Payment */}
               <div className="bg-brand-gray p-6 rounded-lg border border-zinc-800">
                  <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2"><div className="w-6 h-6 bg-brand-accent text-black rounded-full text-sm flex items-center justify-center font-bold">2</div> Payment Method</h3>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 p-4 border border-brand-accent bg-brand-accent/5 rounded-md">
                        <div className="w-4 h-4 rounded-full bg-brand-accent border-2 border-brand-accent"></div>
                        <span className="text-white font-medium flex items-center gap-2"><CreditCard size={16}/> Credit / Debit Card</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                        <Input placeholder="Card Number" className="md:col-span-2" />
                        <Input placeholder="Expiry (MM/YY)" />
                        <Input placeholder="CVC" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-brand-gray p-6 rounded-lg border border-zinc-800 h-fit">
               <h3 className="text-xl font-medium text-white mb-6">Order Summary</h3>
               <div className="space-y-4 mb-6">
                 {cart.map((item, idx) => (
                   <div key={`${item._id}-${idx}`} className="flex justify-between text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-300">{item.title}</span>
                        <span className="text-gray-500 text-xs">{item.selectedSize}</span>
                        <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                      </div>
                      <span className="text-white">₹{((item.price * (100 - item.discount)/100) * item.quantity).toFixed(0)}</span>
                   </div>
                 ))}
               </div>
               <div className="border-t border-zinc-700 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{cartTotal.toFixed(0)}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Shipping</span><span>Free</span></div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2"><span>Total</span><span>₹{cartTotal.toFixed(0)}</span></div>
               </div>
               <Button className="w-full mt-8" onClick={handlePlaceOrder} disabled={loading}>
                 {loading ? "Processing..." : "Place Order"}
               </Button>
            </div>
         </div>
      </div>
    );
  };

  const AuthPage = ({ type }: { type: 'LOGIN' | 'REGISTER' }) => (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-black">
       <div className="w-full max-w-md bg-brand-gray p-8 rounded-lg border border-zinc-800 shadow-2xl">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-white mb-2">{type === 'LOGIN' ? 'Welcome Back' : 'Join Trizoverze'}</h2>
             <p className="text-gray-400">Enter your details below</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
             {type === 'REGISTER' && <Input placeholder="Full Name" required />}
             <Input type="email" placeholder="Email Address" required />
             <Input type="password" placeholder="Password" required />
             <Button type="submit" className="w-full py-3">{type === 'LOGIN' ? 'Sign In' : 'Create Account'}</Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
             {type === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
             <button 
               className="text-brand-accent hover:underline"
               onClick={() => setView(type === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
             >
                {type === 'LOGIN' ? 'Sign Up' : 'Log In'}
             </button>
          </div>
          <div className="mt-4 text-center">
             <button onClick={() => setView('HOME')} className="text-gray-500 text-xs hover:text-white">Back to Home</button>
          </div>
       </div>
    </div>
  );

  const FEATURED_COLECTIONS = [
      { title: 'Anime', category: 'Anime', image: 'https://loremflickr.com/600/800/anime,manga?lock=1' },
      { title: 'Automotive', category: 'Automotive', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop' },
      { title: 'Abstract', category: 'Abstract', image: 'https://images.unsplash.com/photo-1507608869274-2c33ee1808c1?q=80&w=1000&auto=format&fit=crop' }
  ];

  return (
    <div className="bg-brand-black min-h-screen text-white font-sans selection:bg-brand-accent selection:text-black">
      {view !== 'LOGIN' && view !== 'REGISTER' && <Navbar />}
      {view !== 'LOGIN' && view !== 'REGISTER' && <CartDrawer />}
      {view !== 'LOGIN' && view !== 'REGISTER' && <ChatAssistant />}

      <main className={`${(view !== 'LOGIN' && view !== 'REGISTER') ? '' : 'h-full'}`}>
        {view === 'HOME' && (
          <>
            <Hero />
            
            {/* Trust Signals */}
            <div className="bg-brand-gray border-y border-zinc-800 py-8">
               <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                     <div className="p-3 bg-brand-black rounded-full text-brand-accent border border-zinc-700">
                       <ShieldCheck size={32} />
                     </div>
                     <div>
                       <h3 className="font-bold text-white">Premium Quality</h3>
                       <p className="text-sm text-gray-400">Museum-grade paper & inks.</p>
                     </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                     <div className="p-3 bg-brand-black rounded-full text-brand-accent border border-zinc-700">
                       <Truck size={32} />
                     </div>
                     <div>
                       <h3 className="font-bold text-white">Fast Delivery</h3>
                       <p className="text-sm text-gray-400">Secure shipping worldwide.</p>
                     </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                     <div className="p-3 bg-brand-black rounded-full text-brand-accent border border-zinc-700">
                       <RefreshCcw size={32} />
                     </div>
                     <div>
                       <h3 className="font-bold text-white">Easy Returns</h3>
                       <p className="text-sm text-gray-400">30-day satisfaction guarantee.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-20">
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                 Featured Collections <span className="h-px flex-grow bg-zinc-800"></span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {FEATURED_COLECTIONS.map((col) => (
                   <div key={col.title} onClick={() => { setFilters(prev => ({ ...prev, category: col.category })); setView('SHOP'); }} className="group relative h-96 rounded-xl overflow-hidden cursor-pointer shadow-2xl border border-zinc-800">
                      <img src={col.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" alt={col.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 p-8 w-full">
                        <h3 className="text-3xl font-bold text-white mb-2">{col.title}</h3>
                        <div className="flex items-center justify-between border-t border-gray-600 pt-4 mt-2">
                           <span className="text-gray-300 text-sm">View Collection</span>
                           <span className="text-brand-accent bg-brand-accent/10 p-2 rounded-full transform translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                             <ArrowRight size={20} />
                           </span>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
            
            <div className="bg-brand-gray/30 py-20 border-t border-zinc-800">
               <div className="max-w-7xl mx-auto px-4">
                  <div className="flex items-center justify-between mb-12">
                     <h2 className="text-3xl font-bold">Trending Now</h2>
                     <Button variant="outline" onClick={() => setView('SHOP')} className="text-sm">View All</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                     {products.slice(0, 8).map(p => (
                       <PosterCard key={p._id} product={p} onAddToCart={(p) => handleAddToCart(p)} onViewDetails={(p) => { setSelectedProduct(p); setView('PRODUCT_DETAILS'); }} />
                     ))}
                  </div>
               </div>
            </div>
          </>
        )}

        {view === 'SHOP' && (
          <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
               {/* Filters Sidebar */}
               <div className="w-full md:w-64 flex-shrink-0 space-y-8">
                  <div className="bg-brand-gray p-6 rounded-lg border border-zinc-800">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Filter size={18}/> Categories</h3>
                    <div className="space-y-2">
                       <button onClick={() => setFilters(prev => ({...prev, category: 'All'}))} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filters.category === 'All' ? 'bg-brand-accent text-brand-black font-bold' : 'text-gray-400 hover:text-white hover:bg-zinc-700'}`}>All Posters</button>
                       {CATEGORIES.map(cat => (
                         <button key={cat} onClick={() => setFilters(prev => ({...prev, category: cat}))} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filters.category === cat ? 'bg-brand-accent text-brand-black font-bold' : 'text-gray-400 hover:text-white hover:bg-zinc-700'}`}>{cat}</button>
                       ))}
                    </div>
                  </div>
                  <div className="bg-brand-gray p-6 rounded-lg border border-zinc-800">
                     <h3 className="font-bold text-lg mb-4">Price Range</h3>
                     <input 
                       type="range" 
                       min="0" 
                       max="10000" 
                       value={filters.maxPrice} 
                       onChange={(e) => setFilters(prev => ({...prev, maxPrice: Number(e.target.value)}))}
                       className="w-full accent-brand-accent h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                     />
                     <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>₹0</span>
                        <span>Max: ₹{filters.maxPrice}</span>
                     </div>
                  </div>
               </div>
               
               {/* Product Grid */}
               <div className="flex-1">
                  <div className="mb-6 flex justify-between items-center">
                     <h1 className="text-3xl font-bold tracking-tight">{filters.category} Collection</h1>
                     <span className="text-gray-400 text-sm">{filteredProducts.length} results found</span>
                  </div>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {filteredProducts.map(p => (
                         <PosterCard key={p._id} product={p} onAddToCart={(p) => handleAddToCart(p)} onViewDetails={(p) => { setSelectedProduct(p); setView('PRODUCT_DETAILS'); }} />
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-32 bg-brand-gray/30 rounded-lg border border-dashed border-zinc-700">
                       <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-500">
                         <Search size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-white mb-2">No posters found</h3>
                       <p className="text-gray-400 mb-6 max-w-sm mx-auto">We couldn't find any art matching your current filters. Try adjusting your search or category.</p>
                       <Button onClick={() => setFilters({ category: 'All', minPrice: 0, maxPrice: 10000, search: '' })} variant="outline">Clear Filters</Button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {view === 'PRODUCT_DETAILS' && selectedProduct && <ProductDetails key={selectedProduct._id} product={selectedProduct} />}
        {view === 'CHECKOUT' && <Checkout />}
        {view === 'LOGIN' && <AuthPage type="LOGIN" />}
        {view === 'REGISTER' && <AuthPage type="REGISTER" />}
      </main>

      {view !== 'LOGIN' && view !== 'REGISTER' && (
        <footer className="bg-brand-gray border-t border-zinc-800 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
             <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tighter text-white">TRIZO<span className="text-brand-accent">VERZE</span></h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Elevating spaces with curated art since 2024. We believe walls should talk, and our posters are the conversation starters.
                </p>
                <div className="flex gap-4 text-gray-400">
                  {/* Social placeholders */}
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-brand-accent hover:text-black cursor-pointer transition">IG</div>
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-brand-accent hover:text-black cursor-pointer transition">TW</div>
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-brand-accent hover:text-black cursor-pointer transition">FB</div>
                </div>
             </div>
             <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Shop</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                   <li className="hover:text-brand-accent cursor-pointer transition">New Arrivals</li>
                   <li className="hover:text-brand-accent cursor-pointer transition">Best Sellers</li>
                   <li className="hover:text-brand-accent cursor-pointer transition">Collections</li>
                   <li className="hover:text-brand-accent cursor-pointer transition">Gift Cards</li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Support</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                   <li className="hover:text-brand-accent cursor-pointer transition">Help Center</li>
                   <li className="hover:text-brand-accent cursor-pointer transition">Shipping & Returns</li>
                   <li className="hover:text-brand-accent cursor-pointer transition">Order Status</li>
                   <li className="hover:text-brand-accent cursor-pointer transition">Contact Us</li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Stay Connected</h4>
                <div className="flex gap-2 mb-4">
                   <Input placeholder="Enter your email" className="h-10 text-sm bg-zinc-800 border-zinc-700" />
                   <Button className="h-10 px-3"><ArrowRight size={16} /></Button>
                </div>
                <p className="text-xs text-gray-500">Subscribe for exclusive drops and offers.</p>
             </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
             <p>&copy; 2024 Trizoverze. All rights reserved.</p>
             <div className="flex gap-4">
               <span>Privacy Policy</span>
               <span>Terms of Service</span>
               <span>Cookie Policy</span>
             </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;