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
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Button } from 'react-native';
import Header from '../components/Header';
import { fetchBoughtItems, paymentStatus, getStoredItem } from '../utils/dataFetching';
import { Item } from '../types/Item';

export default function BoughtItems() {
  const [items, setItems] = useState<Array<Item>>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchBoughtItems().then(data => setItems(data));
  }, []);

  useEffect(() => {
    if (selectedItem) {
      getStoredItem(selectedItem.id);
      askPaymentUpdate(selectedItem.id);
    }
  }, [selectedItem]);

  const handlePay = (item: Item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const askPaymentUpdate = async (itemId: number) => {
    console.log('Updating payment status for:', itemId);
    const result = await paymentStatus(itemId);
    if (result) {
      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, ...result } : item
      );
      setItems(updatedItems);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.itemList}>
        {items.map(item => (
          <TouchableOpacity key={item.id} style={styles.item} onPress={() => handlePay(item)}>
            <Image
              style={styles.image}
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
            />
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.finalPrice ? `Final Price: $${item.finalPrice}` : `Initial Price: $${item.price}`}</Text>
            <Text>Vendor: {item.vendor}</Text>
            <Text>Date: {item.date}</Text>
            <Text style={{ color: item.isPaid ? 'green' : 'red' }}>{item.isPaid ? 'Paid' : 'Not Paid'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedItem && (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, elevation: 3 }}>
              <Text style={styles.title}>{selectedItem.name}</Text>
              <Text>Valor total: R${selectedItem.finalPrice}</Text>
              <Text>Vendor: {selectedItem.vendor}</Text>
              <Text>Pix: {selectedItem.pix}</Text>
              <Text style={{ color: selectedItem.isPaid ? 'green' : 'red' }}>{selectedItem.isPaid ? 'Paid' : 'Not Paid'}</Text>
              <Button title="Done" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    alignItems: 'center',
  },
  itemList: {
    width: '100%',
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
});
