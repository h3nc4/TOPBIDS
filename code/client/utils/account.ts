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
import { router } from 'expo-router';
import config from '../.config.json';

export const deactivateAccount = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const response = await fetch(`${config.MASTER_URL}/deactivate/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user}`
        }
      });
      if (response.ok) {
        await AsyncStorage.removeItem('user');
        router.replace('login');
      } else {
        const errorText = await response.text();
        console.error('Error deactivating account:', errorText);
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
    }
  };