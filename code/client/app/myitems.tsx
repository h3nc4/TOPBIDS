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
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Button, ScrollView } from 'react-native';
import Header from '../components/Header';
import { fetchBoughtItems, paymentStatus } from '../utils/dataFetching';
import { Item } from '../types/Item';

export default function BoughtItems() {
  const [items, setItems] = useState<Array<Item>>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchBoughtItems().then(data => setItems(data));
  }, []);

  const handlePay = async (item: Item) => {
    setSelectedItem(item);
    setModalVisible(true);
    await askPaymentUpdate(item.id);
  };

  const askPaymentUpdate = async (itemId: number) => {
    console.log('Updating payment status for:', itemId);
    const result = await paymentStatus(itemId);
    if (result) {
      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, ...result } : item
      );
      setItems(updatedItems);
      setSelectedItem(updatedItems.find(item => item.id === itemId) || null);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.outerContainer}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.itemList}>
          {items.map(item => (
            <TouchableOpacity key={item.id} style={styles.item} onPress={() => handlePay(item)}>
              <Image
                style={styles.image}
                source={{ uri: `data:image/jpeg;base64,${item.image}` }}
              />
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>{item.finalPrice ? `Preço Final: ${item.finalPrice}` : `Preço Inicial: ${item.price}`}</Text>
              <Text>Leiloeiro: {item.vendor}</Text>
              <Text>Data: {item.date}</Text>
              <Text style={{ color: item.isPaid ? 'green' : 'red' }}>{item.isPaid ? 'Pago' : 'Não Pago'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {selectedItem && (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, elevation: 3 }}>
              <Text style={styles.title}>{selectedItem.name}</Text>
              <Text>Valor total: R${selectedItem.finalPrice}</Text>
              <Text>Leiloeiro: {selectedItem.vendor}</Text>
              <Text style={{ color: selectedItem.isPaid ? 'green' : 'red' }}>{selectedItem.isPaid ? 'Pago' : 'Não Pago'}</Text>
              <Button title="Done" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 45,
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
