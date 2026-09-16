import { apiClient } from './client.js';
export const commerceApi = {
  catalog: () => apiClient.get('/catalog'),
  show: (showId) => apiClient.get(`/shows/${showId}`),
  quote: (showId, items) => apiClient.post(`/shows/${showId}/quote`, { items }),
  importPrices: (showId, csvText) => apiClient.post(`/shows/${showId}/import-prices`, { csvText }),
  book: (showId, items) => apiClient.post(`/shows/${showId}/bookings`, { items }),
  bookings: () => apiClient.get('/bookings'),
  booking: (id) => apiClient.get(`/bookings/${id}`)
};
