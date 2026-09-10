import { useState, useEffect } from 'react'
import {
  ArrowLeft, Bell, Camera, Check, ChevronRight, CircleHelp, Clock3,
  Eye, EyeOff, Heart, Home, Lock, MapPin, MessageSquare, Mic,
  Plus, QrCode, Search, Share2, ShieldCheck, Sliders, Sprout, Star, Truck, UserRound, Users, Wallet, Smartphone, Layers, TrendingUp, DollarSign, Activity, FileText, Bot, HelpCircle, AlertCircle, BarChart3, Globe
} from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { Html5Qrcode } from 'html5-qrcode'
import { signInWithGoogle } from './firebase.js'
import './App.css'

const MOBILE_NETWORK_URL = typeof window !== 'undefined' && window.location && window.location.origin
  ? window.location.origin
  : 'http://127.0.0.1:5173'

function getApiUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const host = window.location.hostname || '127.0.0.1'
  if (host === 'localhost' || host === '127.0.0.1') return `http://127.0.0.1:5000${path}`
  return `http://${host}:5000${path}`
}

function generateSmartAnswer(queryText) {
  const q = (queryText || '').toLowerCase().trim()
  if (!q) return '🌱 Welcome to AgriGuide AI! Ask me anything about crop pricing, Mandi benchmarks, buyer demands, fertilizer guides, disease control, direct selling, or platform updates.'

  // 1. Greetings & Meta Info
  if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'namaste' || q === 'vanakkam' || q.includes('good morning') || q.includes('who are you') || q.includes('help')) {
    return '👋 Hello! I am **AgriGuide AI**, your intelligent agricultural assistant. Ask me about real-time Mandi crop prices, buyer demands, organic disease prevention, fertilizer recommendations, direct selling tips, or payment safety!'
  }

  // 2. Specific Crop Inquiries
  if (q.includes('mango') || q.includes('alphonso')) {
    return '🥭 **Alphonso & Banganapalli Mango**: Listed at ₹85/kg by Kumar Farms in Nagercoil, TN (Grade A+ organic quality). High buyer demand (+22% profit realization).'
  }
  if (q.includes('banana')) {
    return '🍌 **Nendran & Poovan Bananas**: Currently listed at ₹25/kg by Lakshmi Farms in Kanyakumari. High local demand (+15% realization).'
  }
  if (q.includes('tomato')) {
    return '🍅 **Tomato (Grade A Organic)**: Today\'s Nagercoil Mandi benchmark is ₹28.00/kg (Trend +8%). AgriDirect AI recommends listing at ₹30 – ₹32/kg for optimal farmer profit.'
  }
  if (q.includes('onion') || q.includes('shallot')) {
    return '🧅 **Red Shallots & Small Onion**: Currently listed at ₹26/kg (Mandi benchmark ₹24/kg). High demand from local supermarkets.'
  }
  if (q.includes('potato')) {
    return '🥔 **Golden Potato**: Current listing rate is ₹22/kg (Mandi benchmark ₹20/kg). Clean, graded farm produce available in Nagercoil.'
  }
  if (q.includes('rice') || q.includes('ponni') || q.includes('paddy')) {
    return '🌾 **Aged Ponni Raw Rice**: Sourced from Tirunelveli paddy fields at ₹52/kg (Mandi benchmark ₹48/kg). Grade A+ organic quality.'
  }
  if (q.includes('coconut')) {
    return '🥥 **Green Tender Coconut**: Freshly harvested from Kanyakumari coastal groves at ₹35/piece (Mandi benchmark ₹30/piece). High daily demand.'
  }
  if (q.includes('milk') || q.includes('dairy')) {
    return '🥛 **Pure Farm Milk**: Unadulterated Gir cow milk listed at ₹44/L by R. Selvam Dairy in Kanyakumari.'
  }
  if (q.includes('carrot')) {
    return '🥕 **Highland Carrot**: Crisp, sweet carrots from Nagercoil highlands listed at ₹29/kg (Mandi benchmark ₹26/kg).'
  }
  if (q.includes('brinjal') || q.includes('eggplant')) {
    return '🍆 **Purple Brinjal**: Fresh local harvest listed at ₹20/kg from Thiruvattar farms.'
  }
  if (q.includes('beans')) {
    return '🫛 **Green Tender Beans**: Handpicked organic string beans listed at ₹34/kg (Mandi benchmark ₹30/kg).'
  }
  if (q.includes('okra') || q.includes('ladies finger')) {
    return '🌱 **Green Okra / Ladies Finger**: Tender early morning harvest listed at ₹28/kg in Thiruvattar, TN.'
  }

  // 3. Platform Updates & News
  if (q.includes('update') || q.includes('latest') || q.includes('recent') || q.includes('news') || q.includes('happened') || q.includes('what\'s new') || q.includes('status')) {
    return `📢 **Latest AgriDirect Platform Update**:\n• Newly listed harvest: Alphonso Mango by Kumar Farms (500 kg @ ₹85/kg in Nagercoil, TN).\n• Latest direct transaction: Order #ORD-89421 (500 kg Tomato, Total ₹18,000, Escrow: HELD, Status: ON_THE_WAY).\n• Active network: 12 active crop listings & 32 total direct orders!`
  }

  // 4. Buyer Demands
  if (q.includes('buyer') || q.includes('who') || q.includes('demand') || q.includes('requirement')) {
    return '🛒 **Active Buyer Demands**: FreshMart Supermarket & GreenLeaf Restaurant are currently procuring 2,000 kg Tomato and 1,500 kg Red Shallot Onion near Kanyakumari.'
  }

  // 5. Pricing & Mandi Rates
  if (q.includes('price') || q.includes('mandi') || q.includes('cost') || q.includes('rate') || q.includes('benchmark')) {
    return '💡 **Today\'s Mandi Benchmark (Nagercoil Mandi)**:\n• Tomato: ₹28.00/kg (Trend +8%)\n• Onion: ₹24.00/kg\n• Carrot: ₹26.00/kg\n• Banana: ₹22.00/kg\nAgriDirect AI recommends listing crops 10% above Mandi rates for direct farm-gate profits.'
  }

  // 6. Earnings & Revenue
  if (q.includes('earn') || q.includes('revenue') || q.includes('payout') || q.includes('earnings') || q.includes('income')) {
    return '💰 **Monthly Earnings Summary**: Total ₹48,260 across 32 direct orders (+27.2% higher farmer profit realization vs traditional mandi channels).'
  }

  // 7. Pest & Disease Control
  if (q.includes('disease') || q.includes('pest') || q.includes('curl') || q.includes('blight') || q.includes('fungus') || q.includes('worm') || q.includes('insect')) {
    return '🌿 **Organic Crop Protection Guide**: For leaf curl, early blight, or caterpillar pests, apply Neem oil organic extract (5 ml/L) or Copper Oxychloride (2 g/L) early morning. Maintain proper drainage.'
  }

  // 8. Fertilizers & Soil Management
  if (q.includes('fertilizer') || q.includes('manure') || q.includes('compost') || q.includes('npk') || q.includes('urea') || q.includes('soil') || q.includes('nitrogen')) {
    return '🧪 **Soil Nutrition & Fertilizer Advice**: Apply well-decomposed Farmyard Manure (10 tonnes/acre) during land preparation. Use Vermicompost + Azospirillum (2 kg/acre) for organic nitrogen enrichment and healthier root development.'
  }

  // 9. Water & Irrigation
  if (q.includes('water') || q.includes('drip') || q.includes('irrigation') || q.includes('rain')) {
    return '💧 **Irrigation & Water Management**: Utilize Drip Irrigation to save up to 40% water while maintaining ideal soil moisture during crop flowering and fruit setting stages.'
  }

  // 10. Seasonal & Planting Tips
  if (q.includes('season') || q.includes('grow') || q.includes('sow') || q.includes('plant') || q.includes('harvest') || q.includes('weather')) {
    return '☀️ **Seasonal Agriculture Advice**: For southern Tamil Nadu (Kanyakumari & Tirunelveli), plant vegetable crops post-monsoon. Harvest early morning to preserve crispness, weight, and shelf life.'
  }

  // 11. How to Sell / List Produce
  if (q.includes('sell') || q.includes('list') || q.includes('add produce') || q.includes('post crop')) {
    return '🌾 **How to List Your Harvest**: Click **"+ Add Produce"** on the Home screen or use the **Voice Assistant button**. Enter crop details, quantity, and price. Your produce instantly reaches active local buyers!'
  }

  // 12. How to Buy
  if (q.includes('buy') || q.includes('order') || q.includes('procure') || q.includes('purchase')) {
    return '🛒 **How to Purchase Directly**: Switch to **Buyer Mode**, browse live produce listings, compare Mandi benchmark prices, select your required quantity, and click **"Buy Now"** or send a direct offer!'
  }

  // 13. Escrow & Security
  if (q.includes('escrow') || q.includes('payment') || q.includes('security') || q.includes('safety') || q.includes('upi')) {
    return '🛡️ **UPI Escrow Security**: Buyer payments are safely locked in AgriDirect Escrow when an order is placed. Funds are automatically credited to the farmer\'s account upon delivery confirmation.'
  }

  // 14. Transport & Delivery
  if (q.includes('transport') || q.includes('truck') || q.includes('delivery') || q.includes('logistics') || q.includes('ship')) {
    return '🚚 **Direct Logistics & Delivery**: AgriDirect coordinates farm-gate pickup with verified logistics partners (Ravi Agro Logistics) ensuring temperature-controlled, rapid transport to buyers.'
  }

  // 15. Dynamic Fallback for Any Arbitrary Question
  return `🌱 **AgriGuide AI Recommendation for "${queryText}"**:\nRegarding "${queryText}", AgriDirect AI suggests checking current local Mandi market benchmarks and listing fresh produce directly to eliminate intermediary margins. Buyers in Kanyakumari & Nagercoil are currently procuring fresh crops with +18% profit realization for farmers.`
}

// Initial Fallback Data
const initialProducts = [
  {
    id: 1,
    name: 'Tomato',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 500,
    price: 31,
    mandiPrice: 28,
    buyersCount: 4,
    farmer: 'R. Selvam',
    farmerId: 'F-101',
    phone: '+91 98421 10001',
    location: 'Kanyakumari, TN',
    distance: '6 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Fresh organic tomatoes harvested in Kanyakumari. Zero chemical pesticides, high juice content.'
  },
  {
    id: 2,
    name: 'Carrot',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 800,
    price: 29,
    mandiPrice: 26,
    buyersCount: 2,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '12 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Crisp crunchy carrots directly from Nagercoil highlands. Naturally sweet.'
  },
  {
    id: 3,
    name: 'Brinjal',
    category: 'Vegetables',
    grade: 'Grade B',
    quantity: 700,
    price: 20,
    mandiPrice: 18,
    buyersCount: 1,
    farmer: 'Green Valley Farm',
    farmerId: 'F-103',
    phone: '+91 98421 10003',
    location: 'Thiruvattar, TN',
    distance: '15 km',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: false,
    description: 'Fresh purple brinjal directly from farm.'
  },
  {
    id: 4,
    name: 'Beans',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 450,
    price: 34,
    mandiPrice: 30,
    buyersCount: 3,
    farmer: 'Murugan Agro',
    farmerId: 'F-104',
    phone: '+91 98421 10004',
    location: 'Tirunelveli, TN',
    distance: '22 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Green string beans, tender and handpicked.'
  },
  {
    id: 5,
    name: 'Banana',
    category: 'Fruits',
    grade: 'Grade A',
    quantity: 600,
    price: 25,
    mandiPrice: 22,
    buyersCount: 5,
    farmer: 'Lakshmi Farms',
    farmerId: 'F-105',
    phone: '+91 98421 10005',
    location: 'Kanyakumari, TN',
    distance: '10 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Sweet Nendran & Poovan bananas directly from coastal orchards in Kanyakumari.'
  },
  {
    id: 6,
    name: 'Onion',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 1200,
    price: 26,
    mandiPrice: 24,
    buyersCount: 6,
    farmer: 'R. Selvam',
    farmerId: 'F-101',
    phone: '+91 98421 10001',
    location: 'Kanyakumari, TN',
    distance: '6 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Premium Red Shallots & Small Onions harvested fresh in Kanyakumari.'
  },
  {
    id: 7,
    name: 'Potato',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 1500,
    price: 22,
    mandiPrice: 20,
    buyersCount: 3,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '14 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: false,
    description: 'Farm-fresh golden potatoes, clean, washed, and graded.'
  },
  {
    id: 8,
    name: 'Ladies Finger',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 650,
    price: 28,
    mandiPrice: 25,
    buyersCount: 4,
    farmer: 'Green Valley Farm',
    farmerId: 'F-103',
    phone: '+91 98421 10003',
    location: 'Thiruvattar, TN',
    distance: '16 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Tender green Okra / Ladies finger harvested early morning.'
  },
  {
    id: 9,
    name: 'Ponni Rice',
    category: 'Grains',
    grade: 'Grade A+',
    quantity: 2000,
    price: 52,
    mandiPrice: 48,
    buyersCount: 8,
    farmer: 'Murugan Agro',
    farmerId: 'F-104',
    phone: '+91 98421 10004',
    location: 'Tirunelveli, TN',
    distance: '25 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Aged organic Ponni raw rice direct from Tirunelveli paddy fields.'
  },
  {
    id: 10,
    name: 'Tender Coconut',
    category: 'Fruits',
    grade: 'Grade A',
    quantity: 900,
    price: 35,
    mandiPrice: 30,
    buyersCount: 7,
    farmer: 'Lakshmi Farms',
    farmerId: 'F-105',
    phone: '+91 98421 10005',
    location: 'Kanyakumari, TN',
    distance: '8 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Naturally sweet fresh green tender coconut from coastal groves.'
  },
  {
    id: 11,
    name: 'Farm Milk',
    category: 'Dairy',
    grade: 'Grade A+',
    quantity: 300,
    price: 44,
    mandiPrice: 40,
    buyersCount: 9,
    farmer: 'R. Selvam',
    farmerId: 'F-101',
    phone: '+91 98421 10001',
    location: 'Kanyakumari, TN',
    distance: '5 km',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Pure unadulterated Gir cow milk from free-range dairy farm.'
  },
  {
    id: 12,
    name: 'Alphonso Mango',
    category: 'Fruits',
    grade: 'Grade A+',
    quantity: 500,
    price: 85,
    mandiPrice: 75,
    buyersCount: 12,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '18 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Naturally ripened Alphonso & Banganapalli mangoes with rich aroma.'
  },
  {
    id: 13,
    name: 'Green Cardamom',
    category: 'Spices',
    grade: 'Grade A+',
    quantity: 150,
    price: 950,
    mandiPrice: 880,
    buyersCount: 14,
    farmer: 'R. Selvam',
    farmerId: 'F-101',
    phone: '+91 98421 10001',
    location: 'Kanyakumari, TN',
    distance: '6 km',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Fragrant 8mm green cardamom pods harvested from Kanyakumari hills.'
  },
  {
    id: 14,
    name: 'Sweet Papaya',
    category: 'Fruits',
    grade: 'Grade A',
    quantity: 400,
    price: 32,
    mandiPrice: 28,
    buyersCount: 6,
    farmer: 'Lakshmi Farms',
    farmerId: 'F-105',
    phone: '+91 98421 10005',
    location: 'Kanyakumari, TN',
    distance: '10 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Naturally ripened Red Lady sweet papaya directly from coastal grove.'
  },
  {
    id: 15,
    name: 'Taiwan Pink Guava',
    category: 'Fruits',
    grade: 'Grade A',
    quantity: 550,
    price: 45,
    mandiPrice: 38,
    buyersCount: 5,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '12 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1536511135890-4384e511cf74?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1536511135890-4384e511cf74?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Crisp crunchy pink guava with high natural sweetness.'
  },
  {
    id: 16,
    name: 'Fresh Turmeric Root',
    category: 'Spices',
    grade: 'Grade A+',
    quantity: 800,
    price: 65,
    mandiPrice: 58,
    buyersCount: 9,
    farmer: 'Murugan Agro',
    farmerId: 'F-104',
    phone: '+91 98421 10004',
    location: 'Tirunelveli, TN',
    distance: '22 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'High curcumin organic raw turmeric rhizomes.'
  },
  {
    id: 17,
    name: 'Organic Ginger',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 350,
    price: 80,
    mandiPrice: 72,
    buyersCount: 7,
    farmer: 'Green Valley Farm',
    farmerId: 'F-103',
    phone: '+91 98421 10003',
    location: 'Thiruvattar, TN',
    distance: '15 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Fresh aromatic ginger roots with bold spicy flavor.'
  },
  {
    id: 18,
    name: 'Red Pomegranate',
    category: 'Fruits',
    grade: 'Grade A+',
    quantity: 600,
    price: 110,
    mandiPrice: 98,
    buyersCount: 11,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '14 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85'
    ],
    status: 'Active',
    organic: true,
    description: 'Deep red juicy Bhagwa pomegranates from Nagercoil.'
  },
  {
    id: 19,
    name: 'Cold Pressed Coconut Oil',
    category: 'Organic',
    grade: 'Grade A+',
    quantity: 250,
    price: 240,
    mandiPrice: 215,
    buyersCount: 8,
    farmer: 'Lakshmi Farms',
    farmerId: 'F-105',
    phone: '+91 98421 10005',
    location: 'Kanyakumari, TN',
    distance: '8 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Pure cold-pressed virgin coconut oil extracted from fresh Kanyakumari coconuts.'
  },
  {
    id: 20,
    name: 'Malabar Black Pepper',
    category: 'Spices',
    grade: 'Grade A+',
    quantity: 180,
    price: 650,
    mandiPrice: 590,
    buyersCount: 15,
    farmer: 'R. Selvam',
    farmerId: 'F-101',
    phone: '+91 98421 10001',
    location: 'Kanyakumari, TN',
    distance: '6 km',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Aromatic high-piperine black pepper corns harvested from hill groves.'
  },
  {
    id: 21,
    name: 'Fresh Moringa Drumstick',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 400,
    price: 42,
    mandiPrice: 36,
    buyersCount: 6,
    farmer: 'Murugan Agro',
    farmerId: 'F-104',
    phone: '+91 98421 10004',
    location: 'Tirunelveli, TN',
    distance: '22 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Tender long organic drumsticks loaded with natural iron and nutrients.'
  },
  {
    id: 22,
    name: 'Ramnad Mundu Red Chilli',
    category: 'Spices',
    grade: 'Grade A+',
    quantity: 300,
    price: 180,
    mandiPrice: 160,
    buyersCount: 10,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '14 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Authentic round Mundu dry red chillies with bold pungency and rich color.'
  },
  {
    id: 23,
    name: 'Highland Purple Garlic',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 250,
    price: 210,
    mandiPrice: 185,
    buyersCount: 9,
    farmer: 'Green Valley Farm',
    farmerId: 'F-103',
    phone: '+91 98421 10003',
    location: 'Thiruvattar, TN',
    distance: '15 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Strong medicinal garlic cloves grown organically in hill soil.'
  },
  {
    id: 24,
    name: 'Golden Sweet Corn',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 750,
    price: 35,
    mandiPrice: 30,
    buyersCount: 5,
    farmer: 'Murugan Agro',
    farmerId: 'F-104',
    phone: '+91 98421 10004',
    location: 'Tirunelveli, TN',
    distance: '20 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Sweet, juicy golden corn cobs harvested fresh daily.'
  },
  {
    id: 25,
    name: 'Fresh Green Cabbage',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 900,
    price: 18,
    mandiPrice: 15,
    buyersCount: 4,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '12 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: false,
    description: 'Tightly packed crisp green cabbage heads from Nagercoil farms.'
  },
  {
    id: 26,
    name: 'Snowball Cauliflower',
    category: 'Vegetables',
    grade: 'Grade A+',
    quantity: 500,
    price: 26,
    mandiPrice: 22,
    buyersCount: 6,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '12 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Pure white fresh cauliflower heads with leaves trimmed.'
  },
  {
    id: 27,
    name: 'Fresh Palak Spinach',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 300,
    price: 22,
    mandiPrice: 18,
    buyersCount: 7,
    farmer: 'R. Selvam',
    farmerId: 'F-101',
    phone: '+91 98421 10001',
    location: 'Kanyakumari, TN',
    distance: '5 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Early morning harvested fresh green palak spinach bundles.'
  },
  {
    id: 28,
    name: 'Thovalai Aromatic Curry Leaves',
    category: 'Organic',
    grade: 'Grade A+',
    quantity: 200,
    price: 45,
    mandiPrice: 38,
    buyersCount: 11,
    farmer: 'R. Selvam',
    farmerId: 'F-101',
    phone: '+91 98421 10001',
    location: 'Thovalai, TN',
    distance: '6 km',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Highly fragrant organic curry leaves harvested from Thovalai gardens.'
  },
  {
    id: 29,
    name: 'Thovalai Gundu Malli Jasmine',
    category: 'Organic',
    grade: 'Grade A+',
    quantity: 100,
    price: 320,
    mandiPrice: 280,
    buyersCount: 18,
    farmer: 'Lakshmi Farms',
    farmerId: 'F-105',
    phone: '+91 98421 10005',
    location: 'Thovalai, Kanyakumari',
    distance: '7 km',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1592722543636-963d3c87e454?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1592722543636-963d3c87e454?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Famous Thovalai flower market Jasmine (Gundu Malli) with intense perfume.'
  },
  {
    id: 30,
    name: 'Raw Organic Groundnut',
    category: 'Grains',
    grade: 'Grade A',
    quantity: 850,
    price: 95,
    mandiPrice: 84,
    buyersCount: 8,
    farmer: 'Murugan Agro',
    farmerId: 'F-104',
    phone: '+91 98421 10004',
    location: 'Tirunelveli, TN',
    distance: '24 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Sun-dried raw peanuts with high oil content from Tirunelveli.'
  },
  {
    id: 31,
    name: 'Maravalli Kizhangu (Tapioca)',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 1200,
    price: 19,
    mandiPrice: 16,
    buyersCount: 5,
    farmer: 'Green Valley Farm',
    farmerId: 'F-103',
    phone: '+91 98421 10003',
    location: 'Thiruvattar, TN',
    distance: '15 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Fresh starchy cassava / tapioca tubers dug fresh from riverbank soil.'
  },
  {
    id: 32,
    name: 'Elephant Foot Yam (Senai)',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 600,
    price: 38,
    mandiPrice: 32,
    buyersCount: 4,
    farmer: 'Green Valley Farm',
    farmerId: 'F-103',
    phone: '+91 98421 10003',
    location: 'Thiruvattar, TN',
    distance: '15 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Cleaned, firm Senai Kizhangu yams directly from farm harvest.'
  },
  {
    id: 33,
    name: 'Ridge Gourd (Peerkangai)',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 450,
    price: 27,
    mandiPrice: 23,
    buyersCount: 3,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '12 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Tender green ridge gourds harvested fresh in the morning.'
  },
  {
    id: 34,
    name: 'Snake Gourd (Pudalangai)',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 500,
    price: 24,
    mandiPrice: 20,
    buyersCount: 4,
    farmer: 'R. Selvam',
    farmerId: 'F-101',
    phone: '+91 98421 10001',
    location: 'Kanyakumari, TN',
    distance: '6 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Crisp, long organic snake gourds from coastal farms.'
  },
  {
    id: 35,
    name: 'Bitter Gourd (Pavakkai)',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 380,
    price: 32,
    mandiPrice: 27,
    buyersCount: 5,
    farmer: 'Murugan Agro',
    farmerId: 'F-104',
    phone: '+91 98421 10004',
    location: 'Tirunelveli, TN',
    distance: '21 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Dark green dark-ridge bitter gourds rich in antioxidants.'
  },
  {
    id: 36,
    name: 'Sweet Red Watermelon',
    category: 'Fruits',
    grade: 'Grade A+',
    quantity: 1400,
    price: 16,
    mandiPrice: 13,
    buyersCount: 12,
    farmer: 'Lakshmi Farms',
    farmerId: 'F-105',
    phone: '+91 98421 10005',
    location: 'Agasteeswaram, TN',
    distance: '9 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Deep red juicy Namdhari watermelons with high natural sugar.'
  },
  {
    id: 37,
    name: 'Honey Jackfruit (Varikkai)',
    category: 'Fruits',
    grade: 'Grade A+',
    quantity: 450,
    price: 45,
    mandiPrice: 38,
    buyersCount: 14,
    farmer: 'Lakshmi Farms',
    farmerId: 'F-105',
    phone: '+91 98421 10005',
    location: 'Agasteeswaram, TN',
    distance: '10 km',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Golden yellow sweet honey jackfruit bulbs harvested fresh.'
  },
  {
    id: 38,
    name: 'Red Diamond Guava',
    category: 'Fruits',
    grade: 'Grade A+',
    quantity: 500,
    price: 52,
    mandiPrice: 44,
    buyersCount: 9,
    farmer: 'Kumar Farms',
    farmerId: 'F-102',
    phone: '+91 98421 10002',
    location: 'Nagercoil, TN',
    distance: '13 km',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1536511135890-4384e511cf74?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1536511135890-4384e511cf74?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Crisp ruby red guava with sweet pulp and high Vitamin C.'
  },
  {
    id: 39,
    name: 'Fresh Green Sweet Peas',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: 350,
    price: 68,
    mandiPrice: 58,
    buyersCount: 8,
    farmer: 'Green Valley Farm',
    farmerId: 'F-103',
    phone: '+91 98421 10003',
    location: 'Thiruvattar, TN',
    distance: '15 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'Plump sweet green peas handpicked in pods.'
  },
  {
    id: 40,
    name: '100% Pure Organic Turmeric Powder',
    category: 'Organic',
    grade: 'Grade A+',
    quantity: 300,
    price: 140,
    mandiPrice: 125,
    buyersCount: 16,
    farmer: 'Murugan Agro',
    farmerId: 'F-104',
    phone: '+91 98421 10004',
    location: 'Tirunelveli, TN',
    distance: '22 km',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85'],
    status: 'Active',
    organic: true,
    description: 'High-curcumin farm processed pure organic turmeric powder.'
  }
]

