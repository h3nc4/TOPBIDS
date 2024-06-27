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

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { getStoredItem, getUserJWT } from '../utils/dataFetching';
import { bestGuard } from '../utils/dataFetching';
import { Item, JWT } from '../types/Item';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { io, Socket } from "socket.io-client";

export default function auction() {
  const { id } = useLocalSearchParams();
  const itemId = typeof id === 'string' ? parseInt(id, 10) : typeof id === 'number' ? id : 0;
  const [item, setItem] = useState<Item | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [jwt, setJWT] = useState<JWT | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const initializeSocket = async () => {
    if (!loading && jwt !== null && item !== null) {
      console.log("initializing socket...")
      try {
        const url = await bestGuard();
        console.log("WebSocket URL:", url);
        const socket = io(url, { auth: { jwt } });
        setSocket(socket);
        socket.on('connect', () => {
          console.log('Connected to guard');
        });
        socket.on('disconnect', () => { console.log('Disconnected from guard') });
        socket.on('connect_error', (error: Error) => { console.error('Connection error:', error) });
        socket.on('error', (error: Error) => { console.error('Socket error:', error) });
        socket.on('bid', (data: string) => {
          console.log("current price updated...", data);
          setCurrentPrice(parseFloat(data));
        });
        socket.on('chat', (data: { updated_value: string, user: string }) => {
          const { updated_value: message, user } = data;
          setMessages(prevMessages => [...prevMessages, `${user}: ${message}`]);
        });
        console.log("joining room...", id, "with current price...", item.price);
        socket.emit('join', { room: id, currentPrice: item.price });
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    }
  };

  useEffect(() => {
    getStoredItem(itemId).then(data => setItem(data));
  }, []);

  useEffect(() => {
    if (item) {
      setCurrentPrice(item.price);
      getUserJWT().then(data => {
        setJWT(data);
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching JWT:', error);
        setLoading(false);
      });
    }
  }, [item]);

  useEffect(() => {
    initializeSocket();
    return () => { if (socket) socket.disconnect(); };
  }, [jwt, loading, item]);

  const placeBid = () => {
    if (socket !== null && currentPrice !== null && jwt !== null) {
      console.log("emitting bid...");
      socket.emit('bid', {
        room: id,
        amount: Number(Math.min(currentPrice + Math.max(currentPrice * 0.1, 10), currentPrice + 1000).toFixed(2)),
        user: jwt.user
      });
    } else
      console.log("error initializing socket, current price or jwt", socket, currentPrice, jwt);
  };

  const sendMessage = () => {
    if (socket !== null && newMessage.trim() !== '' && jwt !== null) {
      console.log("emitting chat message...", newMessage);
      socket.emit('message', { room: id, message: newMessage, user: jwt.user });
      setNewMessage('');
    } else
      console.log("error initializing socket or jwt or message empty", socket, jwt, newMessage);
  };

  return (
    <View style={styles.outerContainer}>
      <Header />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={150}
      >
        <View style={styles.container}>
          {item ? (
            <View style={styles.item}>
              <Image
                style={styles.image}
                source={{ uri: `data:image/jpeg;base64,${item.image}` }}
              />
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.description}</Text>
              <View style={{ marginTop: 10 }}>
                <Text>Preço: {currentPrice !== null ? currentPrice : item.price}</Text>
                <Text>Leiloeiro: {item.vendor}</Text>
                <Text>Data: {item.date}</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={placeBid}>
                <Text style={styles.buttonText}>Cobrir Lance</Text>
              </TouchableOpacity>
              <ScrollView style={styles.chatContainer}>
                {messages.map((msg, index) => (
                  <Text key={index} style={styles.chatMessage}>{msg}</Text>
                ))}
              </ScrollView>
              <TextInput
                style={styles.chatInput}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Escreva uma mensagem..."
              />
              <TouchableOpacity style={styles.button} onPress={sendMessage}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          ) : <></>}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 45,
    maxWidth: 500,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  image: {
    width: '70%',
    aspectRatio: 1,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  chatContainer: {
    marginTop: 10,
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  chatMessage: {
    fontSize: 14,
    marginBottom: 5,
  },
  chatInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    margin: 0,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
