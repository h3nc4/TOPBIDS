import config from '../.config.json';
import { Item, ItemUpdate, UpdateResponse } from '../types/Item';

const API_URL = config.MASTER_URL + config.API_ROUTE;

export const fetchItems = async (): Promise<Array<Item>> => {
  const response = await fetch(`${API_URL}/items/`);
  const data: Array<Item> = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error fetching items:', data);
    throw new Error(JSON.stringify(data));
  }
  console.log('Items received:', data);
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const updateItems = async (myItems: Array<ItemUpdate>): Promise<UpdateResponse> => {
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
