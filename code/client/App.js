import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import Header from './components/Header';
import styles from './styles/styles';
import { fetchData } from './utils/dataFetching';

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData().then(data => setItems(data));
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Image
          style={styles.image}
          source={{ uri: `data:image/jpeg;base64,${item.image}` }}
        />
        <Text style={styles.title}>{item.name}</Text>
        <Text>{item.description}</Text>
        <View style={{ marginTop: 10 }}>
          <Text>Price: {item.price}</Text>
          <Text>Vendor: {item.vendor}</Text>
          <Text>Date: {item.date}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
}