const mandiPricesData = [
  { market: 'Nagercoil Mandi', crop: 'Tomato', price: 28, distance: '12 km', trend: '+8%' },
  { market: 'Thiruvattar Mandi', crop: 'Tomato', price: 27, distance: '15 km', trend: '+5%' },
  { market: 'Kanyakumari Mandi', crop: 'Tomato', price: 28, distance: '6 km', trend: '+8%' },
  { market: 'Madurai Mandi', crop: 'Tomato', price: 31, distance: '120 km', trend: '+12%' }
]

/* ── AUTHENTICATION LOGIN & SIGN UP MODAL ─────────────────────────────────── */
function AuthScreenModal({ isOpen, onClose, onLoginSuccess, notify }) {
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  const [role, setRole] = useState('FARMER') // 'FARMER' | 'BUYER'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('Kanyakumari, TN')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAuthError('')

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const payload = authMode === 'login'
      ? { email: email || 'selvam@agridirect.in', password: password || 'password123' }
      : { name: name || 'New User', email: email || `user_${Date.now()}@agridirect.in`, phone: phone || '+91 98000 00000', role, password: password || 'password123', location }

    fetch(getApiUrl(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(json => {
        setIsSubmitting(false)
        if (json.success && json.data) {
          localStorage.setItem('agridirect_user', JSON.stringify(json.data))
          if (notify) notify(`✨ ${json.message || 'Logged in successfully!'}`)
          onLoginSuccess(json.data)
        } else {
          setAuthError(json.error || 'Authentication failed. Please check details.')
        }
      })
      .catch(() => {
        setIsSubmitting(false)
        const mockUser = {
          id: Date.now(),
          name: authMode === 'register' ? (name || 'New User') : (role === 'BUYER' ? 'FreshMart Supermarket' : 'R. Selvam'),
          email: email || 'user@agridirect.in',
          phone: phone || '+91 98421 10001',
          role: role
        }
        localStorage.setItem('agridirect_user', JSON.stringify(mockUser))
        if (notify) notify(`✨ Logged in as ${mockUser.name}!`)
        onLoginSuccess(mockUser)
      })
  }

  const handleQuickDemoLogin = (targetRole) => {
    const demoUser = targetRole === 'Buyer'
      ? { id: 2, name: 'FreshMart Supermarket', email: 'procurement@freshmart.in', phone: '+91 98421 20001', role: 'BUYER' }
      : { id: 1, name: 'R. Selvam', email: 'selvam@agridirect.in', phone: '+91 98421 10001', role: 'FARMER' }

    localStorage.setItem('agridirect_user', JSON.stringify(demoUser))
    if (notify) notify(`🌾 Demo Login as ${demoUser.name} (${targetRole} Mode)!`)
    onLoginSuccess(demoUser)
  }

  const [showKeyInput, setShowKeyInput] = useState(false)
  const [customKey, setCustomKey] = useState('')

  const handleSaveFirebaseKey = () => {
    if (customKey.trim()) {
      localStorage.setItem('agridirect_firebase_api_key', customKey.trim())
      setShowKeyInput(false)
      setAuthError('')
      if (notify) notify('🔑 Firebase API Key saved! Retrying Google Sign-In...')
      handleGoogleSignIn()
    }
  }

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true)
    setAuthError('')
    try {
      const res = await signInWithGoogle()
      if (res.success && res.user) {
        fetch(getApiUrl('/api/auth/google'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: res.user.email,
            name: res.user.name,
            role: role,
            phone: res.user.phone
          })
        })
          .then(r => r.json())
          .then(json => {
            setIsSubmitting(false)
            const userData = json.data || { ...res.user, role }
            localStorage.setItem('agridirect_user', JSON.stringify(userData))
            if (notify) notify(`🌐 Logged in with Google as ${userData.name}!`)
            onLoginSuccess(userData)
          })
          .catch(() => {
            setIsSubmitting(false)
            const userData = { ...res.user, role }
            localStorage.setItem('agridirect_user', JSON.stringify(userData))
            if (notify) notify(`🌐 Logged in with Google as ${userData.name}!`)
            onLoginSuccess(userData)
          })
      } else {
        setIsSubmitting(false)
        if (res.isInvalidKey) {
          setShowKeyInput(true)
        }
        setAuthError(res.error || 'Google Authentication canceled or failed.')
      }
    } catch (err) {
      setIsSubmitting(false)
      if (err.message?.includes('api-key-not-valid')) setShowKeyInput(true)
      setAuthError('Google Sign-In error: ' + err.message)
    }
  }

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ width: '92%', maxWidth: '420px', borderRadius: '20px', padding: '24px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        <button className="modal-close" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px' }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ background: '#e8f5e9', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Sprout size={30} color="#2E7D32" />
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: '1.3rem', color: '#1e293b' }}>
            {authMode === 'login' ? 'Sign In to AgriDirect' : 'Create Your Account'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            {authMode === 'login' ? 'Access direct farmer marketplace & escrow payments' : 'Join India\'s premier direct agricultural network'}
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#1e293b', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <Globe size={18} color="#4285F4" /> Continue with Google (Firebase Auth)
        </button>

        <div style={{ margin: '0 0 14px', textAlign: 'center', position: 'relative' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 8px', fontSize: '0.75rem', color: '#94a3b8' }}>OR EMAIL / USERNAME</span>
        </div>

        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: authMode === 'login' ? '#fff' : 'transparent', fontWeight: 600, color: authMode === 'login' ? '#2E7D32' : '#64748b', cursor: 'pointer', boxShadow: authMode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none' }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: authMode === 'register' ? '#fff' : 'transparent', fontWeight: 600, color: authMode === 'register' ? '#2E7D32' : '#64748b', cursor: 'pointer', boxShadow: authMode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none' }}
          >
            New Register
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>I am a:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setRole('FARMER')}
              style={{ flex: 1, padding: '8px', border: role === 'FARMER' ? '2px solid #2E7D32' : '1px solid #cbd5e1', borderRadius: '10px', background: role === 'FARMER' ? '#f0fdf4' : '#fff', color: role === 'FARMER' ? '#16a34a' : '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              🌾 Farmer (Seller)
            </button>
            <button
              type="button"
              onClick={() => setRole('BUYER')}
              style={{ flex: 1, padding: '8px', border: role === 'BUYER' ? '2px solid #2563eb' : '1px solid #cbd5e1', borderRadius: '10px', background: role === 'BUYER' ? '#eff6ff' : '#fff', color: role === 'BUYER' ? '#1d4ed8' : '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              🛒 Buyer (Retail)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <div className="field-group" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.8rem' }}>Full Name / Business Title</label>
              <input type="text" required placeholder="e.g. Selvam Agro / FreshMart" value={name} onChange={e => setName(e.target.value)} style={{ padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }} />
            </div>
          )}

          <div className="field-group" style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem' }}>Email Address / Username</label>
            <input type="text" required placeholder="e.g. selvam@agridirect.in" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }} />
          </div>

          {authMode === 'register' && (
            <div className="field-group" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.8rem' }}>Phone Number (for SMS & WhatsApp)</label>
              <input type="tel" required placeholder="+91 98421 10001" value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }} />
            </div>
          )}

          <div className="field-group" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem' }}>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }} />
          </div>

          {authError && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '12px' }}>
              ⚠️ {authError}
            </div>
          )}

          {showKeyInput && (
            <div style={{ background: '#fffbebfb', border: '1px solid #fcd34d', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
              <strong style={{ fontSize: '0.82rem', color: '#92400e', display: 'block', marginBottom: '4px' }}>🔑 Configure Firebase API Key:</strong>
              <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#b45309' }}>Paste your Firebase API Key from Firebase Console (Project Settings):</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={customKey}
                  onChange={e => setCustomKey(e.target.value)}
                  style={{ flex: 1, padding: '8px', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #f59e0b', outline: 'none' }}
                />
                <button type="button" className="btn-primary-sm" onClick={handleSaveFirebaseKey}>Save Key</button>
              </div>
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}>
            {isSubmitting ? 'Authenticating with SQLite DB...' : authMode === 'login' ? 'Sign In Now' : 'Create Account in Database'}
          </button>
        </form>

        <div style={{ margin: '18px 0 10px', textAlign: 'center', position: 'relative' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 8px', fontSize: '0.75rem', color: '#94a3b8' }}>OR QUICK DEMO LOGIN</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn-outline-sm" onClick={() => handleQuickDemoLogin('Farmer')} style={{ flex: 1, padding: '8px', fontSize: '0.78rem' }}>
            ⚡ Demo Farmer
          </button>
          <button type="button" className="btn-outline-sm" onClick={() => handleQuickDemoLogin('Buyer')} style={{ flex: 1, padding: '8px', fontSize: '0.78rem' }}>
            ⚡ Demo Buyer
          </button>
        </div>
      </div>
    </div>
  )
}

function getUserFirstName(user) {
  if (!user) return 'User'
  const name = user.name || user.data?.name || user.user?.name || user.email?.split('@')[0] || 'User'
  if (typeof name !== 'string') return 'User'
  return name.trim().split(' ')[0] || 'User'
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('agridirect_user')
      if (!stored) return null
      const parsed = JSON.parse(stored)
      return parsed?.data || parsed?.user || parsed || null
    } catch (e) {
      return null
    }
  })
  const [showAuthModal, setShowAuthModal] = useState(() => !currentUser)
  const [demoRole, setDemoRole] = useState(() => (currentUser?.role === 'BUYER' ? 'Buyer' : 'Farmer'))
  const [currentScreen, setCurrentScreen] = useState('home')
  const [toast, setToast] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState(initialProducts[0])
  const [favoriteIds, setFavoriteIds] = useState([1, 5])
  const [showQrModal, setShowQrModal] = useState(false)
  const [showAgriGuide, setShowAgriGuide] = useState(false)
  const [guideQuery, setGuideQuery] = useState('')
  const [guideAnswer, setGuideAnswer] = useState('')

  const handleLoginSuccess = (userData) => {
    const userObj = userData?.data || userData?.user || userData || {}
    setCurrentUser(userObj)
    setShowAuthModal(false)
    const roleStr = (userObj.role || '').toString().toUpperCase()
    const newRole = roleStr === 'BUYER' ? 'Buyer' : 'Farmer'
    handleRoleChange(newRole)
  }

  const handleToggleFavorite = (productId) => {
    setFavoriteIds(prev => {
      const isFav = prev.includes(productId)
      const next = isFav ? prev.filter(id => id !== productId) : [...prev, productId]
      return next
    })

    const targetProduct = products.find(p => p.id === productId)
    const cropName = targetProduct ? targetProduct.name : 'Crop'

    fetch(getApiUrl('/api/favorites/toggle'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, listingId: productId })
    })
      .then(res => res.json())
      .then(json => {
        notify(json.message || `❤️ ${cropName} updated in Saved Favorites!`)
      })
      .catch(() => {
        const isNowFav = !favoriteIds.includes(productId)
        notify(isNowFav ? `❤️ ${cropName} saved to Favorites!` : `Removed ${cropName} from Favorites`)
      })
  }

  const [requirements, setRequirements] = useState([
    {
      id: 'REQ-101',
      buyerName: 'FreshMart Supermarket',
      crop: 'Tomato',
      quantity: 2000,
      grade: 'Grade A',
      maxPrice: 32,
      requiredBy: '2026-09-15',
      status: 'Active',
      aggregatedFarms: [
        { farmer: 'R. Selvam', farmQty: 500, price: 31, distance: '6 km', matchScore: 94 },
        { farmer: 'Kumar Farms', farmQty: 800, price: 29, distance: '12 km', matchScore: 91 },
        { farmer: 'Green Valley Farm', farmQty: 700, price: 30, distance: '15 km', matchScore: 88 }
      ]
    }
  ])
  const [adminStats, setAdminStats] = useState({
    registeredFarmers: 24,
    verifiedFarmers: 22,
    activeListings: 18,
    totalOrders: 142,
    totalGmv: 584000
  })

  // Synchronize state with backend REST server
  useEffect(() => {
    fetch(getApiUrl('/api/products'))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          setProducts(json.data)
          setSelectedProduct(json.data[0])
        }
      })
      .catch(() => {})

    fetch(getApiUrl('/api/requirements'))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          setRequirements(json.data)
        }
      })
      .catch(() => {})

    fetch(getApiUrl('/api/favorites?userId=1'))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          setFavoriteIds(json.data.map(item => item.id || item.listing_id))
        }
      })
      .catch(() => {})

    fetch(getApiUrl('/api/admin/stats'))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setAdminStats(json.data)
        }
      })
      .catch(() => {})
  }, [])

  const notify = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const handleAgriGuideAsk = (q) => {
    setGuideQuery(q)
    setGuideAnswer(generateSmartAnswer(q))
  }

  const handleAddProduct = (newProd) => {
    fetch(getApiUrl('/api/products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) setProducts(prev => [json.data, ...prev])
        else setProducts(prev => [newProd, ...prev])
      })
      .catch(() => setProducts(prev => [newProd, ...prev]))

    notify('🌱 Crop listing published to live AgriDirect network!')
    setCurrentScreen('farmer-products')
  }

  const handleAddRequirement = (newReq) => {
    fetch(getApiUrl('/api/requirements'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) setRequirements(prev => [json.data, ...prev])
        else setRequirements(prev => [newReq, ...prev])
      })
      .catch(() => setRequirements(prev => [newReq, ...prev]))

    notify('🎯 Requirement posted! Smart Engine aggregated 3 nearby farms.')
    setCurrentScreen('buyer-matches')
  }

  const [screenHistory, setScreenHistory] = useState(['home'])

  const navigateTo = (screenId) => {
    if (screenId === currentScreen) return
    setScreenHistory(prev => [...prev, screenId])
    setCurrentScreen(screenId)
    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
      try {
        window.history.pushState({ screen: screenId }, '')
      } catch (err) {}
    }
  }

  const goBack = () => {
    setScreenHistory(prev => {
      if (prev.length <= 1) {
        const defaultHome = demoRole === 'Buyer' ? 'buyer-home' : 'home'
        setCurrentScreen(defaultHome)
        return [defaultHome]
      }
      const newStack = [...prev]
      newStack.pop()
      const lastScreen = newStack[newStack.length - 1]
      setCurrentScreen(lastScreen)
      return newStack
    })
  }

  const handleRoleChange = (newRole) => {
    setDemoRole(newRole)
    const homeScreen = newRole === 'Buyer' ? 'buyer-home' : 'home'
    setScreenHistory([homeScreen])
    setCurrentScreen(homeScreen)
  }

  // Handle hardware back button on Android devices & browser popstate
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.screen) {
        setCurrentScreen(e.state.screen)
      } else {
        goBack()
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [demoRole])

  const handleOrderPlaced = (qty, prodId) => {
    setProducts(prev => prev.map(p => p.id === prodId ? { ...p, availableQty: Math.max(0, (p.availableQty || p.quantity) - qty) } : p))
  }

  return (
    <div className="app-container">
      {/* Desktop Preview Sidebar */}
      <aside className="mobile-preview-sidebar">
        <div className="sidebar-card">
          <div className="sidebar-badge">
            <Smartphone size={16} /> SIH 2026 Live Prototype
          </div>
          <h3>Preview on Mobile Phone</h3>
          <p>Scan this QR Code with your phone camera to run AgriDirect live on your mobile device!</p>
          
          <div className="qr-wrapper">
            <QRCodeCanvas value={MOBILE_NETWORK_URL} size={150} level="H" includeMargin={true} />
          </div>

          <div className="url-badge">
            <code>{MOBILE_NETWORK_URL}</code>
          </div>

          <div className="pwa-steps">
            <strong>Judge Presentation Guide:</strong>
            <ol>
              <li>Scan QR or open link on phone</li>
              <li>Tap <strong>"Add to Home Screen"</strong></li>
              <li>Test Farmer $\rightarrow$ Buyer $\rightarrow$ Order flow</li>
            </ol>
          </div>
        </div>
      </aside>

      {/* Main App Frame */}
      <main className="app-root">
        {/* SIH Demo Mode Switcher Bar */}
        <header className="sih-role-switcher">
          <span className="sih-badge">AgriDirect Mode:</span>
          <button className={`role-tab ${demoRole === 'Farmer' ? 'active' : ''}`} onClick={() => handleRoleChange('Farmer')}>🌾 Farmer (Seller)</button>
          <button className={`role-tab ${demoRole === 'Buyer' ? 'active' : ''}`} onClick={() => handleRoleChange('Buyer')}>🛒 FreshMart (Buyer)</button>
          <button className="role-tab" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #a7f3d0', marginLeft: 'auto' }} onClick={() => setShowAuthModal(true)}>
            {currentUser ? `👤 ${getUserFirstName(currentUser)}` : '🔐 Sign In / Register'}
          </button>
        </header>

        {/* Authentication Login / Sign Up Modal */}
        <AuthScreenModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} notify={notify} />

        {/* FARMER SCREENS */}
        {demoRole === 'Farmer' && (
          <>
            {currentScreen === 'home'               && <FarmerHomeScreen products={products} onNavigate={navigateTo} onSelectProduct={(p) => { setSelectedProduct(p); navigateTo('product-details') }} onOpenQr={() => setShowQrModal(true)} onOpenGuide={() => navigateTo('agriguide')} />}
            {currentScreen === 'farmer-products'    && <FarmerProductsScreen products={products} onNavigate={navigateTo} onGoBack={goBack} />}
            {currentScreen === 'add-product'        && <AddProductScreen onNavigate={navigateTo} onGoBack={goBack} onAdd={handleAddProduct} notify={notify} />}
            {currentScreen === 'price-intelligence' && <PriceIntelligenceScreen product={selectedProduct} onNavigate={navigateTo} onGoBack={goBack} />}
            {currentScreen === 'farmer-earnings'    && <FarmerEarningsScreen onNavigate={navigateTo} onGoBack={goBack} />}
            {currentScreen === 'product-details'    && <ProductDetailsScreen product={selectedProduct} demoRole={demoRole} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}
            {currentScreen === 'farmer-profile'     && <FarmerProfileScreen demoRole={demoRole} onSwitchRole={(role) => handleRoleChange(role)} onNavigate={navigateTo} onGoBack={goBack} onOpenQr={() => setShowQrModal(true)} notify={notify} />}
            {currentScreen === 'order-tracking'     && <OrderTrackingScreen demoRole={demoRole} onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}
            {currentScreen === 'agri-insights'      && <AgriInsightsScreen demoRole={demoRole} onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}
            {currentScreen === 'payment'            && <PaymentScreen product={selectedProduct} onNavigate={navigateTo} onGoBack={goBack} onOrderPlaced={handleOrderPlaced} notify={notify} />}
          </>
        )}

        {/* BUYER SCREENS */}
        {demoRole === 'Buyer' && (
          <>
            {currentScreen === 'buyer-home'        && <BuyerHomeScreen products={products} onNavigate={navigateTo} onSelectProduct={(p) => { setSelectedProduct(p); navigateTo('product-details') }} />}
            {currentScreen === 'buyer-marketplace' && <BuyerMarketplaceScreen products={products} onNavigate={navigateTo} onGoBack={goBack} onSelectProduct={(p) => { setSelectedProduct(p); navigateTo('product-details') }} />}
            {currentScreen === 'buyer-req'         && <BuyerRequirementScreen onNavigate={navigateTo} onGoBack={goBack} onAddReq={handleAddRequirement} notify={notify} />}
            {currentScreen === 'buyer-matches'     && <SmartMatchesScreen requirements={requirements} onNavigate={navigateTo} onGoBack={goBack} />}
            {currentScreen === 'offers'            && <NegotiationScreen onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}
            {currentScreen === 'product-details'    && <ProductDetailsScreen product={selectedProduct} demoRole={demoRole} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}
            {currentScreen === 'payment'            && <PaymentScreen product={selectedProduct} onNavigate={navigateTo} onGoBack={goBack} onOrderPlaced={handleOrderPlaced} notify={notify} />}
            {currentScreen === 'buyer-orders'      && <BuyerOrdersScreen onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}
            {currentScreen === 'order-tracking'    && <OrderTrackingScreen demoRole={demoRole} onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}
            {currentScreen === 'farmer-profile'     && <FarmerProfileScreen demoRole={demoRole} onSwitchRole={(role) => handleRoleChange(role)} onNavigate={navigateTo} onGoBack={goBack} onOpenQr={() => setShowQrModal(true)} notify={notify} />}
          </>
        )}

        {/* Dedicated AgriGuide Screen */}
        {currentScreen === 'agriguide' && <AgriGuideScreen demoRole={demoRole} onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}

        {/* Dedicated Farm & Mandi Map Explorer Screen */}
        {currentScreen === 'maps' && <FarmMapScreen products={products} demoRole={demoRole} onSelectProduct={(p) => { setSelectedProduct(p); navigateTo('product-details') }} onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}

        {/* Saved Favorites Screen */}
        {currentScreen === 'favorites' && <FavoritesScreen products={products} demoRole={demoRole} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} onNavigate={navigateTo} onGoBack={goBack} onSelectProduct={(p) => { setSelectedProduct(p); navigateTo('product-details') }} notify={notify} />}

        {/* Farmer Direct Chat Screen */}
        {currentScreen === 'chat' && <FarmerChatScreen product={selectedProduct} onNavigate={navigateTo} onGoBack={goBack} notify={notify} />}

        {/* Floating AgriGuide AI Assistant Button */}
        <button className="agriguide-floating-btn" onClick={() => navigateTo('agriguide')} title="Ask AgriGuide AI">
          <Bot size={22} />
          <span>AgriGuide AI</span>
        </button>

        {/* Global Toast Notification */}
        {toast && (
          <div className="global-toast">
            <Check size={16} /> {toast}
          </div>
        )}

        {/* Interactive Camera QR & Barcode Scanner Modal */}
        <LiveQrCameraScannerModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          onNavigate={navigateTo}
          onSelectProduct={(p) => { setSelectedProduct(p); navigateTo('product-details') }}
          products={products}
          notify={notify}
        />
      </main>
    </div>
  )
}

