import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchItems, updateItems } from '../api/itemsApi';

export const fetchData = async () => {
  const storedItems = await AsyncStorage.getItem('storedItems');
  try {
    let data;
    if (storedItems) {
      newData = await updateItems(JSON.parse(storedItems).map(item => item.id)); // Send request to update items with stored IDs
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
    return storedItems ? JSON.parse(storedItems) : [];
  }
};
