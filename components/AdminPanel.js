import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text as RNText, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ModalDropdown from 'react-native-modal-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cahierMoovImage from '../assets/gifts/cahier-moov.png';
import briquetMoovImage from '../assets/gifts/briquet-moov.png';
import impermeableMoovImage from '../assets/gifts/impermeable-moov.png';
import casquetteMoovImage from '../assets/gifts/casquette-moov.png';

const icons = [
  { icon: "futbol", name: "Ballon de foot" },
  { icon: "first-aid", name: "Trousse de 1er secours" },
  { icon: "wallet", name: "Porte monnaie" },
  { icon: "trash", name: "Sac poubelle" },
  { icon: "hand-paper", name: "Gants de protection" },
  { icon: "vest", name: "Gilet doudoune" },
  { icon: "hat-wizard", name: "Capuchon" },
  { icon: "mobile-alt", name: "Support téléphone" },
  { icon: "sun", name: "Cache soleil" },
  { icon: "hat-cowboy", name: "Casquette" },
  { icon: "key", name: "Porte clé" },
  { icon: "bicycle", name: "Vélo" },
  { icon: "book", name: "Livre" },
  { icon: "camera", name: "Caméra" },
  { icon: "car", name: "Voiture" },
  { icon: "coffee", name: "Café" },
  { icon: "gift", name: "Cadeau" },
  { icon: "home", name: "Maison" },
  { icon: "laptop", name: "Ordinateur portable" },
  { icon: "music", name: "Musique" },
  { icon: "phone", name: "Téléphone" },
  { icon: "shopping-cart", name: "Panier" },
  { icon: "suitcase", name: "Valise" },
  { icon: "umbrella", name: "Parapluie" },
  { icon: "user", name: "Utilisateur" },
  { icon: "clock", name: "Montre" },
  { icon: "gas-pump", name: "Carte carburant" },
  { icon: "tshirt", name: "T-shirt" },
  { icon: "shower", name: "Bon pour lavage" },
  { icon: "ticket-alt", name: "Coupon de réduction" },
  { icon: "map-marked-alt", name: "Carte routière" },
  { icon: "headphones", name: "Écouteurs" },
  { icon: "mug-hot", name: "Tasse" },
  { icon: "thermometer-half", name: "Thermomètre" },
  { icon: "snowflake", name: "Désodorisant" },
  { icon: "medkit", name: "Kit de secours" },
  { icon: "wrench", name: "Outil multifonction" },
  { icon: "plug", name: "Chargeur voiture" },
  { icon: "hands-helping", name: "Assistance routière" },
  { icon: "shopping-bag", name: "Sac de courses" },
  { icon: "wine-bottle", name: "Bouteille d'eau" },
  { icon: "toilet-paper", name: "Rouleau de papier" },
  { icon: "battery-full", name: "Batterie de secours" },
  { icon: "globe", name: "Globe terrestre" },
  { icon: "plane", name: "Billet d'avion" },
  { icon: "bed", name: "Nuit d'hôtel" },
  { icon: "cut", name: "Ciseaux" },
  { icon: "pencil-alt", name: "Crayon" },
  { icon: "leaf", name: "Produit écologique" },
  { icon: "dog", name: "Accessoire pour chien" },
  { icon: "battery-half", name: "Batterie" },
  { icon: "road", name: "Route" },
  { icon: "tachometer-alt", name: "Tachymètre" },
  { icon: "toolbox", name: "Boîte à outils" },
  { icon: "tint", name: "Teinture" },
  { icon: "traffic-light", name: "Feu de circulation" }
];

