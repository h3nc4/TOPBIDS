import { API_URL } from '../.config';
import Item from '../types/Item';

export const fetchItems = async (): Promise<Item[]> => {
  const response = await fetch(`${API_URL}/items/`);
  const data: Item[] = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error fetching items:', data);
    throw new Error(JSON.stringify(data));
  }
  console.log('Items received:', data);
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const updateItems = async (sentIds: number[]): Promise<Item[]> => {
  const ids = JSON.stringify({ ids: sentIds });
  console.log('Updating items with sent IDs:', ids);
  const response = await fetch(`${API_URL}/items/update/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: ids,
  });
  const data: Item[] = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error updating items:', data);
    throw new Error(JSON.stringify(data));
  }
  console.log('New items received:', data);
  return data;
};
