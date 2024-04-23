import { API_URL } from '../.config';
import { Item, ItemUpdate, UpdateResponse } from '../types/Item';

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

export const updateItems = async (myItems: ItemUpdate[]): Promise<UpdateResponse> => {
  const localItems = JSON.stringify({ localItems: myItems });
  console.log('Updating items with sent IDs:', localItems);
  const response = await fetch(`${API_URL}/items/update/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: localItems,
  });
  const data: UpdateResponse = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error updating items:', data);
    throw new Error(JSON.stringify(data));
  }
  console.log('New items received:', data);
  return data;
};