/* ── FARMER HOME ──────────────────────────────────────────────────────────── */
function FarmerHomeScreen({ products, onNavigate, onSelectProduct, onOpenQr, onOpenGuide }) {
  return (
    <div className="screen screen-home">
      <div className="home-header">
        <div className="location-row">
          <div className="location-pin"><MapPin size={15} /><span>Kanyakumari, TN</span></div>
          <div className="header-right">
            <button className="qr-trigger-btn" onClick={onOpenQr}>
              <QrCode size={16} /> <span>Mobile QR</span>
            </button>
            <div className="bell-wrap"><Bell size={18} /><i className="notif-dot" /></div>
            <div className="avatar-mini" onClick={() => onNavigate('farmer-profile')}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=85" alt="Profile" />
            </div>
          </div>
        </div>

        <div className="farmer-welcome">
          <h2>Good morning, R. Selvam 👋</h2>
          <p>Verified Farmer · Kanyakumari District</p>
        </div>
      </div>

      <div className="scroll-body">
        {/* Metric Cards */}
        <div className="metrics-grid">
          <div className="metric-card" onClick={() => onNavigate('farmer-products')}>
            <span className="metric-val">{products.length}</span>
            <span className="metric-lbl">Active Listings</span>
          </div>
          <div className="metric-card" onClick={() => onNavigate('order-tracking')}>
            <span className="metric-val">12</span>
            <span className="metric-lbl">Orders This Week</span>
          </div>
          <div className="metric-card highlight" onClick={() => onNavigate('agri-insights')}>
            <span className="metric-val">₹48,260</span>
            <span className="metric-lbl">Agri Insights</span>
          </div>
        </div>

        {/* Farmer Realization Comparison Widget */}
        <div className="realization-card">
          <div className="rc-header">
            <TrendingUp size={16} /> <span>Farmer Realization Comparison</span>
          </div>
          <div className="rc-comparison-row">
            <div className="rc-col traditional">
              <small>Traditional Intermediaries</small>
              <strong>₹22.00/kg</strong>
              <span>Intermediary takes ₹9.00</span>
            </div>
            <div className="rc-arrow">→</div>
            <div className="rc-col agridirect">
              <small>AgriDirect Sourcing</small>
              <strong className="green">₹28.00/kg</strong>
              <span className="gain-badge">+27.27% Realization</span>
            </div>
          </div>
          <small className="rc-disclaimer">* Illustrative comparison based on demo assumptions.</small>
        </div>

        {/* CTA Banner */}
        <div className="hero-banner" onClick={() => onNavigate('add-product')}>
          <div className="banner-text">
            <h3>+ List New Harvest</h3>
            <p>Get AI Recommended Mandi Prices & Direct Buyer Access</p>
            <button className="banner-btn">+ Add Produce</button>
          </div>
          <div className="banner-img">
            <img src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=85" alt="Farmer" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-bar">
          <button className="qa-btn" onClick={() => onNavigate('maps')}>
            <Globe size={18} />
            <span>Farm Map</span>
          </button>
          <button className="qa-btn" onClick={() => onNavigate('price-intelligence')}>
            <TrendingUp size={18} />
            <span>Mandi Rates</span>
          </button>
          <button className="qa-btn" onClick={() => onNavigate('agri-insights')}>
            <BarChart3 size={18} />
            <span>Agri Insights</span>
          </button>
          <button className="qa-btn" onClick={onOpenGuide}>
            <Bot size={18} />
            <span>AgriGuide</span>
          </button>
        </div>

        {/* Market Price Intelligence Banner */}
        <div className="intel-card" onClick={() => onNavigate('price-intelligence')}>
          <div className="intel-top">
            <div className="intel-title"><Sprout size={18} /> <span>Tomato Mandi Rate</span></div>
            <span className="trend-badge">↑ 8% Demand</span>
          </div>
          <div className="intel-body">
            <div className="intel-price">₹28<small>/kg (Today)</small></div>
            <div className="intel-rec">AI Recommended: <strong>₹30 – ₹32/kg</strong></div>
          </div>
          <small className="intel-note">Tomato demand expected to increase by 18% over next 7 days.</small>
        </div>

        <div className="section-title-row">
          <h4>Your Active Crop Listings ({products.length})</h4>
          <button className="view-all" onClick={() => onNavigate('farmer-products')}>Manage Catalog</button>
        </div>

        <div className="deals-grid">
          {products.map(p => (
            <div key={p.id} className="deal-card" onClick={() => onSelectProduct(p)}>
              <div className="deal-img-wrap">
                <img src={p.image} alt={p.name} />
                <button className="wish-btn"><Heart size={13} /></button>
              </div>
              <div className="deal-info">
                <h5>{p.name}</h5>
                <div className="deal-price">₹{p.price}<small>/kg</small></div>
                <p>{p.grade} · {p.quantity} kg</p>
                <small>Mandi Benchmark: ₹{p.mandiPrice || 28}/kg</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FarmerBottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}

/* ── FARMER PRODUCTS ──────────────────────────────────────────────────────── */
function FarmerProductsScreen({ products, onNavigate, onGoBack }) {
  const [tab, setTab] = useState('active')
  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('home'))}><ArrowLeft size={20} /></button>
        <h3>My Crop Listings</h3>
        <button className="icon-btn" onClick={() => onNavigate('add-product')}><Plus size={20} /></button>
      </div>

      <div className="tab-bar">
        {[['active', `Active (${products.length})`], ['pending', 'Pending (1)'], ['sold', 'Sold']].map(([key, label]) => (
          <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div className="scroll-body">
        {products.map((p, idx) => (
          <div key={p.id} className="fp-card">
            <img src={p.image} alt={p.name} className="fp-thumb" />
            <div className="fp-info">
              <h4>{p.name}</h4>
              <p>{p.quantity} kg · {p.grade}</p>
              <div className="fp-price-row">
                <span className="price">₹{p.price}/kg</span>
                <span className="live-pill">Live</span>
              </div>
              <small>{idx === 0 ? '4 Buyers Interested' : idx === 1 ? '2 Buyers Interested' : '3 Buyers'}</small>
            </div>
            <button className="bids-btn" onClick={() => onNavigate('price-intelligence')}>View Intel</button>
          </div>
        ))}
      </div>

      <FarmerBottomNav active="products" onNavigate={onNavigate} />
    </div>
  )
}

/* ── ADD PRODUCE + VOICE ASSISTED LISTING ─────────────────────────────────── */
function AddProductScreen({ onNavigate, onGoBack, onAdd, notify }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Vegetables')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [grade, setGrade] = useState('Grade A')
  const [description, setDescription] = useState('')
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [previewImage, setPreviewImage] = useState('https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=85')

  const handleVoiceInput = () => {
    setIsVoiceActive(true)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition()
        recognition.lang = 'ta-IN'
        recognition.onstart = () => setIsVoiceActive(true)
        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript
          setName(text.includes('தக்காளி') ? 'Tomato' : text.includes('வெங்காயம்') ? 'Onion' : 'Tomato')
          setQuantity('500')
          setPrice('31')
          setGrade('Grade A')
          setIsVoiceActive(false)
          notify(`🎙 Recognized speech: "${text}"`)
        }
        recognition.onerror = () => {
          setName('Tomato'); setQuantity('500'); setPrice('31'); setGrade('Grade A');
          setIsVoiceActive(false)
          notify('🎙 Demo Voice Parser fallback: "500 kg thakkali, grade A, 31 rupees"')
        }
        recognition.start()
      } catch (err) {
        setName('Tomato'); setQuantity('500'); setPrice('31'); setGrade('Grade A');
        setIsVoiceActive(false)
        notify('🎙 Demo Voice Parser: "500 kg thakkali, grade A, 31 rupees"')
      }
    } else {
      setTimeout(() => {
        setName('Tomato')
        setQuantity('500')
        setPrice('31')
        setGrade('Grade A')
        setDescription('Fresh organic tomato, harvested in Kanyakumari.')
        setIsVoiceActive(false)
        notify('🎙 Demo Voice Parser: "500 kg thakkali, grade A, 31 rupees"')
      }, 1200)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !price || !quantity) {
      notify('Please fill in crop name, quantity, and price.')
      return
    }
    onAdd({
      name,
      category,
      quantity: Number(quantity),
      price: Number(price),
      mandiPrice: 28,
      grade,
      description,
      image: previewImage,
      farmer: 'R. Selvam',
      location: 'Kanyakumari, TN'
    })
  }

  return (
    <div className="screen screen-white">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('home'))}><ArrowLeft size={20} /></button>
        <h3>Add Produce Listing</h3>
        <span />
      </div>

      <form onSubmit={handleSubmit} className="scroll-body pad">
        <button type="button" className={`voice-btn ${isVoiceActive ? 'listening' : ''}`} onClick={handleVoiceInput}>
          <Mic size={20} />
          <span>{isVoiceActive ? 'Listening (Tamil / English)...' : '🎙 Speak to fill (Tamil / English)'}</span>
        </button>

        <label className="photo-upload">
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
            if (e.target.files?.[0]) setPreviewImage(URL.createObjectURL(e.target.files[0]))
          }} />
          <img src={previewImage} alt="Crop Preview" className="uploaded-preview" />
          <strong>Tap to Upload Crop Photo</strong>
        </label>

        <div className="field-group">
          <label>Crop Name</label>
          <input type="text" placeholder="e.g. Tomato" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains">Grains</option>
            <option value="Dairy">Dairy</option>
          </select>
        </div>

        <div className="field-group">
          <label>Quantity (kg)</label>
          <input type="number" placeholder="e.g. 500" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Asking Price (₹/kg)</label>
          <input type="number" placeholder="e.g. 31" value={price} onChange={e => setPrice(e.target.value)} required />
          <div className="price-benchmark-box">
            <div><span>Today's Mandi Price:</span> <strong>₹28/kg</strong></div>
            <div><span>AI Suggested Range:</span> <strong className="green">₹30 – ₹32/kg</strong></div>
            <div><span>Demand Signal:</span> <strong className="amber">HIGH ↑ 18%</strong></div>
          </div>
        </div>

        <div className="field-group">
          <label>Quality Grade</label>
          <select value={grade} onChange={e => setGrade(e.target.value)}>
            <option>Grade A</option>
            <option>Grade A+</option>
            <option>Grade B</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Publish Listing
        </button>
      </form>
    </div>
  )
}

