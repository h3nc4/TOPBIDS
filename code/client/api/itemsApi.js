import { API_URL } from '../.config';

export const fetchItems = async () => {
  const response = await fetch(`${API_URL}/items/`);
  const data = await response.json();
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};
