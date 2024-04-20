import { API_URL } from '../.config';

export const fetchItems = async () => {
  const response = await fetch(`${API_URL}/items/`);
  const data = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error fetching items:', data);
    throw new Error(data);
  }
  console.log('Items received:', data);
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const updateItems = async (sentIds) => {
  ids = JSON.stringify({ ids: sentIds });
  console.log('Updating items with sent IDs:', ids);
  const response = await fetch(`${API_URL}/items/update/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: ids,
  });
  const data = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error updating items:', data);
    throw new Error(data);
  }
  console.log('New items received:', data);
  return data;
};