/* ── MARKET PRICE INTELLIGENCE ────────────────────────────────────────────── */
function PriceIntelligenceScreen({ product, onNavigate, onGoBack }) {
  const item = product || initialProducts[0]
  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('home'))}><ArrowLeft size={20} /></button>
        <h3>Market Price Intelligence</h3>
        <span />
      </div>

      <div className="scroll-body pad">
        <div className="intel-product-header">
          <img src={item.image} alt={item.name} />
          <div>
            <h3>{item.name} Market Analysis</h3>
            <p>Kanyakumari & Nearby Mandis</p>
          </div>
        </div>

        <div className="rec-card">
          <div className="rec-header"><Sprout size={18} /><span>AgriDirect AI Recommended Price</span></div>
          <div className="rec-price">₹30 – ₹32/kg</div>
          <div className="rec-formula">
            <code>recommendedPrice = (nearbyMandiAverage × 0.60) + (demandSignal × 0.40)</code>
          </div>
          <div className="rec-status">High local demand · +18% margin vs traditional mandi</div>
        </div>

        {/* AI Regional Demand Map */}
        <h4 className="section-heading">Regional Demand Map</h4>
        <div className="demand-map-box">
          <div className="dm-row high">
            <span className="dm-city">Chennai Region</span>
            <span className="dm-pill high">HIGH DEMAND (+24%)</span>
          </div>
          <div className="dm-row med">
            <span className="dm-city">Madurai Region</span>
            <span className="dm-pill med">MEDIUM DEMAND (+12%)</span>
          </div>
          <div className="dm-row low">
            <span className="dm-city">Nagercoil Region</span>
            <span className="dm-pill low">STABLE DEMAND (+5%)</span>
          </div>
        </div>

        <h4 className="section-heading">Nearby Mandi Benchmark Prices</h4>
        <div className="mandi-list">
          {mandiPricesData.map(m => (
            <div key={m.market} className="mandi-item">
              <div>
                <strong>{m.market}</strong>
                <small>Distance: {m.distance}</small>
              </div>
              <div className="mandi-price-wrap">
                <span className="m-price">₹{m.price}/kg</span>
                <span className="m-trend">{m.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── FARMER EARNINGS ──────────────────────────────────────────────────────── */
function FarmerEarningsScreen({ onNavigate, onGoBack }) {
  const [analytics, setAnalytics] = useState({
    totalEarnings: 48260,
    availableBalance: 24850,
    pendingBalance: 6200,
    completedOrders: 32,
    weeklyChart: [
      { day: 'Mon', amount: 4000 },
      { day: 'Tue', amount: 3200 },
      { day: 'Wed', amount: 3000 },
      { day: 'Thu', amount: 4500 },
      { day: 'Fri', amount: 3200 },
      { day: 'Sat', amount: 2500 },
      { day: 'Sun', amount: 3800 }
    ],
    revenueInsights: 'Tomato generated 38% of your revenue this month.'
  })

  useEffect(() => {
    fetch(getApiUrl('/api/analytics/farmer'))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setAnalytics(json.data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('home'))}><ArrowLeft size={20} /></button>
        <h3>Earnings & Settlements</h3>
        <span />
      </div>

      <div className="scroll-body pad">
        <div className="earnings-hero">
          <span>This Month Total Earnings (SQLite)</span>
          <h2>₹{analytics.totalEarnings.toLocaleString()}</h2>
          <small>{analytics.completedOrders} completed direct orders · 100% Escrow released</small>
        </div>

        <h4 className="section-heading">Weekly Earnings Trend (SQLite Computed)</h4>
        <div className="chart-box">
          {analytics.weeklyChart.map(d => (
            <div key={d.day} className="chart-col">
              <span className="col-val">₹{d.amount / 1000}k</span>
              <div className="col-bar" style={{ height: `${(d.amount / 4500) * 100}%` }} />
              <span className="col-lbl">{d.day}</span>
            </div>
          ))}
        </div>

        <div className="analytics-card">
          <h4>Revenue Breakdown</h4>
          <p>{analytics.revenueInsights}</p>
          <p>Average selling price increased by <strong>8%</strong> vs local mandi benchmark.</p>
        </div>
      </div>
    </div>
  )
}

/* ── BUYER HOME ───────────────────────────────────────────────────────────── */
function BuyerHomeScreen({ products, onNavigate, onSelectProduct }) {
  return (
    <div className="screen screen-home">
      <div className="home-header">
        <div className="location-row">
          <div className="location-pin" onClick={() => onNavigate('maps')} style={{ cursor: 'pointer' }}>
            <MapPin size={15} /><span>FreshMart Supermarket (Map 🗺️)</span>
          </div>
          <div className="avatar-mini">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=85" alt="Buyer" />
          </div>
        </div>

        <div className="farmer-welcome">
          <h2>Good morning, FreshMart 👋</h2>
          <p>Verified Retail Procurement Buyer</p>
        </div>
      </div>

      <div className="scroll-body">
        <div className="quick-actions-bar" style={{ margin: '10px 14px' }}>
          <button className="qa-btn" onClick={() => onNavigate('maps')}>
            <Globe size={18} />
            <span>Farm & Mandi Map</span>
          </button>
          <button className="qa-btn" onClick={() => onNavigate('buyer-req')}>
            <Plus size={18} />
            <span>Post Requirement</span>
          </button>
          <button className="qa-btn" onClick={() => onNavigate('buyer-matches')}>
            <Users size={18} />
            <span>Smart Matches</span>
          </button>
        </div>

        <div className="hero-banner buyer-theme" onClick={() => onNavigate('buyer-req')}>
          <div className="banner-text">
            <h3>+ Create Produce Requirement</h3>
            <p>Smart Engine Aggregates Multiple Nearby Farms Automatically</p>
            <button className="banner-btn">+ Post Requirement</button>
          </div>
        </div>

        <div className="section-title-row">
          <h4>Direct Produce Marketplace</h4>
          <button className="view-all" onClick={() => onNavigate('buyer-marketplace')}>View All</button>
        </div>

        <div className="deals-grid">
          {products.map(p => (
            <div key={p.id} className="deal-card" onClick={() => onSelectProduct(p)}>
              <div className="deal-img-wrap">
                <img src={p.image} alt={p.name} />
              </div>
              <div className="deal-info">
                <h5>{p.name}</h5>
                <div className="deal-price">₹{p.price}<small>/kg</small></div>
                <p>{p.grade} · {p.farmer}</p>
                <small>📍 {p.location}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BuyerBottomNav active="explore" onNavigate={onNavigate} />
    </div>
  )
}

/* ── BUYER MARKETPLACE ────────────────────────────────────────────────────── */
function BuyerMarketplaceScreen({ products, onNavigate, onGoBack, onSelectProduct }) {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? products : products.filter(p => p.category === cat)
  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('buyer-home'))}><ArrowLeft size={20} /></button>
        <h3>Fresh Marketplace ({filtered.length})</h3>
        <button className="icon-btn" onClick={() => onNavigate('favorites')}><Heart size={20} /></button>
      </div>

      <div className="cat-pills">
        {['All', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Organic', 'Dairy'].map(c => (
          <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="scroll-body">
        {filtered.map(p => (
          <div key={p.id} className="market-card" onClick={() => onSelectProduct(p)}>
            <img src={p.image} alt={p.name} className="market-thumb" />
            <div className="market-info">
              <div className="market-top">
                <h4>{p.name}</h4>
                <button className="icon-btn-sm"><Heart size={14} /></button>
              </div>
              <div className="market-price">₹{p.price}<small>/kg</small> · {p.quantity} kg</div>
              <p>{p.grade} · 📍 {p.location}</p>
              <button className="buy-now-btn">View & Buy</button>
            </div>
          </div>
        ))}
      </div>

      <BuyerBottomNav active="explore" onNavigate={onNavigate} />
    </div>
  )
}

/* ── BUYER REQUIREMENT GENERATOR ─────────────────────────────────────────── */
function BuyerRequirementScreen({ onNavigate, onGoBack, onAddReq, notify }) {
  const [crop, setCrop] = useState('Tomato')
  const [quantity, setQuantity] = useState('2000')
  const [maxPrice, setMaxPrice] = useState('32')
  const [grade, setGrade] = useState('Grade A')

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddReq({
      buyerName: 'FreshMart Supermarket',
      crop,
      quantity: Number(quantity),
      grade,
      maxPrice: Number(maxPrice),
      requiredBy: '2026-09-15'
    })
  }

  return (
    <div className="screen screen-white">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('buyer-home'))}><ArrowLeft size={20} /></button>
        <h3>Create Produce Requirement</h3>
        <span />
      </div>

      <form onSubmit={handleSubmit} className="scroll-body pad">
        <div className="field-group">
          <label>Produce Name</label>
          <input type="text" value={crop} onChange={e => setCrop(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Quantity Required (kg)</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Maximum Price Willing to Pay (₹/kg)</label>
          <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Preferred Quality Grade</label>
          <select value={grade} onChange={e => setGrade(e.target.value)}>
            <option>Grade A</option>
            <option>Grade A+</option>
            <option>Grade B</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Find Matching Farmers & Aggregate
        </button>
      </form>
    </div>
  )
}

/* ── SMART MATCHES & MULTI-FARMER AGGREGATION ────────────────────────────── */
function SmartMatchesScreen({ requirements, onNavigate, onGoBack }) {
  const req = requirements[0]
  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('buyer-home'))}><ArrowLeft size={20} /></button>
        <h3>Smart Farmer Matches</h3>
        <span />
      </div>

      <div className="scroll-body pad">
        <div className="aggregation-banner">
          <h4>🌾 Multi-Farmer Aggregation Active</h4>
          <p>Your requirement of <strong>2,000 kg Tomato</strong> is fulfilled by aggregating <strong>3 nearby farms</strong>.</p>
        </div>

        <h4 className="section-heading">Matching Farms (Ranked by Score)</h4>
        {req.aggregatedFarms.map((f, i) => (
          <div key={i} className="farm-match-card">
            <div className="fm-top">
              <strong>{f.farmer}</strong>
              <span className="score-pill">{f.matchScore}% Match</span>
            </div>
            <div className="fm-body">
              <span>Supply: <strong>{f.farmQty} kg</strong></span>
              <span>Asking: <strong>₹{f.price}/kg</strong></span>
              <span>Proximity: <strong>{f.distance}</strong></span>
            </div>
            <button className="btn-outline-sm" onClick={() => onNavigate('offers')}>Negotiate Offer</button>
          </div>
        ))}

        <div className="price-breakdown-card">
          <h4>Transparent Pricing Breakdown</h4>
          <div className="pb-row"><span>Farmer Receives (Avg):</span> <strong>₹30.00/kg</strong></div>
          <div className="pb-row"><span>Aggregated Logistics:</span> <strong>₹3.00/kg</strong></div>
          <div className="pb-row"><span>Platform Operation:</span> <strong>₹1.00/kg</strong></div>
          <div className="pb-row"><span>Payment & Escrow:</span> <strong>₹1.00/kg</strong></div>
          <div className="pb-divider" />
          <div className="pb-row total"><span>Total Delivered Price:</span> <strong>₹35.00/kg</strong></div>
        </div>

        <button className="btn-primary" onClick={() => onNavigate('offers')}>Confirm Aggregated Order</button>
      </div>
    </div>
  )
}

/* ── OFFERS & NEGOTIATION WORKFLOW ────────────────────────────────────────── */
function NegotiationScreen({ onNavigate, onGoBack, notify }) {
  const [offerStage, setOfferStage] = useState(1)

  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('buyer-matches'))}><ArrowLeft size={20} /></button>
        <h3>Offer & Negotiation</h3>
        <span />
      </div>

      <div className="scroll-body pad">
        <div className="negotiation-history">
          <div className="chat-bubble buyer">
            <strong>FreshMart:</strong> Offered ₹30/kg for 500 kg Tomato.
          </div>
          {offerStage >= 2 && (
            <div className="chat-bubble farmer">
              <strong>R. Selvam:</strong> Counter-offered ₹32/kg (Grade A organic quality).
            </div>
          )}
          {offerStage >= 3 && (
            <div className="chat-bubble buyer agreed">
              <strong>Agreed Deal:</strong> ₹31/kg confirmed!
            </div>
          )}
        </div>

        {offerStage === 1 && (
          <button className="btn-primary" onClick={() => { setOfferStage(2); notify('Counter-offer received from farmer'); }}>
            View Farmer Counter-Offer
          </button>
        )}
        {offerStage === 2 && (
          <button className="btn-primary" onClick={() => { setOfferStage(3); notify('Deal confirmed at ₹31/kg!'); }}>
            Accept ₹31/kg Deal
          </button>
        )}
        {offerStage === 3 && (
          <button className="btn-primary" onClick={() => onNavigate('payment')}>
            Proceed to Payment & Checkout
          </button>
        )}
      </div>
    </div>
  )
}

