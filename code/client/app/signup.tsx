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

import React, { useState } from 'react';
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { signupUser } from '../api/userApi';
import Header from '../components/Header';

export default function signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    try {
      const response = await signupUser(
        JSON.stringify({ user: { username, email, password, cpf, phone, address, city, state, zip_code: zipCode } })
      );
      const responseJson = JSON.parse(response);
      if (responseJson.token) {
        await AsyncStorage.setItem('user', response);
        router.replace('dashboard');
      }
      setErrorMessage('Check your email.');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred during signup');
      console.error('Error signing up:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Cadastro</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TextInput style={styles.input} placeholder="Nome" value={username} onChangeText={setUsername} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} />
        <TextInput style={styles.input} placeholder="Telefone" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Endereço" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="Cidade" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Estado" value={state} onChangeText={setState} />
        <TextInput style={styles.input} placeholder="CEP" value={zipCode} onChangeText={setZipCode} />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <Text style={styles.link} onPress={() => router.push('login')}>Já possui uma conta? Faça Login!</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    color: 'black',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
