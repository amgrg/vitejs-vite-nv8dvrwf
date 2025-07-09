import React, { useState, useEffect, useMemo } from 'react';
import { db } from './services/database';
import type { Store, Product } from './lib/supabase';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'home' | 'search' | 'stores'>('home');
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [storesData, productsData] = await Promise.all([
          db.getStores(),
          db.getProducts()
        ]);
        setStores(storesData);
        setProducts(productsData);
      } catch (err) {
        setError('Errore nel caricamento dei dati');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Search functionality
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      setView('search');
      try {
        setLoading(true);
        const results = await db.searchProducts(query);
        setSearchResults(results);
      } catch (err) {
        setError('Errore nella ricerca');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleProductClick = async (product: Product) => {
    try {
      await db.trackProductClick(product.id, searchTerm);
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  // Loading state
  if (loading && stores.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

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
              {loading && view === 'search' && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
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
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              {searchResults.length} risultati per "{searchTerm}"
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
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
                    {product.store_rating && (
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {product.store_rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      €{product.price}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">📍</span>
                      <span>{product.store_name}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {product.store_address}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      handleProductClick(product);
                      // Open Google Maps with store address
                      const address = encodeURIComponent(product.store_address || '');
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
                      window.open(mapsUrl, '_blank');
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📍 Vieni in negozio
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && searchResults.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nessun risultato trovato
              </h3>
              <p className="text-gray-600">
                Prova con termini di ricerca diversi
              </p>
            </div>
          )}
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
                      store.is_open
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {store.is_open ? '🟢 Aperto' : '🔴 Chiuso'}
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
                      Consegna in {store.delivery_time}
                    </span>
                  </div>
                  {store.phone && (
                    <div className="flex items-center mt-2">
                      <span className="mr-2">📞</span>
                      <span className="text-sm text-gray-600">
                        {store.phone}
                      </span>
                    </div>
                  )}
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  👀 Visualizza prodotti
                </button>
              </div>
            ))}
          </div>

          {stores.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nessun negozio trovato
              </h3>
              <p className="text-gray-600">
                I negozi partner verranno visualizzati qui
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;