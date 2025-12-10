import { Product } from './types';

export const CATEGORIES = [
  'Abstract', 
  'Minimalist', 
  'Typography', 
  'Photography', 
  'Surrealism', 
  'Nature',
  'Automotive',
  'Anime',
  'Gaming',
  'Movies'
];

export const POSTER_SIZES = [
  { label: 'Small (12"x18")', value: '12x18"', multiplier: 1 },
  { label: 'Medium (18"x24")', value: '18x24"', multiplier: 1.5 },
  { label: 'Large (24"x36")', value: '24x36"', multiplier: 2 },
];

// Helper to generate consistent images based on keywords using loremflickr
// We use the product ID to lock the image so it doesn't change on re-renders
const getImageUrl = (id: string, keywords: string) => 
  `https://loremflickr.com/800/1000/${keywords}?lock=${id}`;

export const DUMMY_PRODUCTS: Product[] = [
  // Photography / Cyberpunk
  {
    _id: '1',
    title: 'Neon Tokyo Nights',
    description: 'A vibrant cyberpunk depiction of Tokyo streets at night, illuminated by neon signs and rain-slicked roads.',
    price: 1999,
    discount: 10,
    category: 'Photography',
    imageURL: getImageUrl('1', 'tokyo,neon,night'),
    stock: 50,
    tags: ['cyberpunk', 'city', 'night', 'neon', 'blue']
  },
  {
    _id: '8',
    title: 'Urban Decay',
    description: 'Gritty street photography showcasing the beauty in abandoned structures.',
    price: 1699,
    discount: 20,
    category: 'Photography',
    imageURL: getImageUrl('8', 'abandoned,building'),
    stock: 42,
    tags: ['street', 'abandoned', 'gritty', 'city']
  },

  // Abstract / Minimalist / Typography
  {
    _id: '2',
    title: 'Geometric Harmony',
    description: 'Mid-century modern geometric shapes interacting in a balanced composition of earth tones.',
    price: 1499,
    discount: 0,
    category: 'Abstract',
    imageURL: getImageUrl('2', 'geometric,abstract,art'),
    stock: 20,
    tags: ['shapes', 'warm', 'modern', 'orange']
  },
  {
    _id: '7',
    title: 'Fluid Motion',
    description: 'Abstract liquid acrylic pour painting with gold leaf accents.',
    price: 3499,
    discount: 0,
    category: 'Abstract',
    imageURL: getImageUrl('7', 'fluid,paint,art'),
    stock: 5,
    tags: ['paint', 'gold', 'fluid', 'luxury']
  },
  {
    _id: '3',
    title: 'Serenity Now',
    description: 'A calming minimalist shot of a lone tree in a foggy field. Perfect for meditation spaces.',
    price: 2499,
    discount: 0,
    category: 'Minimalist',
    imageURL: getImageUrl('3', 'fog,tree,minimal'),
    stock: 15,
    tags: ['fog', 'tree', 'calm', 'bw']
  },
  {
    _id: '4',
    title: 'Helvetica Bold',
    description: 'Classic typography poster celebrating the Swiss design movement. Stark contrast and clean lines.',
    price: 1299,
    discount: 5,
    category: 'Typography',
    imageURL: getImageUrl('4', 'typography,design,text'),
    stock: 100,
    tags: ['text', 'design', 'swiss', 'black']
  },

  // Surrealism / Nature
  {
    _id: '5',
    title: 'The Dreamer',
    description: 'Surrealist collage art featuring floating islands and giant fish in the sky.',
    price: 2799,
    discount: 15,
    category: 'Surrealism',
    imageURL: getImageUrl('5', 'surreal,fantasy,sky'),
    stock: 8,
    tags: ['dream', 'fantasy', 'collage', 'purple']
  },
  {
    _id: '6',
    title: 'Mountain Mist',
    description: 'High contrast photography of the Rocky Mountains during a storm.',
    price: 1799,
    discount: 0,
    category: 'Nature',
    imageURL: getImageUrl('6', 'mountain,storm,nature'),
    stock: 33,
    tags: ['mountain', 'nature', 'landscape', 'dramatic']
  },

  // Automotive (BMW, etc.)
  {
    _id: '9',
    title: 'M4 Competition',
    description: 'The aggressive stance of the M4 Competition, captured in a dark studio environment.',
    price: 2299,
    discount: 0,
    category: 'Automotive',
    imageURL: getImageUrl('9', 'bmw,car,sportscar'),
    stock: 12,
    tags: ['bmw', 'car', 'german', 'speed']
  },
  {
    _id: '10',
    title: '911 Classic',
    description: 'Vintage air-cooled perfection. A tribute to the timeless silhouette of the 911.',
    price: 2599,
    discount: 5,
    category: 'Automotive',
    imageURL: getImageUrl('10', 'porsche,classic,car'),
    stock: 8,
    tags: ['porsche', 'classic', 'vintage', 'car']
  },
  {
    _id: '11',
    title: 'Godzilla R34',
    description: 'The legendary JDM icon drifting through the neon-lit streets of Tokyo.',
    price: 2199,
    discount: 10,
    category: 'Automotive',
    imageURL: getImageUrl('11', 'skyline,nissan,drift'),
    stock: 25,
    tags: ['jdm', 'nissan', 'drift', 'car']
  },
  {
    _id: '12',
    title: 'Italian Stallion',
    description: 'A close-up of the aggressive lines of a modern Italian supercar in yellow.',
    price: 2899,
    discount: 0,
    category: 'Automotive',
    imageURL: getImageUrl('12', 'lamborghini,supercar'),
    stock: 5,
    tags: ['lamborghini', 'supercar', 'luxury', 'yellow']
  },

  // Anime
  {
    _id: '13',
    title: 'Spirit Realm',
    description: 'A magical bathhouse standing tall against the twilight sky.',
    price: 1899,
    discount: 15,
    category: 'Anime',
    imageURL: getImageUrl('13', 'anime,scenery,fantasy'),
    stock: 60,
    tags: ['ghibli', 'fantasy', 'anime', 'scenic']
  },
  {
    _id: '14',
    title: 'The Pirate King',
    description: 'Joyboy returns. A vibrant poster capturing the liberation warrior in action.',
    price: 1999,
    discount: 0,
    category: 'Anime',
    imageURL: getImageUrl('14', 'anime,manga,character'),
    stock: 100,
    tags: ['onepiece', 'shonen', 'anime', 'action']
  },
  {
    _id: '15',
    title: 'Flame Breathing',
    description: 'Set your heart ablaze. A dynamic portrait of the Flame Hashira.',
    price: 1999,
    discount: 0,
    category: 'Anime',
    imageURL: getImageUrl('15', 'samurai,anime,fire'),
    stock: 45,
    tags: ['demonslayer', 'anime', 'fire', 'action']
  },
  {
    _id: '16',
    title: 'Neo-Tokyo Bike',
    description: 'The iconic red motorcycle sliding to a halt in a cyberpunk wasteland.',
    price: 2199,
    discount: 5,
    category: 'Anime',
    imageURL: getImageUrl('16', 'cyberpunk,anime,motorcycle'),
    stock: 30,
    tags: ['akira', 'cyberpunk', 'anime', 'retro']
  },

  // Gaming
  {
    _id: '17',
    title: 'The Erdtree',
    description: 'The golden light of the Erdtree shining over the Lands Between.',
    price: 2499,
    discount: 0,
    category: 'Gaming',
    imageURL: getImageUrl('17', 'fantasy,castle,dragon'),
    stock: 55,
    tags: ['eldenring', 'fantasy', 'gaming', 'gold']
  },
  {
    _id: '18',
    title: 'Spartan Father',
    description: 'A gritty portrait of the Ghost of Sparta in the Norse realms.',
    price: 2299,
    discount: 10,
    category: 'Gaming',
    imageURL: getImageUrl('18', 'viking,warrior,fantasy'),
    stock: 40,
    tags: ['godofwar', 'gaming', 'action', 'playstation']
  },

  // Movies
  {
    _id: '19',
    title: 'The Dark Knight',
    description: 'The silent guardian watching over Gotham City in the rain.',
    price: 1899,
    discount: 0,
    category: 'Movies',
    imageURL: getImageUrl('19', 'batman,superhero,dark'),
    stock: 75,
    tags: ['batman', 'dc', 'movie', 'hero']
  },
  {
    _id: '20',
    title: 'Interstellar',
    description: 'A journey beyond the stars. The Endurance ship against a black hole.',
    price: 2399,
    discount: 0,
    category: 'Movies',
    imageURL: getImageUrl('20', 'space,galaxy,star'),
    stock: 25,
    tags: ['space', 'scifi', 'movie', 'nolan']
  }
];