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
import { FlatList, View, Text, Image, TextInput, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import { fetchData } from '../utils/dataFetching';
import { Item } from '../types/Item';
import { router } from 'expo-router';

export default function Dashboard() {
  const [items, setItems] = useState<Array<Item>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log(new Date(), "fetching data...");
    fetchData().then(data => setItems(data));
  }, []);

  const handleSearch = () => setItems(items.filter(item => `${item.name} ${item.description}`.toLowerCase().includes(searchQuery.toLowerCase())));

  const diff = (date: Date) => {
    let delta = Math.abs(date.getTime() - new Date().getTime()) / 1000;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = Math.floor(delta % 60);
    return { days, hours, minutes, seconds, isFuture: date.getTime() > new Date().getTime() };
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData().then(data => setItems(data));
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Item }) => {
    if (!item.isActive) return null;
    const tDiff = diff(new Date(item.date));
    const navigateToAuction = () => {
      console.log("Navigating to Auction page...", item.id);
      router.push({ pathname: '/auction', params: { id: item.id } });
    };

    const showButton = tDiff.days === 0 && tDiff.hours === 0 && tDiff.minutes <= 15 && !tDiff.isFuture;

    return (
      <View style={styles.item}>
        <Image
          style={styles.image}
          source={{ uri: `data:image/jpeg;base64,${item.image}` }}
        />
        <View style={styles.textContainer}>
          <View style={styles.textContent}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
            <View style={{ marginTop: 10 }}>
              <Text>Preço: {item.price}</Text>
              <Text>Leiloeiro: {item.vendor}</Text>
              <Text>Data: {item.date}</Text>
              {tDiff.isFuture && <Text>Tempo Restante: {tDiff.days}d {tDiff.hours}h {tDiff.minutes}m {tDiff.seconds}s</Text>}
            </View>
          </View>
          {showButton && (
            <TouchableOpacity onPress={navigateToAuction} style={styles.arrowButton}>
              <Ionicons name="arrow-forward-circle-outline" size={30} color="black" />
            </TouchableOpacity>
          )}
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
          placeholder="Procurar Itens..."
          onSubmitEditing={handleSearch}
        />
      </View>
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
    maxWidth: 500,
  },
  item: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  textContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffcccc',
    padding: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '70%',
    aspectRatio: 1,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  searchContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  flatListContent: {
    flexGrow: 1,
  },
  minHeightContainer: {
    minHeight: 200,
  },
  arrowButton: {
    marginLeft: 10,
  },
});
