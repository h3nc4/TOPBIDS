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
import { FlatList, View, Text, Image, StyleSheet, RefreshControl } from 'react-native';
import Header from '../components/Header';
import { fetchBoughtItems } from '../utils/dataFetching';
import { Item } from '../types/Item';

export default function BoughtItems() {
  const [items, setItems] = useState<Array<Item>>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBoughtItems().then(data => setItems(data));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBoughtItems().then(data => setItems(data));
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Item }) => (
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

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={[styles.flatListContent, items.length === 0 && styles.minHeightContainer]}
      />
    </View>
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
  flatListContent: {
    flexGrow: 1,
  },
  minHeightContainer: {
    minHeight: 200,
  },
});
