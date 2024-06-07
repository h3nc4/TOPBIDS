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
import { View, Text, Image, StyleSheet, Button, TextInput, ScrollView } from 'react-native';
import Header from '../components/Header';
import { getStoredItem, getUserJWT } from '../utils/dataFetching';
import { bestGuard } from '../utils/dataFetching';
import { Item, JWT } from '../types/Item';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { io, Socket } from "socket.io-client";

export default function auction() {
  const { id } = useLocalSearchParams(); // Extract the item ID from the route params
  const itemId = typeof id === 'string' ? parseInt(id, 10) : typeof id === 'number' ? id : 0;
  const [item, setItem] = useState<Item | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null); // State to hold the WebSocket connection
  const [currentPrice, setCurrentPrice] = useState<number | null>(null); // State to hold the current price
  const [jwt, setJWT] = useState<JWT | null>(null);
  const [messages, setMessages] = useState<string[]>([]); // State to hold chat messages
  const [newMessage, setNewMessage] = useState<string>(''); // State for new chat message
  const [loading, setLoading] = useState(true); // Add loading state

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
        setLoading(false); // Set loading to false when JWT is received
      }).catch(error => {
        console.error('Error fetching JWT:', error);
        setLoading(false); // Set loading to false even if there's an error
      });
    }
  }, [item]);

  useEffect(() => {
    initializeSocket();
    return () => { if (socket) socket.disconnect(); };
  }, [jwt, loading, item]); // Depend on jwt and loading states

  const placeBid = () => { // Function to place a bid
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

  const sendMessage = () => { // Function to send a chat message
    if (socket !== null && newMessage.trim() !== '' && jwt !== null) {
      console.log("emitting chat message...", newMessage);
      socket.emit('message', { room: id, message: newMessage, user: jwt.user });
      setNewMessage('');
    } else
      console.log("error initializing socket or jwt or message empty", socket, jwt, newMessage);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={150} // Adjust this value as needed
    >
      <View style={styles.container}>
        <Header />
        {item ? ( // Conditionally render only if item is not null
          <View style={styles.item}>
            <Image
              style={styles.image}
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
            />
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
            <View style={{ marginTop: 10 }}>
              <Text>Price: {currentPrice !== null ? currentPrice : item.price}</Text>
              <Text>Vendor: {item.vendor}</Text>
              <Text>Date: {item.date}</Text>
            </View>
            <Button title="Place Bid" onPress={placeBid} />
            <ScrollView style={styles.chatContainer}>
              {messages.map((msg, index) => (
                <Text key={index} style={styles.chatMessage}>{msg}</Text>
              ))}
            </ScrollView>
            <TextInput
              style={styles.chatInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        ) : <></>}
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
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
  },
});