const AdminPanel = ({ items, onAddItem, onEditItem, onDeleteItem, onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const nameRef = useRef('');
  const logoRef = useRef('');
  const quantityRef = useRef(1);

  const handleItemPress = useCallback((item) => {
    setSelectedItem(item);
    setIsEditing(false);
    setModalVisible(true);
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    nameRef.current = selectedItem.name;
    logoRef.current = selectedItem.logo;
    quantityRef.current = selectedItem.quantity;
  }, [selectedItem]);

  const handleSaveEdit = useCallback(async () => {
    const updatedItem = {
      name: nameRef.current,
      logo: logoRef.current,
      quantity: parseInt(quantityRef.current, 10),
    };
    const index = items.findIndex(item => item.name === selectedItem.name);
    onEditItem(index, updatedItem);
    await AsyncStorage.setItem('items', JSON.stringify(items));
    setModalVisible(false);
  }, [items, onEditItem, selectedItem]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Supprimer le cadeau',
      'Etes vous sur de vouloir supprimer ce cadeau?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            const index = items.findIndex(item => item.name === selectedItem.name);
            onDeleteItem(index);
            await AsyncStorage.setItem('items', JSON.stringify(items));
            setModalVisible(false);
          },
        },
      ],
      { cancelable: false }
    );
  }, [items, onDeleteItem, selectedItem]);

  const handleAddNewItem = useCallback(() => {
    setSelectedItem(null);
    setIsEditing(true);
    nameRef.current = '';
    logoRef.current = '';
    quantityRef.current = 1;
    setModalVisible(true);
  }, []);

  const handleSaveNewItem = useCallback(async () => {
    const newItem = {
      name: nameRef.current,
      logo: logoRef.current,
      quantity: parseInt(quantityRef.current, 10),
    };
    onAddItem(newItem);
    await AsyncStorage.setItem('items', JSON.stringify(items));
    setModalVisible(false);
  }, [items, onAddItem]);

  const renderIconDropdownRow = (rowData) => (
    <View style={styles.dropdownRow}>
      <Icon name={rowData.icon} size={20} style={styles.dropdownIcon} />
      <RNText>{rowData.name}</RNText>
    </View>
  );

  const renderIconDropdown = () => (
    <ModalDropdown
      options={icons}
      onSelect={(index, value) => logoRef.current = value.icon}
      renderRow={renderIconDropdownRow}
      dropdownStyle={styles.dropdown}
      defaultValue="Veuillez sélectionner..."
      textStyle={styles.dropdownText}
      dropdownTextStyle={styles.dropdownTextStyle}
      dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
      renderButtonText={(rowData) => rowData.name}
      initialScrollIndex={Math.max(0, icons.findIndex(icon => icon.icon === logoRef.current))}
    />
  );

  const renderItemIcon = (item) => {
    switch (item.logo) {
      case 'hat-cowboy':
        return <Image source={casquetteMoovImage} style={styles.itemImage} />;
      case 'vest':
        return <Image source={impermeableMoovImage} style={styles.itemImage} />;
      case 'fire':
        return <Image source={briquetMoovImage} style={styles.itemImage} />;
      case 'notebook':
        return <Image source={cahierMoovImage} style={styles.itemImage} />;
      default:
        return <Icon name={item.logo} size={20} />;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.adminContainer}>
      <RNText style={styles.adminTitle}>Panneau de Configuration</RNText>
      <View style={styles.tableHeader}>
        <RNText style={styles.tableHeaderText}>Icone</RNText>
        <RNText style={styles.tableHeaderText}>Nom</RNText>
        <RNText style={styles.tableHeaderText}>Qté</RNText>
      </View>
      {items.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handleItemPress(item)} style={styles.tableRow}>
          {renderItemIcon(item)}
          <RNText style={styles.tableCell}>{item.name}</RNText>
          <RNText style={styles.tableCell}>{item.quantity}</RNText>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.addItemButton} onPress={handleAddNewItem}>
        <RNText style={styles.addItemButtonText}>Ajouter Cadeau</RNText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeAdminButton} onPress={onClose}>
        <RNText style={styles.closeAdminButtonText}>Fermer Panneau</RNText>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isEditing ? (
              <>
                <RNText style={styles.modalTitle}>{selectedItem ? 'Modifier Cadeau' : 'Ajouter Cadeau'}</RNText>
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  defaultValue={nameRef.current}
                  onChangeText={(text) => (nameRef.current = text)}
                />
                {renderIconDropdown()}
                <TextInput
                  style={styles.input}
                  placeholder="Quantité"
                  defaultValue={quantityRef.current.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) => (quantityRef.current = text)}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.saveButton} onPress={selectedItem ? handleSaveEdit : handleSaveNewItem}>
                    <RNText style={styles.saveButtonText}>Enregistrer</RNText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                    <RNText style={styles.cancelButtonText}>Annuler</RNText>
                  </TouchableOpacity>
                </View>
              </>
            ) : selectedItem ? (
              <>
                <RNText style={styles.modalTitle}>{selectedItem.name}</RNText>
                <TouchableOpacity style={styles.modalButtonEdit} onPress={handleEdit}>
                  <RNText style={styles.modalButtonText}>Modifier</RNText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonDelete} onPress={handleDelete}>
                  <RNText style={styles.modalButtonText}>Supprimer</RNText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                  <RNText style={styles.modalButtonText}>Annuler</RNText>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  adminContainer: {
    width: '100%',
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: '#fff'
  },
  tableHeader: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: "#fff"
  },
  tableRow: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  tableCell: {
    flex: 1,
    paddingLeft: 50,
    justifyContent : 'center',
    textAlign: 'left'
  },
  addItemButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  addItemButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingLeft: 7,
    paddingRight: 7
  },
  closeAdminButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E32E26',
    borderRadius: 5,
  },
  closeAdminButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007DBC',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdown: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 10,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownText: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
  },
  dropdownTextStyle: {
    color: '#333',
    fontSize: 16,
    padding: 10,
  },
  dropdownTextHighlightStyle: {
    color: '#007BFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#6c757d',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalButtonEdit: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  modalButtonDelete: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#E32E26',
    borderRadius: 5,
  },
  modalButtonCancel: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#6c757d',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  itemImage: {
    width: 20,
    height: 20,
  },
});

export default AdminPanel;
