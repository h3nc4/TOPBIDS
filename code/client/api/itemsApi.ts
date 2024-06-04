/*
*  Copyright 2024 TopBids
* 
* This file is part of TopBids.
* 
* TopBids is free software: you can redistribute it and/or modify it
* under the terms of the GNU Affero General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option) any
* later version.
* 
* TopBids is distributed in the hope that it will be
* useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
* General Public License for more details.
* 
* You should have received a copy of the GNU Affero
* General Public License along with TopBids. If not, see
* <https://www.gnu.org/licenses/>.
*/

import config from '../.config.json';
import { Item, ItemUpdate, UpdateResponse, JWT } from '../types/Item';

const API_URL = config.MASTER_URL + '/api';

export const fetchItems = async (): Promise<Array<Item>> => {
  const response = await fetch(`${API_URL}/items/`);
  const data: Array<Item> = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error fetching items:', data);
    throw new Error(JSON.stringify(data));
  }
  console.log('Items received:', data);
  return data.map(item => ({ ...item, isActive: true }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

export const geyMyItems = async (JWT: JWT): Promise<Array<number>> => {
  const response = await fetch(`${API_URL}/items/my_items/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(JWT),
  });
  const data: Array<number> = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error fetching my items:', data);
    throw new Error(JSON.stringify(data));
  }
  console.log('My items received:', data);
  return data;
}

export const fetchSelectedItems = async (ids: Array<number>): Promise<Array<Item>> => {
  const response = await fetch(`${API_URL}/items/get_items/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids),
  });
  const data: Array<Item> = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error fetching selected items:', data);
    throw new Error(JSON.stringify(data));
  }
  console.log('Selected items received:', data);
  return data;
}

export const finishedItem = async (id: number): Promise<any> => {
  const response = await fetch(`${API_URL}/items/finished_item/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  if (!response.ok) {
    console.log('Error fetching payment status:', data);
    throw new Error(JSON.stringify(data));
  }
  return data;
}
