// src/services/api.ts

/**
 * Función auxiliar para hacer fetch con el token JWT automáticamente.
 * Intercepta todas las peticiones y añade el header Authorization si el token existe.
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Obtenemos el token del localStorage (asegúrate de guardarlo con esta key al hacer login)
  const token = localStorage.getItem('token'); 
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Si hay un token, lo enviamos en el formato Bearer
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  // Manejo de errores global
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error en la petición: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Servicios de la API centralizados.
 * Úsalos en tus componentes en lugar de hacer fetch() directamente.
 */
export const apiService = {
  // --- 1. Autenticación y Admin ---
  loginAdmin: (data: any) => fetchWithAuth('/login', { method: 'POST', body: JSON.stringify(data) }),
  getUsers: () => fetchWithAuth('/admin/users'),
  createUser: (data: any) => fetchWithAuth('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string | number, data: any) => fetchWithAuth(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: string | number) => fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' }),

  // --- 2. Productos y Categorías ---
  getProducts: () => fetchWithAuth('/products'),
  createProduct: (data: any) => fetchWithAuth('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string | number, data: any) => fetchWithAuth(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string | number) => fetchWithAuth(`/products/${id}`, { method: 'DELETE' }),
  
  getCategories: () => fetchWithAuth('/categories'),
  createCategory: (data: any) => fetchWithAuth('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string | number, data: any) => fetchWithAuth(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string | number) => fetchWithAuth(`/categories/${id}`, { method: 'DELETE' }),

  // --- 3. Clientes ---
  loginClient: (data: any) => fetchWithAuth('/clients/login', { method: 'POST', body: JSON.stringify(data) }),
  registerClient: (data: any) => fetchWithAuth('/clients/register', { method: 'POST', body: JSON.stringify(data) }),
  getClients: () => fetchWithAuth('/clients'),
  getClientOrders: (id: string | number) => fetchWithAuth(`/clients/${id}/orders`),

  // --- 4. Pedidos (Orders) ---
  getOrders: () => fetchWithAuth('/orders'),
  getOrderById: (id: string | number) => fetchWithAuth(`/orders/${id}`),
  createOrder: (data: any) => fetchWithAuth('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id: string | number, status: string) => fetchWithAuth(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateOrderPayment: (id: string | number, data: any) => fetchWithAuth(`/orders/${id}/payment-reference`, { method: 'PUT', body: JSON.stringify(data) }),

  // --- 5. Configuraciones (Settings) ---
  getBcvRate: () => fetchWithAuth('/bcv-rate'),
  updateBcvRate: (rate: string) => fetchWithAuth('/bcv-rate', { method: 'PUT', body: JSON.stringify({ rate }) }),
  getLogo: () => fetchWithAuth('/settings/logo'),
  updateLogo: (url: string) => fetchWithAuth('/settings/logo', { method: 'PUT', body: JSON.stringify({ url }) }),
};
