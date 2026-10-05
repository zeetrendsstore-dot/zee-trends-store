export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  category: string;
  rating: number;
  reviewCount: number;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  inStock: boolean;
  stockCount: number;
  shortDesc: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  images: string[];
  colors?: string[];
  tags: string[];
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  description: string;
  image: string;
  iconName: string;
  badge?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const CATEGORIES: Category[] = [
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    itemCount: 22,
    description: 'Designer polarized sunglasses, titanium cuffs & everyday EDC gear',
    image: '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    iconName: 'Glasses',
    badge: 'Hot',
  },
  {
    id: 'watches',
    name: 'Watches',
    slug: 'watches',
    itemCount: 18,
    description: 'Chronograph, quartz timepieces & premium smart fitness bands',
    image: '/src/assets/images/cat_watches_luxury_1791123096514.jpg',
    iconName: 'Watch',
    badge: 'Luxury',
  },
  {
    id: 'wallets',
    name: 'Wallets',
    slug: 'wallets',
    itemCount: 12,
    description: 'Handcrafted full-grain leather bifold & minimalist RFID cardholders',
    image: '/src/assets/images/cat_leather_wallet_1791123128069.jpg',
    iconName: 'CreditCard',
    badge: 'Trending',
  },
  {
    id: 'beauty-skincare',
    name: 'Beauty & Skincare',
    slug: 'beauty-skincare',
    itemCount: 14,
    description: 'Nourishing serums, facial elixirs & dermatologically inspired beauty care',
    image: '/src/assets/images/cat_skincare_beauty_1791123114694.jpg',
    iconName: 'Sparkles',
    badge: 'Popular',
  },
  {
    id: 'hair-care',
    name: 'Hair Care',
    slug: 'hair-care',
    itemCount: 10,
    description: 'Organic Moroccan argan oils, hair tonics & anti-frizz ceramic stylers',
    image: '/src/assets/images/cat_skincare_beauty_1791123114694.jpg',
    iconName: 'HeartHandshake',
    badge: 'Natural',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    slug: 'kitchen',
    itemCount: 16,
    description: 'Smart food choppers, precision mandolines & oil misters for modern homes',
    image: '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    iconName: 'UtensilsCrossed',
    badge: 'Useful',
  },
  {
    id: 'kids',
    name: 'Kids',
    slug: 'kids',
    itemCount: 15,
    description: 'Eye-friendly LCD drawing tablets, sensory montessori toys & games',
    image: '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    iconName: 'Smile',
    badge: 'Safe',
  },
  {
    id: 'trending',
    name: 'Trending Products',
    slug: 'trending',
    itemCount: 20,
    description: 'Ultrasonic aroma diffusers, electric lint removers & viral everyday essentials',
    image: '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    iconName: 'Zap',
    badge: 'Viral',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'zt-w01',
    title: 'Royal Sovereign Chronograph Gold Mesh Watch',
    slug: 'royal-sovereign-chronograph-gold-mesh-watch',
    price: 3850,
    originalPrice: 5500,
    discountPercent: 30,
    category: 'watches',
    rating: 4.9,
    reviewCount: 42,
    isTrending: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 18,
    shortDesc: 'Precision quartz movement with brushed gold bezel, scratch-resistant mineral glass and breathable stainless mesh strap.',
    description: 'The Royal Sovereign Chronograph blends classical horological elegance with everyday durability. Designed for Pakistani gentlemen who appreciate understated luxury, featuring a brushed 18K gold-tone bezel, water-resistant casing, and an adjustable Milanese mesh band. Packaged in a signature Zee Trends gift box.',
    features: [
      'Japanese Quartz Movement with high precision',
      'Scratch-resistant sapphire-coated mineral crystal',
      '30M Splash & Rain Water Resistance',
      'Adjustable magnetic gold mesh clasp',
      'Presented in branded velvet gift box'
    ],
    specs: {
      'Case Diameter': '42 mm',
      'Case Thickness': '10.5 mm',
      'Strap Material': 'Stainless Steel Milanese Mesh',
      'Movement': 'High Precision Quartz',
      'Water Resistance': '3 ATM / 30m',
      'Warranty': '6 Months Movement Warranty'
    },
    images: [
      '/src/assets/images/cat_watches_luxury_1791123096514.jpg',
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    ],
    colors: ['Champagne Gold', 'Obsidian Black Gold', 'Silver Steel'],
    tags: ['Watches', 'Luxury', 'Gift', 'Men', 'Trending'],
    sku: 'ZT-WTC-0199'
  },
  {
    id: 'zt-b01',
    title: '24K Pure Gold Radiance Botanical Facial Elixir (30ml)',
    slug: '24k-pure-gold-radiance-botanical-facial-elixir',
    price: 2450,
    originalPrice: 3500,
    discountPercent: 30,
    category: 'beauty-skincare',
    rating: 4.9,
    reviewCount: 68,
    isTrending: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 25,
    shortDesc: 'Infused with real 24K gold micro-flakes, cold-pressed rosehip seed oil, and plant squalane for intense dewy skin glow.',
    description: 'Transform your daily skincare ritual with the Zee Trends 24K Pure Gold Radiance Elixir. Formulated specifically to combat dullness caused by harsh weather and urban dust across Pakistan. The featherlight botanical oil absorbs immediately without greasy residue, plumping fine lines and leaving a luminous satin finish.',
    features: [
      'Micro-suspended 24K gold foil particles for radiance',
      'Rich in cold-pressed rosehip, jojoba & vitamin E',
      'Non-comedogenic & suitable for sensitive skin',
      'Paraben-free, cruelty-free, alcohol-free formulation',
      'Dermatologically tested for daily morning & night use'
    ],
    specs: {
      'Volume': '30 ml / 1.0 fl. oz',
      'Packaging': 'Amber UV-protective dropper bottle',
      'Skin Type': 'All skin types (Dry, Combination, Normal)',
      'Origin': 'Formulated with imported active botanicals',
      'Shelf Life': '24 Months'
    },
    images: [
      '/src/assets/images/cat_skincare_beauty_1791123114694.jpg',
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    ],
    colors: ['Amber Gold'],
    tags: ['Beauty', 'Skincare', 'Serum', 'Gold', 'Glow'],
    sku: 'ZT-SKN-24KG'
  },
  {
    id: 'zt-wl01',
    title: 'Handcrafted Vintage Full-Grain Leather RFID Bifold Wallet',
    slug: 'handcrafted-vintage-leather-rfid-bifold-wallet',
    price: 1950,
    originalPrice: 2800,
    discountPercent: 30,
    category: 'wallets',
    rating: 4.8,
    reviewCount: 54,
    isTrending: true,
    inStock: true,
    stockCount: 30,
    shortDesc: 'Crafted from authentic top-tier oil pull-up cowhide leather with integrated military-grade RFID identity theft protection.',
    description: 'A gentleman’s staple engineered to age gracefully. Our full-grain leather wallet develops a rich, unique patina over time. Features 8 card slots, dual full-length Pakistani currency notes compartments (sized perfectly for 500, 1000 & 5000 Rs notes), a quick-access CNIC window, and dual hidden receipt pockets.',
    features: [
      '100% Genuine full-grain oiled leather',
      'Certified RFID blocking layer protects debit/smart cards',
      'Dual deep cash compartments for large Pakistani Rupee bills',
      'Reinforced perimeter saddle stitching with nylon thread',
      'Sleek slim profile fits comfortably in front or back pocket'
    ],
    specs: {
      'Dimensions': '11.5 cm x 9.5 cm x 1.8 cm',
      'Capacity': '8-10 Cards + Cash + CNIC ID',
      'Material': 'Top Grain Buffalo Leather',
      'RFID Shield': '13.56 MHz frequency protection',
      'Box': 'Hardboard matte presentation gift box'
    },
    images: [
      '/src/assets/images/cat_leather_wallet_1791123128069.jpg',
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    ],
    colors: ['Cognac Tan', 'Dark Mocha Brown', 'Midnight Black'],
    tags: ['Wallets', 'Leather', 'Men', 'Accessories', 'RFID'],
    sku: 'ZT-WLT-FG01'
  },
  {
    id: 'zt-ac01',
    title: 'Titanium Edge Polarized UV400 Designer Sunglasses',
    slug: 'titanium-edge-polarized-uv400-designer-sunglasses',
    price: 2199,
    originalPrice: 3200,
    discountPercent: 31,
    category: 'accessories',
    rating: 4.8,
    reviewCount: 37,
    isTrending: true,
    isNew: true,
    inStock: true,
    stockCount: 14,
    shortDesc: 'Ultra-lightweight titanium alloy frame with 9-layer HD polarized lenses eliminating harsh glare during summer drives.',
    description: 'Engineered for exceptional optical clarity and featherlight comfort under the intense Pakistani sun. The Titanium Edge frame balances modern geometric lines with timeless luxury styling. Includes high-clarity polarized TAC lenses that reduce eye fatigue during highway commuting.',
    features: [
      'UV400 100% UVA & UVB radiation protection',
      'Hydrophobic & anti-scratch dual-sided lens coating',
      'Hypoallergenic soft silicone nose pads',
      'Flexible spring hinges for pressure-free all-day wear',
      'Includes hard zip carry case + microfibre polishing cloth'
    ],
    specs: {
      'Frame Width': '142 mm',
      'Lens Width': '58 mm',
      'Bridge Width': '16 mm',
      'Weight': 'Only 21 grams',
      'Frame Material': 'Titanium Alloy + Acetate Temple Tips'
    },
    images: [
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
      '/src/assets/images/cat_watches_luxury_1791123096514.jpg',
    ],
    colors: ['Gold Frame / Emerald Green Lens', 'Black Gunmetal / Polarized Smoke', 'Rose Gold / Gradient Brown'],
    tags: ['Accessories', 'Sunglasses', 'Fashion', 'Summer'],
    sku: 'ZT-ACC-SG44'
  },
  {
    id: 'zt-hc01',
    title: 'Moroccan Argan & Rosemary Root Stimulating Hair Elixir (100ml)',
    slug: 'moroccan-argan-rosemary-hair-elixir',
    price: 1850,
    originalPrice: 2600,
    discountPercent: 29,
    category: 'hair-care',
    rating: 4.9,
    reviewCount: 83,
    isTrending: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 40,
    shortDesc: 'Infused with cold-pressed Moroccan argan oil, pure rosemary essential extract, and biotin for thick, frizz-free hair.',
    description: 'Say goodbye to dry brittle ends and post-monsoon hair fall. Our nutrient-dense organic blend penetrates deep into hair follicles, stimulating circulation and sealing the hair cuticle with glossy sheen. Perfect for both men and women desiring fuller, manageable hair.',
    features: [
      'Cold-pressed 100% pure Moroccan Argan oil base',
      'Concentrated rosemary oil proven to promote hair density',
      'Enriched with Biotin, Castor oil & Almond extract',
      'Controls severe frizz and repairs heat styling damage',
      'Lightweight pleasant natural herbal aroma'
    ],
    specs: {
      'Net Content': '100 ml / 3.4 fl. oz',
      'Form': 'Lightweight non-sticky hair oil',
      'Suitable For': 'Hair fall control, Dandruff relief, Split ends',
      'Application': '2-3 drops daily or 30-min scalp massage mask'
    },
    images: [
      '/src/assets/images/cat_skincare_beauty_1791123114694.jpg',
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    ],
    tags: ['Hair Care', 'Oil', 'Rosemary', 'Argan', 'Trending'],
    sku: 'ZT-HRC-ROSE10'
  },
  {
    id: 'zt-kt01',
    title: 'Electric Rechargeable Wireless Mini Garlic & Food Chopper',
    slug: 'electric-rechargeable-wireless-mini-food-chopper',
    price: 1699,
    originalPrice: 2500,
    discountPercent: 32,
    category: 'kitchen',
    rating: 4.7,
    reviewCount: 92,
    isTrending: true,
    inStock: true,
    stockCount: 35,
    shortDesc: 'One-touch wireless USB chopping for garlic, onions, ginger, green chilies, nuts, and baby puree in 10 seconds flat.',
    description: 'A revolutionary time-saver for Pakistani home cooks. No more tearing eyes while mincing onions or tedious garlic crushing. Powered by a high-torque rechargeable copper motor and surgical-grade 3-blade stainless steel assembly. Fully cordless with waterproof washability.',
    features: [
      'Wireless Type-C USB rechargeable (lasts 30+ chops per charge)',
      'Food-grade BPA-free transparent 250ml cup',
      'Reinforced S-shaped 304 stainless steel tri-blades',
      'Magnetic safety lock prevents accidental startup',
      '100% Waterproof - rinses completely under running tap water'
    ],
    specs: {
      'Capacity': '250 ml',
      'Battery': '1200 mAh Lithium-ion',
      'Motor Speed': '18,000 RPM',
      'Blade Material': 'Food Grade 304 Stainless Steel',
      'Charging Time': '2 Hours'
    },
    images: [
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
      '/src/assets/images/cat_watches_luxury_1791123096514.jpg',
    ],
    colors: ['White Pearl', 'Emerald Kitchen Green', 'Blush Pink'],
    tags: ['Kitchen', 'Gadgets', 'Home', 'Useful'],
    sku: 'ZT-KTC-CHOP25'
  },
  {
    id: 'zt-kd01',
    title: 'Eye-Care 10.5-Inch LCD Digital Doodle & Drawing Tablet',
    slug: 'eye-care-lcd-digital-doodle-drawing-tablet',
    price: 1450,
    originalPrice: 2200,
    discountPercent: 34,
    category: 'kids',
    rating: 4.8,
    reviewCount: 47,
    isNew: true,
    inStock: true,
    stockCount: 22,
    shortDesc: 'Radiation-free, zero-blue-light pressure-sensitive drawing board with instant one-key erase lock for creative kids.',
    description: 'Keep your children creatively engaged without harmful screen time, smartphone addiction, or messy wall drawings! This paper-feel LCD board allows smooth writing, sketch practice, Urdu and English calligraphy, and math calculations with instant erase capability.',
    features: [
      'No radiation, no glare, zero blue light eye protection',
      'One-button instant screen clearing mechanism',
      'Anti-erase lock switch preserves kids masterpieces',
      'Ultra-durable shatterproof ABS frame built for toddler drops',
      'Replaceable coin battery provides up to 50,000 screen erases'
    ],
    specs: {
      'Screen Size': '10.5 Inches diagonal',
      'Weight': '160 grams (featherlight for small hands)',
      'Stylus': 'Comfort grip ergonomic stylus included',
      'Battery': 'CR2025 button battery pre-installed'
    },
    images: [
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
      '/src/assets/images/cat_leather_wallet_1791123128069.jpg',
    ],
    colors: ['Sky Blue', 'Pastel Pink', 'Cyber Black'],
    tags: ['Kids', 'Learning', 'Toys', 'Tablet'],
    sku: 'ZT-KID-LCD10'
  },
  {
    id: 'zt-ev01',
    title: 'Ultrasonic Flame Ambient Aroma Diffuser & Air Humidifier',
    slug: 'ultrasonic-flame-ambient-aroma-diffuser-humidifier',
    price: 2799,
    originalPrice: 3999,
    discountPercent: 30,
    category: 'trending',
    rating: 4.9,
    reviewCount: 61,
    isTrending: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 19,
    shortDesc: 'Mesmerizing hyper-realistic warm flame mist lighting combined with silent ultrasonic aromatherapy diffusion.',
    description: 'Transform your bedroom or drawing room atmosphere into a calming sanctuary. Utilizing smart LED light bars and high-frequency ultrasonic nano-mist, it creates the illusion of real flickering golden flames. Add your favorite bakhoor, lavender or eucalyptus essential oils to fill your home with fragrance while soothing dry air.',
    features: [
      'Realistic dual-mode flame light effect (Soft Amber & Deep Gold)',
      'Whisper-quiet operation (<25dB) for sound sleep',
      'Intelligent waterless auto shut-off protection',
      'Relieves dry skin, sinuses, and AC room dehydration',
      'Type-C USB powered - compatible with any phone charger or powerbank'
    ],
    specs: {
      'Water Tank': '200 ml',
      'Mist Output': '20-30 ml/hour',
      'Power': '5V 2A Type-C input',
      'Coverage': '20-30 sq. meters bedroom or office'
    },
    images: [
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
      '/src/assets/images/cat_skincare_beauty_1791123114694.jpg',
    ],
    colors: ['Matte White / Gold', 'Obsidian Black / Gold'],
    tags: ['Trending', 'Home Decor', 'Diffuser', 'Useful'],
    sku: 'ZT-EVR-FLAME01'
  },
  {
    id: 'zt-w02',
    title: 'Midnight Onyx Minimalist Gold Accent Quartz Watch',
    slug: 'midnight-onyx-minimalist-gold-accent-quartz-watch',
    price: 3200,
    originalPrice: 4600,
    discountPercent: 30,
    category: 'watches',
    rating: 4.8,
    reviewCount: 31,
    isNew: true,
    inStock: true,
    stockCount: 16,
    shortDesc: 'Sunray dial with slim baton hands, matte black IP plated casing, and genuine cowhide leather wristband.',
    description: 'Modern minimalism refined. The Midnight Onyx strips away all visual clutter, spotlighting razor-sharp golden hour markers over a deep obsidian sunray dial. An effortless statement piece from business meetings in Blue Area Islamabad to evening dinners in Clifton Karachi.',
    features: [
      'Ultra-thin 8.2mm profile slips easily beneath shirt cuffs',
      'Precision Japanese three-hand quartz movement',
      'Premium dark brown and black full-grain leather strap',
      'Water resistant against hand washing and rain splashes'
    ],
    specs: {
      'Case Diameter': '40 mm',
      'Case Thickness': '8.2 mm',
      'Strap Width': '20 mm',
      'Glass': 'Hardened mineral crystal'
    },
    images: [
      '/src/assets/images/cat_watches_luxury_1791123096514.jpg',
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    ],
    colors: ['Matte Black / Gold Markers', 'All Black'],
    tags: ['Watches', 'Minimalist', 'Men', 'Trending'],
    sku: 'ZT-WTC-ONYX02'
  },
  {
    id: 'zt-wl02',
    title: 'Slim Carbon Fiber Pop-Up RFID Anti-Theft Cardholder',
    slug: 'slim-carbon-fiber-pop-up-rfid-cardholder',
    price: 1599,
    originalPrice: 2400,
    discountPercent: 33,
    category: 'wallets',
    rating: 4.9,
    reviewCount: 76,
    isTrending: true,
    inStock: true,
    stockCount: 28,
    shortDesc: 'Patented side-trigger mechanism fans out your cards tiered for instant one-handed access with carbon fiber exterior.',
    description: 'Ditch bulky old wallets forever. With one flick of the bottom ergonomic lever, 6 of your most important cards fan out smoothly. Built with aircraft-grade aluminum shell wrapped in aerospace carbon fiber texture and an external elastic cash strap for Pakistani currency bills.',
    features: [
      'Quick-draw slider trigger ejects cards in smooth hierarchy',
      'Full Faraday RFID blocking stops digital contactless pickpocketing',
      'High-elasticity silicone money band holds folded bank notes',
      'Ultra-compact design 3x thinner than traditional wallets'
    ],
    specs: {
      'Dimensions': '10 cm x 6.3 cm x 1.2 cm',
      'Card Capacity': '6-7 Cards inside aluminum chamber + 2 outside',
      'Material': 'Aviation Aluminum + 3K Carbon Fiber Finish'
    },
    images: [
      '/src/assets/images/cat_leather_wallet_1791123128069.jpg',
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    ],
    colors: ['Carbon Stealth Black', 'Brushed Champagne Gold', 'Navy Blue'],
    tags: ['Wallets', 'Cardholder', 'EDC', 'Smart'],
    sku: 'ZT-WLT-CRB02'
  },
  {
    id: 'zt-b02',
    title: 'Natural Jade Stone Facial Roller & Sculpting Gua Sha Set',
    slug: 'natural-jade-stone-facial-roller-gua-sha-set',
    price: 1350,
    originalPrice: 2000,
    discountPercent: 32,
    category: 'beauty-skincare',
    rating: 4.8,
    reviewCount: 52,
    inStock: true,
    stockCount: 20,
    shortDesc: 'Authentic 100% natural Xiuyan green jade with silent reinforced brass frame for lymphatic drainage and jawline sculpting.',
    description: 'An ancient self-care tool crafted for modern beauty routines. Cool to the touch, natural jade reduces morning facial puffiness, accelerates lymphatic drainage, sculpts cheekbones, and boosts absorption of face serums and night creams.',
    features: [
      '100% Natural certified Xiuyan jade stone',
      'Reinforced welded gold alloy frame with noise-free silicone buffer',
      'Dual-ended roller for cheeks and delicate under-eye zones',
      'Heart-shaped Gua Sha stone for chin and neck contouring',
      'Presented in satin-lined gift storage box'
    ],
    specs: {
      'Roller Length': '14.5 cm',
      'Material': 'Grade A Natural Jade + Gold-tone alloy',
      'Maintenance': 'Wash with gentle soap and pat dry'
    },
    images: [
      '/src/assets/images/cat_skincare_beauty_1791123114694.jpg',
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
    ],
    tags: ['Beauty', 'Skincare', 'Gua Sha', 'Jade', 'Wellness'],
    sku: 'ZT-SKN-JADE03'
  },
  {
    id: 'zt-ev02',
    title: 'High-Torque 6-Blade Rechargeable Electric Fabric Lint Remover',
    slug: 'high-torque-rechargeable-electric-lint-remover',
    price: 1750,
    originalPrice: 2500,
    discountPercent: 30,
    category: 'trending',
    rating: 4.9,
    reviewCount: 88,
    isTrending: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 32,
    shortDesc: 'Instantly restores winter woolens, sweaters, shawls, and sofa fabric like brand new with honeycomb stainless mesh protection.',
    description: 'Keep your winter shawls, woolen sweaters, blazers, and bed linen looking pristine. Equipped with an upgraded 6-leaf stainless blade and 9000 RPM motor, it swiftly shaves off lint fuzz and pilling without snagging delicate threads.',
    features: [
      'Heavy-duty 6-leaf rotary stainless blades',
      '3-hole micro-arc honeycomb mesh protects delicate fabrics',
      'Large detachable clear lint reservoir with easy emptying',
      'Safety auto-stop if mesh cover is loosened or removed',
      'Long-lasting USB rechargeable battery'
    ],
    specs: {
      'Motor': '9,000 RPM high power',
      'Charging': 'USB 5V universal port',
      'Blades': 'Includes 2 replacement blade heads'
    },
    images: [
      '/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg',
      '/src/assets/images/cat_leather_wallet_1791123128069.jpg',
    ],
    colors: ['Emerald Gold', 'Pearl White Gold'],
    tags: ['Everyday Useful', 'Winter', 'Clothes', 'Gadgets'],
    sku: 'ZT-EVR-LINT06'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'zt-w01',
    author: 'Hamza Tariq',
    city: 'Lahore (DHA)',
    rating: 5,
    date: '3 days ago',
    comment: 'SubhanAllah, the watch quality is beyond what I expected for this price! The gold finish is very classy and not tacky at all. Received in Lahore in just 2 days via Cash on Delivery.',
    verified: true
  },
  {
    id: 'rev-02',
    productId: 'zt-b01',
    author: 'Ayesha Siddiqui',
    city: 'Karachi (Gulshan)',
    rating: 5,
    date: '1 week ago',
    comment: 'The 24K gold serum gives such a soft dewy glow without any stickiness under makeup. Even my dermatologist friend was impressed with the ingredients list. Ordering another for my sister!',
    verified: true
  },
  {
    id: 'rev-03',
    productId: 'zt-wl01',
    author: 'Bilal Khan',
    city: 'Islamabad (F-10)',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Genuine cowhide leather, smells authentic and the stitching is top notch. Pakistani 5000 and 1000 notes fit perfectly without folding corners. Highly recommended store!',
    verified: true
  },
  {
    id: 'rev-04',
    productId: 'zt-kt01',
    author: 'Zainab Murtaza',
    city: 'Faisalabad',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Every Pakistani kitchen needs this electric chopper! Chopped ginger, garlic and sabz mirch in 10 seconds. Cordless feature makes it so convenient to clean.',
    verified: true
  },
  {
    id: 'rev-05',
    productId: 'zt-ev01',
    author: 'Dr. Usman Farooq',
    city: 'Rawalpindi',
    rating: 5,
    date: '4 days ago',
    comment: 'The flame effect in a dark room is hypnotic and looks super luxurious on my side table. Fast WhatsApp customer support when I asked about delivery.',
    verified: true
  }
];

export const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Sukkur',
  'Jhelum',
  'Rahim Yar Khan',
  'Wah Cantt',
  'Mardan',
  'Mirpur AJK',
  'Muzaffarabad',
  'Sahiwal',
  'Sheikhupura',
  'Okara',
  'Other City / Town'
];

export const PAKISTANI_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa (KPK)',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir (AJK)',
  'Gilgit-Baltistan'
];

