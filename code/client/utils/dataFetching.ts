import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchItems, updateItems } from '../api/itemsApi';
import { Item, ItemUpdate, UpdateResponse } from '../types/Item';

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
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
