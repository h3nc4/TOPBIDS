import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Image, TextInput, RefreshControl } from 'react-native';
import Header from './components/Header';
import styles from './styles/styles';
import { fetchData } from './utils/dataFetching';

export default function App() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData().then(data => setItems(data));
  }, []);

  const handleSearch = () => setItems(items.filter(item => `${item.name} ${item.description}`.toLowerCase().includes(searchQuery.toLowerCase())));

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData().then(data => setItems(data));
    setRefreshing(false);
  };

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder="Search items..."
          onSubmitEditing={handleSearch}
        />
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}
