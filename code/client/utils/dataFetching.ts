import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchItems, updateItems } from '../api/itemsApi';
import Item from '../types/Item';

export const fetchData = async (): Promise<Item[]> => {
  try {
    const storedItems = await AsyncStorage.getItem('storedItems');
    let data: Item[] = [];

    if (storedItems) {
      const updatedItemIds: number[] = JSON.parse(storedItems).map((item: Item) => item.id);
      const newData: Item[] = await updateItems(updatedItemIds);
      data = [...newData, ...JSON.parse(storedItems)]; // Merge new items with stored items
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