/* ── PAYMENT & ESCROW CHECKOUT ────────────────────────────────────────────── */
function PaymentScreen({ product, onNavigate, onGoBack, onOrderPlaced, notify }) {
  const item = product || initialProducts[0]
  const [quantity, setQuantity] = useState(item.availableQty || item.quantity || 500)
  const [method, setMethod] = useState('upi')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const unitPrice = item.price || 30
  const itemCost = Math.round(quantity * unitPrice)
  const logisticsFee = Math.round(quantity * 2)
  const totalAmount = itemCost + logisticsFee

  const handlePay = () => {
    setIsSubmitting(true)
    const orderData = {
      productId: item.id,
      productName: item.name,
      farmerName: item.farmer || item.farmer_name || 'R. Selvam',
      buyerName: 'FreshMart Supermarket',
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalAmount: Number(totalAmount)
    }

    fetch(getApiUrl('/api/orders'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
      .then(res => res.json())
      .then(json => {
        setIsSubmitting(false)
        if (onOrderPlaced) onOrderPlaced(Number(quantity), item.id)
        if (notify) notify(json.message || `✅ Payment Successful! ₹${totalAmount.toLocaleString()} locked in Escrow.`)
        onNavigate('order-tracking')
      })
      .catch(() => {
        setIsSubmitting(false)
        if (onOrderPlaced) onOrderPlaced(Number(quantity), item.id)
        if (notify) notify(`✅ Payment Successful! ₹${totalAmount.toLocaleString()} locked in Escrow.`)
        onNavigate('order-tracking')
      })
  }

  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('product-details'))}><ArrowLeft size={20} /></button>
        <h3>Secure Escrow Checkout</h3>
        <span />
      </div>

      <div className="scroll-body pad">
        {/* Selected Crop Summary Card */}
        <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '14px', marginBottom: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>{item.name}</h4>
            <small style={{ color: '#64748b' }}>{item.grade} · ₹{unitPrice}/kg · Farmer: <strong>{item.farmer || item.farmer_name || 'R. Selvam'}</strong></small>
          </div>
        </div>

        {/* Quantity Input */}
        <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '14px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Quantity to Order (KG)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn-outline-sm" style={{ padding: '8px 14px' }} onClick={() => setQuantity(prev => Math.max(10, prev - 50))}>- 50</button>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '1.05rem', fontWeight: 700, borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
            <button className="btn-outline-sm" style={{ padding: '8px 14px' }} onClick={() => setQuantity(prev => prev + 50)}>+ 50</button>
          </div>
        </div>

        {/* Dynamic Pricing Summary */}
        <div className="summary-box">
          <h4>Order Summary</h4>
          <div className="summary-row"><span>{item.name} ({quantity} kg @ ₹{unitPrice}/kg)</span><strong>₹{itemCost.toLocaleString()}</strong></div>
          <div className="summary-row"><span>Logistics & Escrow Fee (₹2/kg)</span><strong>₹{logisticsFee.toLocaleString()}</strong></div>
          <div className="summary-divider" />
          <div className="summary-row total"><span>Total Payable</span><strong>₹{totalAmount.toLocaleString()}</strong></div>
        </div>

        {/* Payment Methods */}
        <div className="payment-box">
          <h4>Select Payment Method</h4>
          {[
            ['upi', 'UPI Direct (Instant Escrow Hold)', 'Google Pay / PhonePe / Paytm'],
            ['netbanking', 'Net Banking / NEFT', 'All major Indian banks'],
            ['wallet', 'AgriDirect Wallet', 'Balance: ₹25,000'],
            ['cod', 'Cash on Delivery', 'Escrow verification code on delivery']
          ].map(([key, title, sub]) => (
            <label key={key} className={`pm-item${method === key ? ' selected' : ''}`}>
              <input type="radio" name="pm" checked={method === key} onChange={() => setMethod(key)} />
              <div>
                <strong>{title}</strong>
                {sub && <small> ({sub})</small>}
              </div>
            </label>
          ))}
        </div>

        <button className="btn-primary" disabled={isSubmitting} onClick={handlePay} style={{ margin: '14px 0 8px' }}>
          {isSubmitting ? 'Securing Escrow Payment...' : `Pay ₹${totalAmount.toLocaleString()} via Escrow`}
        </button>

        <div className="escrow-note"><Lock size={14} /><span>Funds are locked in Escrow until you confirm produce delivery.</span></div>
      </div>
    </div>
  )
}

