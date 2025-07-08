import React, { useState, useMemo } from 'react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  storeId: number;
  storeName: string;
  storeAddress: string;
  inStock: boolean;
  rating: number;
}

interface Store {
  id: number;
  name: string;
  address: string;
  category: string;
  rating: number;
  isOpen: boolean;
  deliveryTime: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'home' | 'search' | 'stores'>('home');

  // Demo data
  const stores: Store[] = [
    {
      id: 1,
      name: 'Ferramenta Mazzotti',
      address: 'Via Garibaldi 45, Ravenna',
      category: 'Ferramenta',
      rating: 4.6,
      isOpen: true,
      deliveryTime: '15 min',
    },
    {
      id: 2,
      name: 'Profumeria Elisir',
      address: 'Corso Garibaldi 123, Ravenna',
      category: 'Bellezza',
      rating: 4.8,
      isOpen: true,
      deliveryTime: '20 min',
    },
    {
      id: 3,
      name: 'Libreria Dante',
      address: 'Via Cavour 67, Ravenna',
      category: 'Libri',
      rating: 4.7,
      isOpen: true,
      deliveryTime: '10 min',
    },
    {
      id: 4,
      name: 'Gastronomia Gourmet',
      address: 'Piazza del Popolo 8, Ravenna',
      category: 'Alimentari',
      rating: 4.9,
      isOpen: true,
      deliveryTime: '25 min',
    },
    {
      id: 5,
      name: 'Gelateria Dolce Freddo',
      address: 'Via Cavour 123, Ravenna',
      category: 'Gelati',
      rating: 4.5,
      isOpen: true,
      deliveryTime: '5 min',
    },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Martello carpentiere 500g',
      price: 18.5,
      category: 'Utensili',
      storeId: 1,
      storeName: 'Ferramenta Mazzotti',
      storeAddress: 'Via Garibaldi 45',
      inStock: true,
      rating: 4.6,
    },
    {
      id: 2,
      name: 'Cacciavite set 12 pezzi',
      price: 25.9,
      category: 'Utensili',
      storeId: 1,
      storeName: 'Ferramenta Mazzotti',
      storeAddress: 'Via Garibaldi 45',
      inStock: true,
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Profumo Chanel N°5 50ml',
      price: 89.0,
      category: 'Profumi',
      storeId: 2,
      storeName: 'Profumeria Elisir',
      storeAddress: 'Corso Garibaldi 123',
      inStock: true,
      rating: 4.8,
    },
    {
      id: 4,
      name: "Crema viso L'Oreal",
      price: 24.9,
      category: 'Cosmetici',
      storeId: 2,
      storeName: 'Profumeria Elisir',
      storeAddress: 'Corso Garibaldi 123',
      inStock: true,
      rating: 4.8,
    },
    {
      id: 5,
      name: "Elena Ferrante - L'amica geniale",
      price: 18.5,
      category: 'Narrativa',
      storeId: 3,
      storeName: 'Libreria Dante',
      storeAddress: 'Via Cavour 67',
      inStock: true,
      rating: 4.7,
    },
    {
      id: 6,
      name: 'Quaderno Moleskine A5',
      price: 24.9,
      category: 'Cartoleria',
      storeId: 3,
      storeName: 'Libreria Dante',
      storeAddress: 'Via Cavour 67',
      inStock: true,
      rating: 4.7,
    },
    {
      id: 7,
      name: 'Parmigiano Reggiano 1kg',
      price: 32.5,
      category: 'Formaggi',
      storeId: 4,
      storeName: 'Gastronomia Gourmet',
      storeAddress: 'Piazza del Popolo 8',
      inStock: true,
      rating: 4.9,
    },
    {
      id: 8,
      name: 'Olio extravergine 500ml',
      price: 24.5,
      category: 'Oli',
      storeId: 4,
      storeName: 'Gastronomia Gourmet',
      storeAddress: 'Piazza del Popolo 8',
      inStock: true,
      rating: 4.9,
    },
    {
      id: 9,
      name: 'Gelato artigianale 500ml',
      price: 8.5,
      category: 'Gelati',
      storeId: 5,
      storeName: 'Gelateria Dolce Freddo',
      storeAddress: 'Via Cavour 123',
      inStock: true,
      rating: 4.5,
    },
    {
      id: 10,
      name: 'Granita siciliana limone',
      price: 3.5,
      category: 'Granite',
      storeId: 5,
      storeName: 'Gelateria Dolce Freddo',
      storeAddress: 'Via Cavour 123',
      inStock: true,
      rating: 4.5,
    },
  ];

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.storeName.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [searchTerm, products]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      setView('search');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setView('home')}
            >
              <span className="text-2xl mr-2">🏪</span>
              <span className="text-2xl font-light">
                <span className="text-blue-500">Ama</span>
                <span className="text-red-500">city</span>
              </span>
            </div>
            <nav className="flex space-x-8">
              <button
                onClick={() => setView('home')}
                className={`text-sm font-medium ${
                  view === 'home'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => setView('stores')}
                className={`text-sm font-medium ${
                  view === 'stores'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🏪 Negozi
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Home View */}
      {view === 'home' && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-light text-gray-700 mb-4">
              <span className="text-blue-500">Ama</span>
              <span className="text-red-500">city</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Il Google per i negozi locali di Ravenna
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-8 px-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cerca prodotti nei negozi di Ravenna..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:shadow-lg focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Quick Search Tags */}
          <div className="mb-8">
            <div className="text-sm text-gray-500 mb-3">Prova a cercare:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'gelato',
                'libro',
                'martello',
                'profumo',
                'olio',
                'parmigiano',
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🏪</span>
              <div className="text-3xl font-bold text-gray-900">
                {stores.length}
              </div>
              <div className="text-sm text-gray-600">Negozi locali</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">📦</span>
              <div className="text-3xl font-bold text-gray-900">
                {products.length}+
              </div>
              <div className="text-sm text-gray-600">Prodotti disponibili</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">⏰</span>
              <div className="text-3xl font-bold text-gray-900">15min</div>
              <div className="text-sm text-gray-600">Consegna media</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results View */}
      {view === 'search' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cerca prodotti..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Results */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              {searchResults.length} risultati per "{searchTerm}"
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.category}
                  </p>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    €{product.price}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-1">📍</span>
                    <span>{product.storeName}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {product.storeAddress}
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  🛒 Aggiungi al carrello
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stores View */}
      {view === 'stores' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            🏪 Negozi Partner a Ravenna
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {store.name}
                    </h3>
                    <p className="text-sm text-gray-600">{store.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      store.isOpen
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {store.isOpen ? '🟢 Aperto' : '🔴 Chiuso'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">📍</span>
                    <span className="text-sm text-gray-600">
                      {store.address}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="mr-2">⭐</span>
                    <span className="text-sm text-gray-600">
                      {store.rating} stelle
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏰</span>
                    <span className="text-sm text-gray-600">
                      Consegna in {store.deliveryTime}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  👀 Visualizza prodotti
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
