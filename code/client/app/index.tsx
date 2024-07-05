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

import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import config from '../.config.json';

export default function Home() {
  useEffect(() => { checkToken(); }, []);

  const checkToken = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) router.replace('dashboard');
  };

  const gotoLogin = () => router.navigate('login');
  const gotoSignup = () => router.navigate('signup');
  
  const deactivateAccount = async () => {
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
        // Handle error feedback to the user
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
      // Handle network or other errors
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>TOPBIDS</Text>
        <Text style={styles.subtitle}>Faça login ou crie uma conta</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={gotoLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={gotoSignup}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deactivateButton]} onPress={deactivateAccount}>
            <Text style={styles.buttonText}>Desativar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    backgroundColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deactivateButton: {
    backgroundColor: 'red',
    marginTop: 20,
  },
});
