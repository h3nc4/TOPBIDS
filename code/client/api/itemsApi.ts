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
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
