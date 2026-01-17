import { useEffect, useState } from 'react';
import api from './api';
import Login from './components/Login';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('stockmaster_token'));
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 0, price: 0 });

  // Busca os produtos apenas se estiver autenticado
  const fetchProducts = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("API Connection Error:", error);
      // Se o token expirou ou é inválido (Erro 401), desloga o usuário
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('stockmaster_token');
    setIsAuthenticated(false);
    setProducts([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      setNewProduct({ name: '', quantity: 0, price: 0 });
      fetchProducts();
    } catch (error) {
      alert("Error saving product. Check your session.");
    }
  };

  // Se não estiver logado, mostra apenas a tela de Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header / Navbar */}
      <header className="bg-azure shadow-md p-6 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight italic text-white">StockMaster ERP</h1>
            <p className="text-blue-100 text-sm">Secured Inventory Management</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block border-l border-blue-400 pl-4">
              <span className="text-xs uppercase font-semibold">User Status:</span>
              <p className="text-sm font-mono text-green-300 underline decoration-green-500">Authenticated</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-md shadow-red-900/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Section */}
          <aside className="lg:col-span-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">Register Item</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="productName">
                  Product Name
                </label>
                <input 
                  id="productName"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure focus:border-transparent outline-none transition"
                  value={newProduct.name} 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                  placeholder="e.g. Industrial Sensor" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="quantity">
                    Quantity
                  </label>
                  <input 
                    id="quantity"
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure focus:border-transparent outline-none transition"
                    value={newProduct.quantity} 
                    onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="price">
                    Unit Price
                  </label>
                  <input 
                    id="price"
                    type="number" step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure focus:border-transparent outline-none transition"
                    value={newProduct.price} 
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} 
                  />
                </div>
              </div>

              <button className="w-full bg-azure hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95">
                Save Product
              </button>
            </form>
          </aside>

          {/* Table Section */}
          <section className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700">Live Inventory</h2>
              <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200">
                Authorized Access Only
              </span>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 text-center text-azure animate-pulse font-bold">Synchronizing with SQL Server...</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-blue-50/50 transition">
                        <td className="px-6 py-4 font-mono text-sm text-gray-400">#{p.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.quantity < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {p.quantity} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">${p.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && products.length === 0 && (
                <div className="p-12 text-center text-gray-400 italic">No inventory data found.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;