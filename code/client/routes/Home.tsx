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
import { Button, View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

interface HomeProps {
  navigation: NativeStackScreenProps<any, 'Home'>['navigation'];
}

const Home = ({ navigation }: HomeProps) => {

  useEffect(() => { checkToken(); }, []);

  const checkToken = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) navigation.replace('Dashboard'); // Navigate to Dashboard if user is logged in
  };

  const gotoLogin = () => navigation.navigate('Login');
  const gotoSignup = () => navigation.navigate('Signup');

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Bem vindo ao TOPBIDS</Text>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={gotoLogin} />
        <Button title="Signup" onPress={gotoSignup} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: { width: '80%' }
});

export default Home;