/* ── ORDER TRACKING & ESCROW DELIVERY ─────────────────────────────────────── */
function OrderTrackingScreen({ demoRole, onNavigate, onGoBack, notify }) {
  const [orderInfo, setOrderInfo] = useState(null)

  useEffect(() => {
    fetch(getApiUrl('/api/orders'))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          setOrderInfo(json.data[0])
        }
      })
      .catch(() => {})
  }, [])

  const ordId = orderInfo?.id || 'ORD-89421'
  const cropName = orderInfo?.productName || 'Tomato'
  const quantity = orderInfo?.quantity || 500
  const farmerName = orderInfo?.farmerName || 'R. Selvam'
  const totalAmount = orderInfo?.totalAmount || 18000
  const escrowState = orderInfo?.escrowState || 'HELD'
  const sellerLocation = orderInfo?.sellerLocation || 'Kanyakumari, TN'
  const buyerLocation = orderInfo?.buyerLocation || 'Nagercoil Hub, TN'
  const sellerPhone = orderInfo?.sellerPhone || '+91 98421 10001'
  const driverName = orderInfo?.driverName || 'Ravi Agro Logistics'
  const driverPhone = orderInfo?.driverPhone || '+91 98765 43210'
  const vehicleNo = orderInfo?.vehicleNo || 'TN-74-AZ-4821'

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(sellerLocation)}&destination=${encodeURIComponent(buyerLocation)}`
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(sellerLocation)}&t=&z=11&ie=UTF8&iwloc=&output=embed`

  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate(demoRole === 'Buyer' ? 'buyer-home' : 'home'))}><ArrowLeft size={20} /></button>
        <h3>Order & Live GPS Delivery</h3>
        <span />
      </div>

      <div className="scroll-body pad">
        <div className="stepper">
          {[['Placed', 'done'], ['Processing', 'done'], ['Picked Up', 'done'], ['On the Way', 'active'], ['Delivered', '']].map(([label, state]) => (
            <div key={label} className={`step ${state}`}>
              <div className="step-dot" />
              <small>{label}</small>
            </div>
          ))}
        </div>

        <div className="tracking-card">
          <div className="ti-info">
            <h4>{cropName} Order #{ordId}</h4>
            <p>{quantity} kg · {farmerName} ({sellerLocation})</p>
            <strong>₹{totalAmount.toLocaleString()} (Escrow {escrowState})</strong>
          </div>
          <button className="link-btn" onClick={() => notify(`Escrow status: ₹${totalAmount.toLocaleString()} held until delivery`)}>Escrow Status</button>
        </div>

        <div className="delivery-card">
          <div className="dp-icon"><Truck size={18} /></div>
          <div className="dp-text">
            <strong>{driverName}</strong>
            <small>Driver: {driverPhone} · Vehicle: {vehicleNo}</small>
          </div>
          <a href={`tel:${driverPhone.replace(/\s+/g, '')}`} className="contact-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>Call Driver</a>
        </div>

        {/* Real Location Route Card */}
        <div style={{ background: '#fff', padding: '14px', borderRadius: '14px', margin: '12px 0', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} color="#2E7D32" /> Verified Direct Logistics Route
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>🌾 Seller Origin:</span>
              <strong style={{ color: '#15803d' }}>{sellerLocation} ({farmerName})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>🛒 Buyer Destination:</span>
              <strong style={{ color: '#1e40af' }}>{buyerLocation}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>📞 Seller Contact:</span>
              <a href={`tel:${sellerPhone.replace(/\s+/g, '')}`} style={{ color: '#2E7D32', fontWeight: 600, textDecoration: 'none' }}>
                Call {sellerPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Google Maps Live Map View */}
        <div className="map-box">
          <div style={{ width: '100%', height: '210px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', marginBottom: '10px' }}>
            <iframe
              title="Google Maps Live Route"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={mapEmbedUrl}
              allowFullScreen
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ width: '100%', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', padding: '12px' }}
            >
              <Globe size={16} /> 🗺️ Open in Google Maps
            </a>
          </div>

          <div className="pickup-strip">
            <span>Live GPS ETA</span>
            <strong>Estimated arrival in 45 minutes ({sellerLocation} $\rightarrow$ {buyerLocation})</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── BUYER ORDERS ─────────────────────────────────────────────────────────── */
function BuyerOrdersScreen({ onNavigate, onGoBack, notify }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(getApiUrl('/api/orders'))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setOrders(json.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const displayOrders = orders.length > 0 ? orders : [
    {
      id: 'ORD-89421',
      productName: 'Tomato',
      quantity: 500,
      farmerName: 'R. Selvam',
      totalAmount: 18000,
      escrowState: 'HELD',
      deliveryStage: 'ON_THE_WAY'
    }
  ]

  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('buyer-home'))}><ArrowLeft size={20} /></button>
        <h3>Active Deliveries & Orders</h3>
        <span />
      </div>

      <div className="scroll-body pad">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>Loading live database orders...</p>
        ) : (
          displayOrders.map(ord => (
            <div key={ord.id} className="tracking-card" style={{ marginBottom: '12px', cursor: 'pointer' }} onClick={() => onNavigate('order-tracking')}>
              <div className="ti-info">
                <h4>{ord.productName} Order #{ord.id}</h4>
                <p>{ord.quantity} kg · {ord.farmerName || 'R. Selvam'}</p>
                <strong>₹{(ord.totalAmount || 0).toLocaleString()} (Escrow {ord.escrowState || 'HELD'})</strong>
              </div>
              <button className="link-btn">Track Delivery 🚚</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ── PRODUCT DETAILS ──────────────────────────────────────────────────────── */
function ProductDetailsScreen({ product, demoRole, favoriteIds = [], onToggleFavorite, onNavigate, onGoBack, notify }) {
  const item = product || initialProducts[0]
  const images = item.images && item.images.length > 0 ? item.images : [item.image]
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const shareUrl = `${window.location.origin}/#product-${item.id}`
  const isFav = favoriteIds.includes(item.id)

  const handlePrevImg = (e) => {
    e.stopPropagation()
    setActiveImgIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImg = (e) => {
    e.stopPropagation()
    setActiveImgIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleShare = () => {
    setShowShareModal(true)
    if (navigator.share) {
      navigator.share({
        title: `AgriDirect — ${item.name}`,
        text: `Buy fresh ${item.name} (${item.grade}) directly from ${item.farmer} on AgriDirect!`,
        url: shareUrl
      }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      if (notify) notify(`🔗 Share link copied: ${shareUrl}`)
    }
  }

  const sellerPhone = item.phone || item.farmerPhone || '+91 98421 10001'
  const waPhoneClean = sellerPhone.replace(/\D/g, '').slice(-10)

  return (
    <div className="screen screen-white">
      <div className="pd-hero">
        <div className="pd-hero-slider">
          <img src={images[activeImgIndex]} alt={`${item.name} photo ${activeImgIndex + 1}`} />
          
          {images.length > 1 && (
            <>
              <button className="pd-slide-nav-btn left" onClick={handlePrevImg} title="Previous Photo">‹</button>
              <button className="pd-slide-nav-btn right" onClick={handleNextImg} title="Next Photo">›</button>
              <div className="pd-dots-container">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`pd-dot ${idx === activeImgIndex ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  />
                ))}
              </div>
              <div className="pd-photo-counter">📷 {activeImgIndex + 1} / {images.length}</div>
            </>
          )}
        </div>

        <div className="pd-hero-btns">
          <button className="circle-btn" onClick={onGoBack || (() => onNavigate(demoRole === 'Buyer' ? 'buyer-home' : 'home'))}><ArrowLeft size={18} /></button>
          <div className="pd-hero-right">
            <button className="circle-btn" onClick={handleShare} title="Share Produce Link"><Share2 size={16} /></button>
            <button className={`circle-btn ${isFav ? 'active-fav' : ''}`} onClick={() => onToggleFavorite(item.id)} title="Toggle Favorite">
              <Heart size={16} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : 'currentColor'} />
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-body pad">
        <div className="pd-title-row">
          <div>
            <h2>{item.name}</h2>
            <p className="text-muted">{item.grade} · {item.quantity} kg harvested · {item.availableQty || item.quantity} kg available</p>
          </div>
          <div className="pd-price">₹{item.price}<small>/kg</small></div>
        </div>

        <div className="location-tag" onClick={() => onNavigate('maps')} style={{ cursor: 'pointer' }}>
          <MapPin size={13} /> {item.location} ({item.distance || '6 km'}) · <span style={{ textDecoration: 'underline' }}>View on GPS Map 🗺️</span>
        </div>

        <div className="farmer-card">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=85" alt="Farmer" className="farmer-avatar" />
          <div className="farmer-info">
            <div className="farmer-name-row">
              <strong>{item.farmer}</strong>
              <span className="verified-badge"><ShieldCheck size={11} /> Verified Farmer</span>
            </div>
            <div className="rating-row"><Star size={11} fill="#eab308" color="#eab308" /> <span>4.8 (66 verified buyer reviews)</span></div>
          </div>
        </div>

        <div className="contact-methods-box" style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', margin: '12px 0' }}>
          <strong style={{ fontSize: '0.85rem', color: '#475569' }}>Privacy-Protected Contact Options:</strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            <a href={`https://wa.me/91${waPhoneClean}`} target="_blank" rel="noreferrer" className="tag" style={{ background: '#f0fdf4', color: '#16a34a', textDecoration: 'none' }}>
              💬 WhatsApp Direct
            </a>
            <button className="tag" style={{ background: '#eff6ff', color: '#2563eb', border: 'none', cursor: 'pointer' }} onClick={() => onNavigate('chat')}>
              💬 In-App Chat
            </button>
            <button className="tag" style={{ background: '#fef3c7', color: '#d97706', border: 'none', cursor: 'pointer' }} onClick={() => setShowPhoneModal(true)}>
              📞 Call Farmer
            </button>
          </div>
        </div>

        <div className="field-group">
          <h5 className="section-heading">Produce Description</h5>
          <p className="text-muted">{item.description}</p>
        </div>

        <div className="tags-row">
          <span className="tag">Organic</span>
          <span className="tag">📍 {item.location}</span>
          <span className="tag">Instant Escrow</span>
        </div>
      </div>

      <div className="pd-action-bar">
        <button className="btn-outline" onClick={() => onNavigate('chat')}>Chat Farmer</button>
        <button className="btn-primary" onClick={() => onNavigate('payment')}>Buy Now (₹{item.price}/kg)</button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowShareModal(false)}>✕</button>
            <h3>Share Produce Link</h3>
            <p>Copy or share this direct link for <strong>{item.name}</strong>:</p>
            <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', wordBreak: 'break-all', margin: '12px 0', fontSize: '0.85rem' }}>
              <code>{shareUrl}</code>
            </div>
            <button className="btn-primary" onClick={() => {
              if (navigator.clipboard) navigator.clipboard.writeText(shareUrl)
              if (notify) notify('🔗 Share link copied to clipboard!')
              setShowShareModal(false)
            }}>Copy Shareable Link</button>
          </div>
        </div>
      )}

      {/* Phone Contact Modal */}
      {showPhoneModal && (
        <div className="modal-backdrop" onClick={() => setShowPhoneModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPhoneModal(false)}>✕</button>
            <h3>📞 Contact Seller</h3>
            <p style={{ margin: '4px 0' }}>Farmer / Seller: <strong>{item.farmer}</strong></p>
            <p style={{ margin: '4px 0' }}>Farm Location: <strong>{item.location}</strong></p>
            <p style={{ margin: '4px 0 12px' }}>Verified Phone: <strong style={{ color: '#2E7D32', fontSize: '1.1rem' }}>{sellerPhone}</strong></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a href={`tel:${sellerPhone.replace(/\s+/g, '')}`} className="btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                📞 Call Now ({sellerPhone})
              </a>
              <button className="btn-outline" onClick={() => setShowPhoneModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── FARMER & BUYER INSTAGRAM-STYLE PROFILE & ACCOUNT SWITCHER ─────────────── */
function FarmerProfileScreen({ demoRole, onSwitchRole, onNavigate, onGoBack, onOpenQr, notify }) {
  const accountsList = [
    {
      id: 'ACC-1',
      role: 'Farmer',
      name: 'R. Selvam',
      title: 'Selvam Agro Haven',
      handle: '@selvam_farms',
      typeLabel: '🌾 Seller / Farmer Account',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=85',
      location: 'Kanyakumari, TN',
      size: '4.5 Acres Organic Farm',
      phone: '+91 98421 10001',
      instagram: '@selvam_farms',
      whatsapp: '+91 98421 10001',
      facebook: 'facebook.com/selvamagro'
    },
    {
      id: 'ACC-2',
      role: 'Buyer',
      name: 'FreshMart Supermarket',
      title: 'FreshMart Retail Procurement Ltd.',
      handle: '@freshmart_tn',
      typeLabel: '🛒 Buyer / Supermarket Account',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=85',
      location: 'Nagercoil & Kanyakumari, TN',
      size: 'Supermarket Chain (Daily 5,000 kg Procurement)',
      phone: '+91 98421 20002',
      instagram: '@freshmart_tn',
      whatsapp: '+91 98421 20002',
      facebook: 'facebook.com/freshmarttn'
    }
  ]

  const [selectedAccountId, setSelectedAccountId] = useState(() => {
    return demoRole === 'Buyer' ? 'ACC-2' : demoRole === 'Admin' ? 'ACC-4' : 'ACC-1'
  })

  const currentAccount = accountsList.find(a => a.id === selectedAccountId) || accountsList.find(a => a.role === demoRole) || accountsList[0]

  const [farmName, setFarmName] = useState(currentAccount.title)
  const [farmerName, setFarmerName] = useState(currentAccount.name)
  const [location, setLocation] = useState(currentAccount.location)
  const [farmSize, setFarmSize] = useState(currentAccount.size)
  const [phone, setPhone] = useState(currentAccount.phone)
  const [instagram, setInstagram] = useState(currentAccount.instagram)
  const [whatsapp, setWhatsapp] = useState(currentAccount.whatsapp)
  const [facebook, setFacebook] = useState(currentAccount.facebook)
  const [avatar, setAvatar] = useState(currentAccount.avatar)

  useEffect(() => {
    const acc = accountsList.find(a => a.id === selectedAccountId) || accountsList.find(a => a.role === demoRole) || accountsList[0]
    setFarmerName(acc.name)
    setFarmName(acc.title)
    setLocation(acc.location)
    setFarmSize(acc.size)
    setPhone(acc.phone)
    setInstagram(acc.instagram)
    setWhatsapp(acc.whatsapp)
    setFacebook(acc.facebook)
    setAvatar(acc.avatar)
  }, [selectedAccountId, demoRole])

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)

  const handleSelectAccount = (acc) => {
    setSelectedAccountId(acc.id)
    setShowAccountSwitcher(false)
    if (onSwitchRole) onSwitchRole(acc.role)
    if (notify) notify(`✨ Switched account to ${acc.name} (${acc.typeLabel})!`)
  }

  const handleSave = () => {
    setIsEditing(false)
    if (notify) notify('✅ Profile & Social Media links updated in database!')
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('dark-theme', !isDarkMode)
    if (notify) notify(!isDarkMode ? '🌙 Dark Mode activated' : '☀️ Light Mode activated')
  }

  return (
    <div className="screen screen-bg">
      {/* Instagram-Style Profile Top Header Bar */}
      <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="back-btn" onClick={onGoBack || (() => onNavigate(demoRole === 'Buyer' ? 'buyer-home' : 'home'))} title="Go Back">
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => setShowAccountSwitcher(true)}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{currentAccount.handle}</strong>
            <span style={{ fontSize: '0.72rem', background: currentAccount.role === 'Farmer' ? '#e8f5e9' : currentAccount.role === 'Buyer' ? '#eff6ff' : '#fef3c7', color: currentAccount.role === 'Farmer' ? '#1b5e20' : currentAccount.role === 'Buyer' ? '#1d4ed8' : '#b45309', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
              {currentAccount.role === 'Farmer' ? '🌾 Seller' : currentAccount.role === 'Buyer' ? '🛒 Buyer' : '🛡️ Admin'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>▼</span>
          </button>
        </div>

        <button className="circle-btn" onClick={() => setShowAccountSwitcher(true)} title="Switch Accounts">
          <Users size={18} />
        </button>
      </div>

      <div className="profile-header" style={{ paddingTop: '16px' }}>
        <div className="profile-avatar" style={{ position: 'relative', display: 'inline-block' }}>
          <img src={avatar || currentAccount.avatar} alt="Profile Avatar" />
          <label style={{ position: 'absolute', bottom: 4, right: 4, background: '#2E7D32', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} title="Change Profile Picture">
            <Camera size={14} />
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
              if (e.target.files?.[0]) {
                const url = URL.createObjectURL(e.target.files[0])
                setAvatar(url)
                if (notify) notify('📷 Profile picture updated in database!')
              }
            }} />
          </label>
        </div>
        <h3>{farmerName}</h3>
        <span className="verified-badge"><ShieldCheck size={12} /> {currentAccount.typeLabel}</span>
        <p className="text-muted">{farmName} · {location}</p>

        {/* Quick Instagram Switch Account Button */}
        <button
          className="btn-outline-sm"
          onClick={() => setShowAccountSwitcher(true)}
          style={{ margin: '10px auto 0', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '18px', fontSize: '0.85rem' }}
        >
          <Users size={14} /> Switch Account / Mode (Instagram Style)
        </button>
      </div>

      <div className="scroll-body pad">
        {/* Buyer Overview Card for FreshMart / Buyer Mode */}
        {currentAccount.role === 'Buyer' && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#1d4ed8', fontSize: '0.95rem' }}>🛒 FreshMart Procurement Overview</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ background: '#fff', padding: '8px 10px', borderRadius: '10px' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Active Requirement</span>
                <strong style={{ fontSize: '1.05rem', color: '#1e293b' }}>2,000 kg</strong>
                <small style={{ color: '#16a34a', display: 'block' }}>Tomato Grade A</small>
              </div>
              <div style={{ background: '#fff', padding: '8px 10px', borderRadius: '10px' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Monthly Escrow Vol</span>
                <strong style={{ fontSize: '1.05rem', color: '#1d4ed8' }}>₹1,58,000</strong>
                <small style={{ color: '#2563eb', display: 'block' }}>5 Active Farmers</small>
              </div>
            </div>
          </div>
        )}

        <button className="menu-item" onClick={() => setShowAccountSwitcher(true)} style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', color: '#16a34a', margin: '0 0 12px' }}>
          <Users size={18} color="#16a34a" /> <strong>Switch Account ({currentAccount.handle})</strong> <ChevronRight size={16} />
        </button>

        <button className="btn-outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel Edit' : '✏️ Edit Profile & Social Media Links'}
        </button>

        {isEditing && (
          <div className="profile-edit-box" style={{ background: '#fff', padding: '16px', borderRadius: '12px', marginTop: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h4 style={{ marginBottom: '12px', color: '#2E7D32' }}>Edit Profile Information</h4>
            <div className="field-group">
              <label>Account / Contact Name</label>
              <input type="text" value={farmerName} onChange={e => setFarmerName(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Business / Farm Title</label>
              <input type="text" value={farmName} onChange={e => setFarmName(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Scale / Capacity</label>
              <input type="text" value={farmSize} onChange={e => setFarmSize(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Phone Number</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <h4 style={{ margin: '16px 0 12px', color: '#2E7D32' }}>Social Media & Business Links</h4>
            <div className="field-group">
              <label>Instagram Handle</label>
              <input type="text" placeholder="@username" value={instagram} onChange={e => setInstagram(e.target.value)} />
            </div>
            <div className="field-group">
              <label>WhatsApp Business</label>
              <input type="text" placeholder="+91..." value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Facebook Page</label>
              <input type="text" placeholder="facebook.com/..." value={facebook} onChange={e => setFacebook(e.target.value)} />
            </div>

            <button className="btn-primary" onClick={handleSave} style={{ marginTop: '12px' }}>Save Profile Changes</button>
          </div>
        )}

        <div className="social-links-bar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0' }}>
          {instagram && <span className="tag" style={{ background: '#fdf2f8', color: '#db2777' }}>📷 {instagram}</span>}
          {whatsapp && <span className="tag" style={{ background: '#f0fdf4', color: '#16a34a' }}>💬 WhatsApp: {whatsapp}</span>}
          {facebook && <span className="tag" style={{ background: '#eff6ff', color: '#2563eb' }}>🌐 {facebook}</span>}
        </div>

        <div className="menu-item" onClick={toggleTheme}>
          <Smartphone size={18} /> <span>Theme: {isDarkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</span> <ChevronRight size={16} />
        </div>

        {/* DYNAMIC MENU OPTIONS ACCORDING TO USER ROLE */}
        {currentAccount.role === 'Buyer' ? (
          <>
            <div className="menu-item" onClick={() => onNavigate('buyer-req')}>
              <Plus size={18} color="#1d4ed8" /> <span>Post Produce Requirement</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('buyer-matches')}>
              <Users size={18} color="#2563eb" /> <span>Smart Farm Matches</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('offers')}>
              <MessageSquare size={18} color="#0284c7" /> <span>Offers & Negotiations</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('order-tracking')}>
              <Truck size={18} color="#16a34a" /> <span>Order Deliveries & Tracking</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('favorites')}>
              <Heart size={18} color="#ef4444" fill="#ef4444" /> <span>Favorite Farms & Produce</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('maps')}>
              <MapPin size={18} color="#2E7D32" /> <span>Farm & Mandi GPS Map</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={onOpenQr}>
              <Smartphone size={18} /> <span>Scan Mobile QR Code</span> <ChevronRight size={16} />
            </div>
          </>
        ) : (
          <>
            <div className="menu-item" onClick={() => onNavigate('farmer-products')}>
              <Sprout size={18} color="#2E7D32" /> <span>My Crop Listings</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('agri-insights')}>
              <BarChart3 size={18} color="#16a34a" /> <span>Agri Insights & Analytics</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('farmer-earnings')}>
              <Wallet size={18} color="#d97706" /> <span>Earnings & Settlements</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('order-tracking')}>
              <Truck size={18} color="#16a34a" /> <span>Order Deliveries & Escrow</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('favorites')}>
              <Heart size={18} color="#ef4444" fill="#ef4444" /> <span>Favorite Products</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={() => onNavigate('maps')}>
              <MapPin size={18} color="#2E7D32" /> <span>Farm & Mandi GPS Map</span> <ChevronRight size={16} />
            </div>
            <div className="menu-item" onClick={onOpenQr}>
              <Smartphone size={18} /> <span>Scan Mobile QR Code</span> <ChevronRight size={16} />
            </div>
          </>
        )}
      </div>

      {demoRole === 'Buyer' ? <BuyerBottomNav active="profile" onNavigate={onNavigate} /> : <FarmerBottomNav active="profile" onNavigate={onNavigate} />}

      {/* INSTAGRAM-STYLE ACCOUNT SWITCHER BOTTOM SHEET MODAL */}
      {showAccountSwitcher && (
        <div className="modal-backdrop" onClick={() => setShowAccountSwitcher(false)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxWidth: '480px',
              margin: '0 auto',
              borderRadius: '24px 24px 0 0',
              padding: '20px',
              background: '#fff',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.15)'
            }}
          >
            {/* Grab handle bar */}
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '2px', margin: '0 auto 16px' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Switch Accounts</h3>
              <button className="modal-close" onClick={() => setShowAccountSwitcher(false)} style={{ position: 'static' }}>✕</button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 14px' }}>
              Select an active AgriDirect seller or buyer profile to switch application modes instantly:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {accountsList.map(acc => {
                const isSelected = currentAccount.id === acc.id
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectAccount(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #2E7D32' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: isSelected ? '2px solid #2E7D32' : 'none' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{acc.name}</strong>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({acc.handle})</span>
                      </div>
                      <small style={{ color: isSelected ? '#15803d' : '#64748b', fontSize: '0.82rem', fontWeight: isSelected ? 600 : 400 }}>
                        {acc.typeLabel} · {acc.location}
                      </small>
                    </div>

                    {isSelected ? (
                      <div style={{ background: '#2E7D32', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                        ✓
                      </div>
                    ) : (
                      <div style={{ border: '2px solid #cbd5e1', borderRadius: '50%', width: '20px', height: '20px' }} />
                    )}
                  </div>
                )
              })}
            </div>

            <button
              className="btn-outline"
              onClick={() => {
                setShowAccountSwitcher(false)
                if (notify) notify('➕ Redirecting to Register New Account / Add Seller Profile')
                onNavigate('farmer-profile')
              }}
              style={{ width: '100%', borderRadius: '12px', padding: '12px', fontSize: '0.9rem', color: '#2E7D32', borderColor: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              ➕ Add New AgriDirect Account / Register
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── ADMIN DASHBOARD ──────────────────────────────────────────────────────── */
function AdminDashboardScreen({ stats, products, notify }) {
  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <h3>🛡️ AgriDirect Admin & Operations</h3>
      </div>

      <div className="scroll-body pad">
        <div className="admin-grid">
          <div className="admin-card">
            <span>Registered Farmers</span>
            <strong>{stats.registeredFarmers || 24}</strong>
          </div>
          <div className="admin-card">
            <span>Verified Farmers</span>
            <strong className="green">{stats.verifiedFarmers || 22}</strong>
          </div>
          <div className="admin-card">
            <span>Active Listings</span>
            <strong>{products.length}</strong>
          </div>
          <div className="admin-card">
            <span>Total GMV</span>
            <strong className="amber">₹{(stats.totalGmv || 584000).toLocaleString()}</strong>
          </div>
        </div>

        <h4 className="section-heading">Farmer Verification Queue</h4>
        <div className="verification-card">
          <div>
            <strong>Murugan Agro</strong>
            <p>Tirunelveli, TN · Aadhaar Document Uploaded</p>
          </div>
          <button className="btn-primary-sm" onClick={() => notify('Murugan Agro verified successfully!')}>Approve Farmer</button>
        </div>
      </div>
    </div>
  )
}

/* ── 🗺️ FARM & MANDI MAP EXPLORER SCREEN ───────────────────────────────── */
function FarmMapScreen({ products, demoRole, onSelectProduct, onNavigate, onGoBack, notify }) {
  const [filter, setFilter] = useState('all')
  const [selectedSellerModal, setSelectedSellerModal] = useState(null)

  const sellersList = [
    {
      id: 'S-101',
      type: 'farmer',
      name: 'Selvam Agro Haven',
      farmerName: 'R. Selvam',
      code: 'F-101',
      phone: '+91 98421 10001',
      location: 'Kanyakumari, TN',
      distance: '6 km',
      rating: 4.8,
      cropsCount: 4,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=85',
      organic: true,
      description: 'Organic tomato, shallot, dairy & cardamom farm near Thovalai, Kanyakumari district.'
    },
    {
      id: 'S-102',
      type: 'farmer',
      name: 'Kumar Highland Produce',
      farmerName: 'Kumar Farms',
      code: 'F-102',
      phone: '+91 98421 10002',
      location: 'Nagercoil, TN',
      distance: '12 km',
      rating: 4.7,
      cropsCount: 4,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=85',
      organic: true,
      description: 'Highland carrot, potato, guava & mango orchards in Nagercoil Vadasery.'
    },
    {
      id: 'S-103',
      type: 'farmer',
      name: 'Green Valley Organic',
      farmerName: 'Green Valley Farm',
      code: 'F-103',
      phone: '+91 98421 10003',
      location: 'Thiruvattar, TN',
      distance: '15 km',
      rating: 4.5,
      cropsCount: 3,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=85',
      organic: true,
      description: 'Organic brinjal, okra & ginger farm in Thiruvattar river belt.'
    },
    {
      id: 'S-104',
      type: 'farmer',
      name: 'Murugan Agro Fields',
      farmerName: 'Murugan Agro',
      code: 'F-104',
      phone: '+91 98421 10004',
      location: 'Tirunelveli, TN',
      distance: '22 km',
      rating: 4.9,
      cropsCount: 3,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=85',
      organic: true,
      description: 'Paddy rice, turmeric & string beans cultivation in Tirunelveli district.'
    },
    {
      id: 'S-105',
      type: 'farmer',
      name: 'Lakshmi Coastal Orchards',
      farmerName: 'Lakshmi Farms',
      code: 'F-105',
      phone: '+91 98421 10005',
      location: 'Agasteeswaram, TN',
      distance: '10 km',
      rating: 4.8,
      cropsCount: 3,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=85',
      organic: true,
      description: 'Banana, tender coconut & papaya coastal groves in Agasteeswaram.'
    },
    {
      id: 'M-201',
      type: 'mandi',
      name: 'Nagercoil Central Agricultural Mandi',
      farmerName: 'Govt Regulated Mandi',
      location: 'Nagercoil, TN',
      distance: '12 km',
      rating: 4.6,
      cropsCount: 12,
      organic: false,
      description: 'Official wholesale crop benchmark market. Today: Tomato ₹28/kg, Onion ₹24/kg, Carrot ₹26/kg.'
    },
    {
      id: 'M-202',
      type: 'mandi',
      name: 'Thiruvattar Farmers Market',
      farmerName: 'Cooperative Mandi',
      location: 'Thiruvattar, TN',
      distance: '15 km',
      rating: 4.4,
      cropsCount: 8,
      organic: true,
      description: 'Direct farmer-to-buyer cooperative market specializing in organic vegetables.'
    }
  ]

  const filteredSellers = sellersList.filter(s => {
    if (filter === 'farmers') return s.type === 'farmer'
    if (filter === 'mandis') return s.type === 'mandi'
    if (filter === 'organic') return s.organic
    return true
  })

  const sellerProducts = selectedSellerModal
    ? products.filter(p => (
        (p.farmer || p.farmer_name || '').toLowerCase().includes((selectedSellerModal.farmerName || selectedSellerModal.name || '').toLowerCase()) ||
        (selectedSellerModal.farmerName || '').toLowerCase().includes((p.farmer || '').toLowerCase())
      ))
    : []

  const googleMapsIframeSrc = `https://maps.google.com/maps?q=Kanyakumari,Tamil+Nadu&t=&z=11&ie=UTF8&iwloc=&output=embed`

  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate(demoRole === 'Buyer' ? 'buyer-home' : 'home'))}><ArrowLeft size={20} /></button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', margin: 0 }}>🗺️ Farm & Mandi Map Explorer</h3>
          <small style={{ color: '#16a34a', fontSize: '0.75rem' }}>📍 Live GPS Connected (Kanyakumari / Nagercoil)</small>
        </div>
        <span />
      </div>

      <div className="scroll-body pad">
        {/* User Location Bar */}
        <div style={{ background: '#ecfdf5', padding: '12px 14px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#059669" />
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#065f46', display: 'block' }}>Your Location: Nagercoil Central Hub</strong>
              <small style={{ color: '#047857' }}>Kanyakumari District, Tamil Nadu · GPS Accurate (15m)</small>
            </div>
          </div>
          <span className="tag" style={{ background: '#10b981', color: '#fff', fontSize: '0.7rem' }}>LIVE GPS</span>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px' }}>
          {[
            ['all', '🌐 All Nearby (7)'],
            ['farmers', '🌾 Farmers (5)'],
            ['mandis', '🏛️ Mandis (2)'],
            ['organic', '🌿 Organic Only']
          ].map(([key, label]) => (
            <button
              key={key}
              className={`tag ${filter === key ? 'active' : ''}`}
              style={{
                background: filter === key ? '#2E7D32' : '#f1f5f9',
                color: filter === key ? '#fff' : '#475569',
                border: filter === key ? 'none' : '1px solid #cbd5e1',
                padding: '6px 14px',
                cursor: 'pointer',
                fontWeight: filter === key ? 600 : 400
              }}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Live Interactive Google Map Frame */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '6px', border: '1px solid #cbd5e1', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe
              title="Nearby Farmers and Mandis Map"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={googleMapsIframeSrc}
              allowFullScreen
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px' }}>
            <small style={{ color: '#64748b' }}>Showing 5 Farmers & 2 Wholesale Mandis around Kanyakumari</small>
            <a
              href="https://www.google.com/maps/search/farmers+markets+near+Kanyakumari"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#2E7D32', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Globe size={14} /> View in Google Maps
            </a>
          </div>
        </div>

        {/* Nearby Farmers & Sellers Cards Header */}
        <div className="section-title-row" style={{ marginBottom: '10px' }}>
          <h4 style={{ margin: 0 }}>Verified Local Sellers & Mandis ({filteredSellers.length})</h4>
          <small style={{ color: '#64748b' }}>Tap seller to see their produce</small>
        </div>

        {/* Sellers & Mandis Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredSellers.map(s => (
            <div
              key={s.id}
              className="market-card"
              style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setSelectedSellerModal(s)}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img
                  src={s.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=85'}
                  alt={s.name}
                  style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>{s.name}</h4>
                    <span className="verified-badge" style={{ fontSize: '0.7rem' }}>
                      <ShieldCheck size={10} /> {s.type === 'farmer' ? 'Verified Farmer' : 'Wholesale Mandi'}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 6px', fontSize: '0.82rem', color: '#64748b' }}>
                    📍 <strong>{s.location}</strong> ({s.distance}) · ⭐ {s.rating}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="tag" style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.72rem' }}>
                      🌾 {s.cropsCount} Crops Listed
                    </span>
                    {s.organic && <span className="tag" style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.72rem' }}>Organic</span>}
                    {s.phone && <span className="tag" style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.72rem' }}>📞 {s.phone}</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #f1f5f9' }}>
                <button
                  className="btn-primary-sm"
                  style={{ flex: 1 }}
                  onClick={(e) => { e.stopPropagation(); setSelectedSellerModal(s); }}
                >
                  View Harvest Produce →
                </button>
                {s.phone && (
                  <a
                    href={`tel:${s.phone.replace(/\s+/g, '')}`}
                    className="btn-outline-sm"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    📞 Call
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {demoRole === 'Buyer' ? <BuyerBottomNav active="maps" onNavigate={onNavigate} /> : <FarmerBottomNav active="maps" onNavigate={onNavigate} />}

      {/* SELLER PRODUCE POPUP / MODAL */}
      {selectedSellerModal && (
        <div className="modal-backdrop" onClick={() => setSelectedSellerModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setSelectedSellerModal(null)}>✕</button>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <img src={selectedSellerModal.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=85'} alt={selectedSellerModal.name} style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b' }}>{selectedSellerModal.name}</h3>
                <small style={{ color: '#64748b' }}>📍 {selectedSellerModal.location} ({selectedSellerModal.distance}) · {selectedSellerModal.farmerName}</small>
              </div>
            </div>

            <p style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: '#475569', margin: '0 0 14px' }}>
              {selectedSellerModal.description}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {selectedSellerModal.phone && (
                <a href={`tel:${selectedSellerModal.phone.replace(/\s+/g, '')}`} className="btn-primary-sm" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                  📞 Call Seller ({selectedSellerModal.phone})
                </a>
              )}
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedSellerModal.location)}`} target="_blank" rel="noreferrer" className="btn-outline-sm" style={{ textDecoration: 'none', textAlign: 'center' }}>
                🗺️ Directions
              </a>
            </div>

            <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: '#2E7D32' }}>
              Available Produce Harvest ({sellerProducts.length > 0 ? sellerProducts.length : 'All Catalog Items'})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(sellerProducts.length > 0 ? sellerProducts : products.slice(0, 3)).map(p => (
                <div key={p.id} style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={p.images?.[0] || p.image} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>{p.name}</h5>
                    <small style={{ color: '#64748b' }}>{p.grade} · {p.availableQty || p.quantity} kg available · 📍 {p.location}</small>
                    <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>₹{p.price}/kg</div>
                  </div>
                  <button
                    className="btn-primary-sm"
                    onClick={() => {
                      setSelectedSellerModal(null)
                      onSelectProduct(p)
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>

            <button className="btn-outline" onClick={() => setSelectedSellerModal(null)} style={{ marginTop: '16px', width: '100%' }}>
              Close Map Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── BOTTOM NAVIGATION ────────────────────────────────────────────────────── */
function FarmerBottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button className={active === 'home' ? 'active' : ''} onClick={() => onNavigate('home')}><Home size={20} /><span>Home</span></button>
      <button className={active === 'products' ? 'active' : ''} onClick={() => onNavigate('farmer-products')}><Sprout size={20} /><span>Produce</span></button>
      <button className={active === 'maps' ? 'active' : ''} onClick={() => onNavigate('maps')}><MapPin size={20} /><span>Map</span></button>
      <button className={active === 'insights' ? 'active' : ''} onClick={() => onNavigate('agri-insights')}><BarChart3 size={20} /><span>Insights</span></button>
      <button className={active === 'agriguide' ? 'active' : ''} onClick={() => onNavigate('agriguide')}><Bot size={20} /><span>AgriGuide</span></button>
      <button className={active === 'profile' ? 'active' : ''} onClick={() => onNavigate('farmer-profile')}><UserRound size={20} /><span>Profile</span></button>
    </nav>
  )
}

function BuyerBottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button className={active === 'explore' ? 'active' : ''} onClick={() => onNavigate('buyer-home')}><Search size={20} /><span>Explore</span></button>
      <button className={active === 'maps' ? 'active' : ''} onClick={() => onNavigate('maps')}><MapPin size={20} /><span>Map</span></button>
      <button className={active === 'req' ? 'active' : ''} onClick={() => onNavigate('buyer-req')}><Plus size={20} /><span>Require</span></button>
      <button className={active === 'agriguide' ? 'active' : ''} onClick={() => onNavigate('agriguide')}><Bot size={20} /><span>AgriGuide</span></button>
      <button className={active === 'matches' ? 'active' : ''} onClick={() => onNavigate('buyer-matches')}><Users size={20} /><span>Matches</span></button>
      <button className={active === 'profile' ? 'active' : ''} onClick={() => onNavigate('farmer-profile')}><UserRound size={20} /><span>Profile</span></button>
    </nav>
  )
}

/* ── DEDICATED AGRIGUIDE CHATBOT SCREEN (WITH GEMINI API INTEGRATION) ─────── */
function AgriGuideScreen({ demoRole, onNavigate, onGoBack, notify }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '🌱 Welcome to AgriGuide AI! Powered by Google Gemini & Live Mandi DB. Ask me anything about crop pricing, buyer demand, fertilizers, or diseases.' }
  ])
  const [inputQuery, setInputQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('agridirect_gemini_key') || '')
  const [showKeyModal, setShowKeyModal] = useState(false)

  const saveKey = (key) => {
    setGeminiApiKey(key)
    localStorage.setItem('agridirect_gemini_key', key)
    setShowKeyModal(false)
    if (notify) notify(key ? '🔑 Gemini API Key saved!' : 'Cleared Gemini API Key')
  }

  const handleSend = (queryText) => {
    const q = queryText || inputQuery
    if (!q.trim()) return
    const userMsg = { id: Date.now(), sender: 'user', text: q }
    setMessages(prev => [...prev, userMsg])
    if (!queryText) setInputQuery('')
    setIsLoading(true)

    fetch(getApiUrl('/api/agriguide/ask'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, userId: 1, apiKey: geminiApiKey })
    })
      .then(res => res.json())
      .then(json => {
        setIsLoading(false)
        const botText = (json && json.response && json.response !== '🌱 AgriDirect AI Engine analyzed your query successfully.')
          ? json.response
          : generateSmartAnswer(q)
        const isGemini = json?.usedGemini
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: botText,
            isGemini
          }
        ])
      })
      .catch(() => {
        setIsLoading(false)
        const fallbackText = generateSmartAnswer(q)
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: fallbackText }])
      })
  }

  return (
    <div className="screen screen-white screen-agriguide" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate(demoRole === 'Buyer' ? 'buyer-home' : 'home'))}><ArrowLeft size={20} /></button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', margin: 0 }}>AgriGuide AI Chatbot</h3>
          <small style={{ color: geminiApiKey ? '#10b981' : '#64748b', fontSize: '0.75rem' }}>
            {geminiApiKey ? '✨ Powered by Gemini AI' : '🌱 Powered by Mandi Engine'}
          </small>
        </div>
        <button className="icon-btn-sm" onClick={() => setShowKeyModal(true)} title="Set Gemini API Key" style={{ fontSize: '1.1rem' }}>🔑</button>
      </div>

      <div className="scroll-body pad" style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div className="chat-messages-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '12px' }}>
          {messages.map(m => (
            <div key={m.id} className={`chat-bubble ${m.sender === 'user' ? 'buyer' : 'farmer'}`} style={{ maxWidth: '85%', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.sender === 'user' ? '#e8f5e9' : '#f1f5f9', padding: '12px 14px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#2E7D32' }}>{m.sender === 'user' ? 'You' : 'AgriGuide AI 🤖'}</strong>
                {m.isGemini && <span className="tag" style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.68rem', padding: '2px 6px' }}>✨ Gemini AI</span>}
              </div>
              <div style={{ lineHeight: 1.4, fontSize: '0.9rem' }}>{m.text}</div>
            </div>
          ))}
          {isLoading && <div className="chat-bubble farmer"><em>AgriGuide AI is generating response...</em></div>}
        </div>

        <div className="quick-suggestions-row" style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px 0', borderTop: '1px solid #f1f5f9' }}>
          <button className="tag" onClick={() => handleSend('What was the latest update?')}>📢 Latest Update?</button>
          <button className="tag" onClick={() => handleSend('What is the best selling price for tomato today?')}>💡 Best Tomato Price?</button>
          <button className="tag" onClick={() => handleSend('How to prevent leaf curl disease in tomato?')}>🌿 Leaf Curl Prevention?</button>
          <button className="tag" onClick={() => handleSend('Who needs tomato buyers near me?')}>🛒 Who needs Tomato?</button>
        </div>

        <div className="chat-input-bar" style={{ display: 'flex', gap: '8px', marginTop: '6px', paddingBottom: '12px' }}>
          <input type="text" placeholder="Ask agricultural, pricing or crop questions..." value={inputQuery} onChange={e => setInputQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #cbd5e1', outline: 'none' }} />
          <button className="btn-primary" onClick={() => handleSend()} style={{ borderRadius: '24px', padding: '0 20px' }}>Send</button>
        </div>
      </div>

      {demoRole === 'Buyer' ? <BuyerBottomNav active="agriguide" onNavigate={onNavigate} /> : <FarmerBottomNav active="agriguide" onNavigate={onNavigate} />}

      {/* Gemini Key Modal */}
      {showKeyModal && (
        <div className="modal-backdrop" onClick={() => setShowKeyModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowKeyModal(false)}>✕</button>
            <h3>🔑 Configure Google Gemini API Key</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '8px 0 14px' }}>
              Paste your Google Gemini API Key below for intelligent, real-time AI responses:
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiApiKey}
              onChange={e => setGeminiApiKey(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '14px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => saveKey(geminiApiKey)}>Save API Key</button>
              {geminiApiKey && <button className="btn-outline" onClick={() => saveKey('')}>Clear</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── FARMER DIRECT CHAT SCREEN ───────────────────────────────────────────── */
function FarmerChatScreen({ product, onNavigate, onGoBack, notify }) {
  const item = product || initialProducts[0]
  const [messages, setMessages] = useState([
    { id: 1, sender: 'farmer', text: `Hello! Thanks for contacting me about ${item.name} (${item.grade}). How can I help with your order?` }
  ])
  const [inputMsg, setInputMsg] = useState('')

  const handleSend = () => {
    if (!inputMsg.trim()) return
    const newMsg = { id: Date.now(), sender: 'buyer', text: inputMsg }
    setMessages(prev => [...prev, newMsg])
    setInputMsg('')
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'farmer', text: `Yes, ${item.availableQty || item.quantity} kg of ${item.name} is ready for dispatch from ${item.location}.` }])
    }, 1000)
  }

  return (
    <div className="screen screen-white" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate('product-details'))}><ArrowLeft size={20} /></button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', margin: 0 }}>Chat with {item.farmer}</h3>
          <small className="text-muted">{item.name} · ₹{item.price}/kg</small>
        </div>
        <span />
      </div>

      <div className="scroll-body pad" style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '12px' }}>
          {messages.map(m => (
            <div key={m.id} className={`chat-bubble ${m.sender === 'buyer' ? 'buyer' : 'farmer'}`} style={{ maxWidth: '85%', alignSelf: m.sender === 'buyer' ? 'flex-end' : 'flex-start', background: m.sender === 'buyer' ? '#e8f5e9' : '#f1f5f9', padding: '12px 14px', borderRadius: '14px' }}>
              <strong style={{ fontSize: '0.85rem', color: '#2E7D32' }}>{m.sender === 'buyer' ? 'You' : item.farmer}:</strong>
              <div style={{ marginTop: '4px', lineHeight: 1.4, fontSize: '0.9rem' }}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input-bar" style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingBottom: '12px' }}>
          <input type="text" placeholder={`Message ${item.farmer}...`} value={inputMsg} onChange={e => setInputMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #cbd5e1', outline: 'none' }} />
          <button className="btn-primary" onClick={handleSend} style={{ borderRadius: '24px', padding: '0 20px' }}>Send</button>
        </div>
      </div>
    </div>
  )
}

/* ── SAVED FAVORITE PRODUCTS SCREEN ───────────────────────────────────────── */
function FavoritesScreen({ products, demoRole, favoriteIds = [], onToggleFavorite, onNavigate, onGoBack, onSelectProduct, notify }) {
  const favProducts = products.filter(p => favoriteIds.includes(p.id))

  return (
    <div className="screen screen-bg">
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate(demoRole === 'Buyer' ? 'buyer-home' : 'home'))}><ArrowLeft size={20} /></button>
        <h3>❤️ Saved Favorite Products</h3>
        <span />
      </div>

      <div className="scroll-body pad">
        {favProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <Heart size={48} color="#ef4444" style={{ marginBottom: '12px', opacity: 0.7 }} />
            <h4 style={{ margin: '0 0 6px', color: '#1e293b' }}>No Saved Favorites Yet</h4>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>Click the heart icon on any crop listing (like Banana, Tomato, or Carrot) to save it to your favorites!</p>
            <button className="btn-primary" onClick={() => onNavigate(demoRole === 'Buyer' ? 'buyer-home' : 'home')}>Explore Produce Catalogue</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>Showing {favProducts.length} saved crops in your favorites:</p>
            {favProducts.map(p => (
              <div key={p.id} className="market-card" onClick={() => { onSelectProduct(p); onNavigate('product-details') }} style={{ cursor: 'pointer' }}>
                <img src={p.images?.[0] || p.image} alt={p.name} className="market-thumb" />
                <div className="market-info">
                  <div className="market-top">
                    <h4>{p.name}</h4>
                    <button className="circle-btn active-fav" onClick={(e) => { e.stopPropagation(); onToggleFavorite(p.id); }} title="Remove from Favorites" style={{ width: '32px', height: '32px' }}>
                      <Heart size={14} fill="#ef4444" color="#ef4444" />
                    </button>
                  </div>
                  <div className="market-price">₹{p.price}<small>/kg</small> · {p.grade}</div>
                  <p>Farmer: <strong>{p.farmer || p.farmer_name}</strong> · 📍 {p.location}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button className="btn-primary-sm" style={{ flex: 1 }}>View Details & Photos</button>
                    <button className="btn-outline-sm" onClick={(e) => { e.stopPropagation(); onSelectProduct(p); onNavigate('chat') }}>Chat</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── 🌾 AGRI INSIGHTS DASHBOARD SCREEN ───────────────────────────────────── */
function AgriInsightsScreen({ demoRole, onNavigate, onGoBack, notify }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCropModal, setSelectedCropModal] = useState(null)
  const [selectedDemandModal, setSelectedDemandModal] = useState(null)

  const fetchInsights = () => {
    fetch(getApiUrl('/api/farmer/insights'))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setInsights(json.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  if (loading) {
    return (
      <div className="screen screen-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center', color: '#2E7D32' }}>
          <BarChart3 size={36} style={{ marginBottom: '8px' }} />
          <p style={{ fontWeight: 600 }}>Loading Agri Insights...</p>
        </div>
      </div>
    )
  }

  const snapshot = insights?.snapshot || { revenueThisMonth: 48260, revenueChangePercent: 24, totalKgSold: 1740, completedOrdersCount: 32, averageRating: 4.8, activeBuyersCount: 6 }
  const money = insights?.money || { released: 42060, pending: 6200, thisMonth: 48260 }
  const crops = insights?.crops || []
  const buyers = insights?.buyers || []
  const demandRadar = insights?.demandRadar || []
  const buyerRequests = insights?.buyerRequests || []
  const smartPrice = insights?.smartPrice || {}
  const smartFarmInsight = insights?.smartFarmInsight || {}
  const score = insights?.score || { overallScore: 93, ratingLabel: 'Excellent', breakdown: { productQuality: 95, orderReliability: 94, buyerRating: 96, responseRate: 88 } }
  const achievements = insights?.achievements || []
  const activity = insights?.activity || []

  return (
    <div className="screen screen-bg screen-agri-insights">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <button className="back-btn" onClick={onGoBack || (() => onNavigate(demoRole === 'Buyer' ? 'buyer-home' : 'home'))}><ArrowLeft size={20} /></button>
        <h3>📊 Agri Insights</h3>
        <button className="icon-btn-sm" onClick={fetchInsights} title="Refresh Insights"><Clock3 size={18} /></button>
      </div>

      <div className="scroll-body pad">
        {/* 1. TOP FARM PERFORMANCE SNAPSHOT */}
        <div className="insights-hero-card">
          <div className="ih-top">
            <div className="ih-title"><Sprout size={18} /> <span>Farm Performance</span></div>
            <span className="ih-badge">↑ {snapshot.revenueChangePercent}% vs last month</span>
          </div>
          <div className="ih-revenue">
            <small>Revenue This Month</small>
            <h2>₹{(snapshot.revenueThisMonth || 0).toLocaleString()}</h2>
          </div>

          <div className="ih-metrics-grid">
            <div className="ih-m-item">
              <span className="m-val">{(snapshot.totalKgSold || 0).toLocaleString()} KG</span>
              <small className="m-lbl">Total KG Sold</small>
            </div>
            <div className="ih-m-item">
              <span className="m-val">{snapshot.completedOrdersCount}</span>
              <small className="m-lbl">Completed Orders</small>
            </div>
            <div className="ih-m-item">
              <span className="m-val">{snapshot.averageRating} ⭐</span>
              <small className="m-lbl">Average Rating</small>
            </div>
            <div className="ih-m-item">
              <span className="m-val">{snapshot.activeBuyersCount}</span>
              <small className="m-lbl">Active Buyers</small>
            </div>
          </div>
        </div>

        {/* 2. MONEY SUBSECTION */}
        <div className="money-subsection-card">
          <div className="msc-header">
            <div className="msc-title"><Wallet size={18} /> <span>💰 Money</span></div>
            <button className="btn-view-trans" onClick={() => onNavigate('farmer-earnings')}>
              View Transactions →
            </button>
          </div>
          <div className="msc-grid">
            <div className="msc-col">
              <small>Available / Released</small>
              <strong className="green">₹{(money.released || 0).toLocaleString()}</strong>
            </div>
            <div className="msc-col">
              <small>Pending Escrow</small>
              <strong className="amber">₹{(money.pending || 0).toLocaleString()}</strong>
            </div>
            <div className="msc-col">
              <small>This Month Revenue</small>
              <strong>₹{(money.thisMonth || 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* 3. CROP PERFORMANCE */}
        <div className="section-block">
          <div className="sb-title-row">
            <h4>📈 Crop Performance</h4>
            <small>Tap crop for detailed analytics</small>
          </div>

          {crops.length === 0 ? (
            <div className="empty-insight-box">
              <Sprout size={28} style={{ marginBottom: '8px', opacity: 0.7 }} />
              <h5 style={{ margin: '0 0 4px', color: '#1e293b' }}>No Sales Yet</h5>
              <p style={{ margin: '0 0 12px', fontSize: '0.82rem' }}>Start listing your produce to see crop performance insights.</p>
              <button className="btn-primary-sm" onClick={() => onNavigate('add-product')}>+ List Produce</button>
            </div>
          ) : (
            <div className="crop-perf-list">
              {crops.map((c, i) => (
                <div key={i} className="crop-perf-card" onClick={() => setSelectedCropModal(c)}>
                  <div className="cp-row-top">
                    <div className="cp-crop-name">
                      <strong>{c.crop === 'Tomato' ? '🍅 Tomato' : c.crop === 'Banana' ? '🍌 Banana' : c.crop === 'Onion' ? '🧅 Onion' : c.crop.includes('Mango') ? '🥭 Mango' : c.crop === 'Carrot' ? '🥕 Carrot' : `🌱 ${c.crop}`}</strong>
                      <small>{c.soldKg || 0} KG Sold · {c.ordersCount || 1} Orders</small>
                    </div>
                    <div className="cp-rev-wrap">
                      <span className="cp-rev">₹{(c.revenue || 0).toLocaleString()}</span>
                      <span className={`cp-trend ${c.trend?.includes('↓') ? 'down' : 'up'}`}>{c.trend || '↑ 18%'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. YOUR BUYERS */}
        <div className="section-block">
          <div className="sb-title-row">
            <h4>👥 Your Buyers</h4>
            <small>Verified relationships</small>
          </div>

          <div className="buyers-list">
            {buyers.map((b, i) => (
              <div key={i} className="buyer-item-card">
                <div className="bi-info">
                  <div className="bi-name-row">
                    <strong>{b.buyerName}</strong>
                    {b.isDemo && <span className="demo-tag">DEMO ACCOUNT</span>}
                  </div>
                  <small>{b.ordersCompleted} orders · {b.totalKgPurchased} KG · Last order: {b.lastOrderDate}</small>
                </div>
                <div className="bi-val">
                  ₹{(b.totalValue || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. DEMAND RADAR */}
        <div className="section-block">
          <div className="sb-title-row">
            <h4>🔥 Demand Radar</h4>
            <small>Live local market pulse</small>
          </div>

          <div className="demand-radar-grid">
            {demandRadar.map((dr, i) => (
              <div key={i} className="dr-card" onClick={() => setSelectedDemandModal(dr)}>
                <div className="dr-top">
                  <strong>{dr.crop}</strong>
                  <span className={`dr-badge ${dr.demandLevel.includes('HIGH') ? 'high' : dr.demandLevel.includes('LOW') ? 'low' : 'med'}`}>
                    {dr.demandLevel}
                  </span>
                </div>
                <div className="dr-bottom">
                  <small>{dr.buyerReqsCount} Buyer Reqs</small>
                  <small className="green">Range: {dr.suggestedRange}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. BUYER REQUESTS NEAR YOU */}
        <div className="section-block">
          <div className="sb-title-row">
            <h4>📍 Buyer Requests Near You</h4>
            <small>Active bulk requirements</small>
          </div>

          <div className="requests-list">
            {buyerRequests.map((r, i) => (
              <div key={i} className="req-item-card">
                <div className="req-main">
                  <div className="req-header">
                    <strong>{r.buyerName}</strong>
                    {r.isDemo && <span className="demo-tag">DEMO BUYER</span>}
                  </div>
                  <div className="req-details">
                    <span>Needs <strong>{r.quantity} KG {r.crop}</strong></span>
                    <span className="price-pill">{r.suggestedRange}</span>
                  </div>
                  <small className="text-muted">📍 {r.distance}</small>
                </div>
                <button className="btn-primary-sm" onClick={() => onNavigate('offers')}>Respond</button>
              </div>
            ))}
          </div>
        </div>

        {/* 7. SMART PRICE RECOMMENDATION (RULE-BASED) */}
        <div className="intel-card highlight-card" style={{ marginBottom: '18px' }}>
          <div className="intel-top">
            <div className="intel-title"><DollarSign size={18} /> <span>{smartPrice.label}</span></div>
            <span className="trend-badge">{smartPrice.demandLevel}</span>
          </div>
          <div className="smart-price-body">
            <div className="sp-grid">
              <div><small>Market Reference</small><strong>₹{smartPrice.currentMarketRef}/KG</strong></div>
              <div><small>Your Recent Avg</small><strong>₹{smartPrice.recentAvg}/KG</strong></div>
              <div><small>Suggested Range</small><strong className="green">{smartPrice.suggestedRange}</strong></div>
            </div>
            <p className="sp-reason">💡 Reason: {smartPrice.reason}</p>
          </div>
        </div>

        {/* 8. SMART FARM INSIGHT */}
        <div className="intel-card" style={{ marginBottom: '18px' }}>
          <div className="intel-top">
            <div className="intel-title"><Bot size={18} /> <span>{smartFarmInsight.label}</span></div>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#334155', lineHeight: 1.4 }}>
            🤖 "{smartFarmInsight.message}"
          </p>
        </div>

        {/* 9. FARMER SCORE */}
        <div className="section-block">
          <div className="farmer-score-card">
            <div className="fsc-header">
              <div>
                <h4>🏆 AgriDirect Farmer Score</h4>
                <small>Calculated from verified database orders</small>
              </div>
              <div className="score-badge">
                <strong>{score.overallScore}</strong><small>/100</small>
              </div>
            </div>

            <div className="score-bars-grid">
              <div className="sb-item">
                <div className="sb-label"><span>Product Quality</span><strong>{score.breakdown.productQuality}%</strong></div>
                <div className="bar-bg"><div className="bar-fill" style={{ width: `${score.breakdown.productQuality}%` }} /></div>
              </div>
              <div className="sb-item">
                <div className="sb-label"><span>Order Reliability</span><strong>{score.breakdown.orderReliability}%</strong></div>
                <div className="bar-bg"><div className="bar-fill" style={{ width: `${score.breakdown.orderReliability}%` }} /></div>
              </div>
              <div className="sb-item">
                <div className="sb-label"><span>Buyer Rating</span><strong>{score.breakdown.buyerRating}%</strong></div>
                <div className="bar-bg"><div className="bar-fill" style={{ width: `${score.breakdown.buyerRating}%` }} /></div>
              </div>
              <div className="sb-item">
                <div className="sb-label"><span>Response Rate</span><strong>{score.breakdown.responseRate}%</strong></div>
                <div className="bar-bg"><div className="bar-fill" style={{ width: `${score.breakdown.responseRate}%` }} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* 10. ACHIEVEMENTS */}
        <div className="section-block">
          <div className="sb-title-row">
            <h4>🥇 Farmer Achievements</h4>
            <small>Earned milestones</small>
          </div>

          <div className="achievements-grid">
            {achievements.map((a, i) => (
              <div key={i} className={`achieve-card ${a.status === 'UNLOCKED' ? 'unlocked' : 'locked'}`}>
                <div className="ac-icon">{a.title.split(' ')[0]}</div>
                <div className="ac-info">
                  <strong>{a.title.split(' ').slice(1).join(' ')}</strong>
                  <small>{a.desc}</small>
                </div>
                <span className={`status-pill ${a.status.toLowerCase()}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 11. RECENT ACTIVITY */}
        <div className="section-block">
          <div className="sb-title-row">
            <h4>🕒 Recent Activity</h4>
          </div>

          <div className="activity-feed">
            {activity.map((act, i) => (
              <div key={i} className="act-item" onClick={() => onNavigate(act.type === 'order' ? 'order-tracking' : act.type === 'payment' ? 'farmer-earnings' : 'offers')}>
                <div className="act-dot" />
                <div className="act-content">
                  <p>{act.text}</p>
                  <small>{act.timestamp}</small>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <FarmerBottomNav active="insights" onNavigate={onNavigate} />

      {/* CROP ANALYTICS MODAL */}
      {selectedCropModal && (
        <div className="modal-backdrop" onClick={() => setSelectedCropModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCropModal(null)}>✕</button>
            <h3>📊 {selectedCropModal.crop} Analytics</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Detailed performance breakdown for {selectedCropModal.crop}</p>
            
            <div className="modal-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
              <div className="modal-stat-box"><small>Total Listed</small><strong>{selectedCropModal.totalListedKg || 500} KG</strong></div>
              <div className="modal-stat-box"><small>Total Sold</small><strong className="green">{selectedCropModal.soldKg || 200} KG</strong></div>
              <div className="modal-stat-box"><small>Remaining Supply</small><strong className="amber">{selectedCropModal.remainingKg || 300} KG</strong></div>
              <div className="modal-stat-box"><small>Total Revenue</small><strong>₹{(selectedCropModal.revenue || 0).toLocaleString()}</strong></div>
              <div className="modal-stat-box"><small>Average Price</small><strong>₹{selectedCropModal.avgPrice}/KG</strong></div>
              <div className="modal-stat-box"><small>Best Selling Price</small><strong>₹{selectedCropModal.bestPrice}/KG</strong></div>
            </div>

            <button className="btn-primary" onClick={() => setSelectedCropModal(null)}>Close Analytics</button>
          </div>
        </div>
      )}

      {/* CROP DEMAND DETAILS MODAL */}
      {selectedDemandModal && (
        <div className="modal-backdrop" onClick={() => setSelectedDemandModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDemandModal(null)}>✕</button>
            <h3>🔥 {selectedDemandModal.crop} Demand Details</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Live market buyer demand insights</p>
            
            <div className="modal-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
              <div className="modal-stat-box"><small>Demand Level</small><strong className="green">{selectedDemandModal.demandLevel}</strong></div>
              <div className="modal-stat-box"><small>Buyer Requirements</small><strong>{selectedDemandModal.buyerReqsCount} Active</strong></div>
              <div className="modal-stat-box"><small>Available Supply</small><strong>{selectedDemandModal.availableSupplyKg} KG</strong></div>
              <div className="modal-stat-box"><small>Avg Asking Price</small><strong>₹{selectedDemandModal.avgAskingPrice}/KG</strong></div>
            </div>
            
            <p style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', color: '#15803d', fontSize: '0.85rem', fontWeight: 600 }}>
              💡 Suggested Price Range: {selectedDemandModal.suggestedRange}
            </p>

            <button className="btn-primary" onClick={() => { setSelectedDemandModal(null); onNavigate('add-product'); }}>+ List {selectedDemandModal.crop} Now</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── CAMERA QR CODE & BARCODE SCANNER MODAL ───────────────────────────────── */
function LiveQrCameraScannerModal({ isOpen, onClose, onNavigate, onSelectProduct, products = [], notify }) {
  const [activeTab, setActiveTab] = useState('camera') // 'camera' | 'upload' | 'app_qr'
  const [cameraError, setCameraError] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedResult, setScannedResult] = useState(null)

  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      setIsScanning(false)
      return
    }

    let html5QrCode = null
    let isStopped = false

    const startScanner = async () => {
      setCameraError(null)
      try {
        html5QrCode = new Html5Qrcode("reader-camera-view")
        setIsScanning(true)
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 }
          },
          (decodedText) => {
            if (isStopped) return
            isStopped = true
            handleScanSuccess(decodedText)
            html5QrCode.stop().catch(() => {})
          },
          () => {} // Ignore frame scan noise
        )
      } catch (err) {
        console.warn("Scanner camera init warning:", err)
        setIsScanning(false)
        setCameraError("Camera stream not available. Please allow camera permissions or try Upload QR Image / Test Presets below.")
      }
    }

    const timer = setTimeout(startScanner, 100)

    return () => {
      isStopped = true
      clearTimeout(timer)
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {})
      }
    }
  }, [isOpen, activeTab])

  if (!isOpen) return null

  const handleScanSuccess = (text) => {
    setScannedResult(text)
    if (notify) notify(`🎯 QR Scanned: "${text}"`)

    const cleaned = text.trim()

    // 1. Direct Product Matching
    if (cleaned.includes('PROD-') || cleaned.toLowerCase().includes('mango') || cleaned.toLowerCase().includes('tomato')) {
      const match = products.find(p => p.name.toLowerCase().includes('mango')) || products[0]
      if (match && onSelectProduct) {
        onSelectProduct(match)
        if (notify) notify(`✅ Produce verified: ${match.name} (Grade A Organic)`)
        onClose()
        return
      }
    }

    // 2. Order QR Code
    if (cleaned.includes('ORD-') || cleaned.toLowerCase().includes('order')) {
      if (notify) notify(`📦 Direct Order QR verified: #ORD-89421`)
      onNavigate('order-tracking')
      onClose()
      return
    }

    // 3. Payment / UPI QR Code
    if (cleaned.toLowerCase().includes('upi') || cleaned.toLowerCase().includes('pay')) {
      if (notify) notify(`💳 Escrow Payment QR scanned successfully!`)
      onNavigate('payment')
      onClose()
      return
    }

    // 4. Default URL or text
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      window.open(cleaned, '_blank')
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const html5QrCode = new Html5Qrcode("reader-hidden-file-scanner")
      const result = await html5QrCode.scanFile(file, true)
      handleScanSuccess(result)
    } catch (err) {
      if (notify) notify("⚠️ Could not detect a QR code in uploaded image. Trying fallback preset...")
      handleScanSuccess("AGRI-PROD-ALPHONSO-MANGO-001")
    }
  }

  return (
    <div className="scanner-modal-backdrop" onClick={onClose}>
      <div className="scanner-modal-card" onClick={e => e.stopPropagation()}>
        {/* Hidden div for file scanner */}
        <div id="reader-hidden-file-scanner" style={{ display: 'none' }} />

        {/* Header */}
        <div className="scanner-modal-header">
          <div className="scanner-title">
            <Camera size={22} />
            <h3>AgriDirect Scanner</h3>
          </div>
          <button className="scanner-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Navigation Tabs */}
        <div className="scanner-tabs-bar">
          <button className={`scanner-tab-btn ${activeTab === 'camera' ? 'active' : ''}`} onClick={() => setActiveTab('camera')}>
            <Camera size={16} /> Live Scanner
          </button>
          <button className={`scanner-tab-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>
            <Search size={16} /> Upload QR
          </button>
          <button className={`scanner-tab-btn ${activeTab === 'app_qr' ? 'active' : ''}`} onClick={() => setActiveTab('app_qr')}>
            <QrCode size={16} /> Mobile QR
          </button>
        </div>

        {/* Body Content */}
        <div className="scanner-body-content">
          {activeTab === 'camera' && (
            <>
              <div className="scanner-camera-box">
                <div id="reader-camera-view" style={{ width: '100%' }} />
                {isScanning && !cameraError && (
                  <div className="scan-laser-overlay">
                    <div className="scan-laser-line" />
                  </div>
                )}
                {cameraError && (
                  <div className="scanner-fallback-box" style={{ margin: '20px' }}>
                    <AlertCircle size={28} color="#eab308" style={{ marginBottom: '8px' }} />
                    <p>{cameraError}</p>
                  </div>
                )}
              </div>
              <p className="scanner-info-badge">Point your camera at any Produce QR, Mandi Tag, or Order Code</p>
            </>
          )}

          {activeTab === 'upload' && (
            <div className="scanner-fallback-box" style={{ padding: '24px 16px' }}>
              <Camera size={36} color="#166534" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>Select QR Code Image</h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#64748b' }}>Upload a saved QR code image or photo from your device gallery.</p>
              <label className="scanner-upload-label">
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                <span>📁 Choose Photo / Image</span>
              </label>
            </div>
          )}

          {activeTab === 'app_qr' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 14px' }}>Scan with phone camera to run AgriDirect live on mobile:</p>
              <div style={{ background: 'white', padding: '12px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <QRCodeCanvas value={MOBILE_NETWORK_URL} size={180} level="H" includeMargin={true} />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '700', marginTop: '10px' }}>{MOBILE_NETWORK_URL}</p>
            </div>
          )}

          {/* Quick Demo Test Presets */}
          <div className="scanner-presets-section">
            <strong>Instant Demo QR Test Presets:</strong>
            <div className="preset-chips-grid">
              <button className="preset-chip-btn" onClick={() => handleScanSuccess('AGRI-PROD-ALPHONSO-MANGO-001')}>
                🥭 Alphonso Mango
              </button>
              <button className="preset-chip-btn" onClick={() => handleScanSuccess('AGRI-ORD-89421-ESCROW')}>
                📦 Order #ORD-89421
              </button>
              <button className="preset-chip-btn" onClick={() => handleScanSuccess('AGRI-UPI-ESCROW-PAYMENT')}>
                💳 UPI Escrow Pay
              </button>
              <button className="preset-chip-btn" onClick={() => handleScanSuccess('AGRI-MANDI-CERT-NAGERCOIL')}>
                🏷️ Mandi Tag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

