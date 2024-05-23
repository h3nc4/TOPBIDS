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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchItems, updateItems } from '../api/itemsApi';
import { Item, ItemUpdate, UpdateResponse, JWT } from '../types/Item';
import { getGuards } from '../api/guardsApi';

export const getStoredItem = async (id: number): Promise<Item | null> => {
  try {
    const storedItems = await AsyncStorage.getItem('storedItems');
    if (storedItems) {
      const data: Array<Item> = JSON.parse(storedItems);
      return data.find((item) => item.id === id) || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting stored item:', error);
    return null;
  }
}

export const getUserJWT = async (): Promise<JWT | null> => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export const bestGuard = async (): Promise<string> => {
  const guards: string[] = await getGuards();
  console.log('Guards:', guards);

  // Function to ping a guard with a timeout
  const pingGuard = async (guard: string): Promise<number> => {
    const start = new Date().getTime();
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 5000); // 5 seconds timeout
    try {
      const response = await fetch(`http://${guard}:3000/status`, { method: 'GET', signal: ctrl.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        console.log(`Ping to ${guard} successful`);
        return new Date().getTime() - start; // Return the response time
      }
    } catch (error) {
      if (error instanceof Error)
        if (error.name === 'AbortError')
          console.log(`Ping to ${guard} timed out.`);
        else
          console.log(`Error pinging ${guard}:`, error);
      else
        console.log(`Unknown error pinging ${guard}`);
    }
    return Infinity; // If ping failed, return a very high response time
  };

  // Ping all guards and find the one with the lowest response time
  const pingResults = await Promise.all(
    guards.map(async (guard) => {
      const responseTime = await pingGuard(guard);
      return { guard, responseTime };
    })
  );

  // Find the guard with the minimum response time
  const bestGuard = pingResults.reduce((prev, curr) =>
    prev.responseTime < curr.responseTime ? prev : curr
  );

  console.log('Best guard:', bestGuard.guard);
  return `http://${bestGuard.guard}:3000`;
};

export const fetchData = async (): Promise<Array<Item>> => {
  try {
    const storedItems = await AsyncStorage.getItem('storedItems');
    let data: Array<Item> = [];
    if (storedItems && storedItems !== '[]') {
      data = await updateData(storedItems); // Update stored items
    } else {
      console.log('No stored items found');
      data = await fetchItems(); // Fetch all items
    }
    console.log('Writing items:', data);
    await AsyncStorage.setItem('storedItems', JSON.stringify(data)); // Store fetched items
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    const storedItems = await AsyncStorage.getItem('storedItems');
    return storedItems ? JSON.parse(storedItems) : [];
  }
};

const updateData = async (storedItems: string): Promise<Array<Item>> => {
  const myItems: Array<ItemUpdate> = JSON.parse(storedItems).map((item: Item) => ({ id: item.id, date: item.date }));
  const newData: UpdateResponse = await updateItems(myItems);
  const data: Array<Item> = JSON.parse(storedItems);
  newData.delete.forEach((id) => {
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      console.log('Deleting item:', data[index]);
      data.splice(index, 1);
    }
  });
  newData.update.forEach((item) => {
    const index = data.findIndex((oldItem) => oldItem.id === item.id);
    if (index !== -1) {
      console.log('Updating item:', item);
      data[index].date = item.date;
    }
  });
  newData.add.forEach((item) => {
    console.log('Adding item:', item);
    data.push(item);
  });
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
