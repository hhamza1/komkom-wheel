import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Text as RNText,
  ImageBackground
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Wheel from './components/Wheel';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { initialItems } from './data/initialItems';
import clientLogo from './assets/images/client_logo.png';
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [winner, setWinner] = useState({ name: null, logo: null });
  const [modalVisible, setModalVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminScreenVisible, setAdminScreenVisible] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const usernameRef = useRef('');
  const passwordRef = useRef('');
  const [enabled, setEnabled] = useState(true);
  const logoClickCountRef = useRef(0);
  const wheelRef = useRef(null);

  const saveItems = async (items) => {
    try {
      await AsyncStorage.setItem('items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving items', error);
    }
  };

  const loadItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('items');
      if (savedItems) {
        return JSON.parse(savedItems);
      }
    } catch (error) {
      console.error('Error loading items', error);
    }
    return initialItems;
  };

  useEffect(() => {
    const initializeItems = async () => {
      const savedItems = await loadItems();
      setItems(savedItems);
    };
    initializeItems();
  }, []);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const handleLogin = () => {
    const username = usernameRef.current;
    const password = passwordRef.current;
    if (username === 'admin' && password === 'password') {
      setAdminModalVisible(false);
      setAdminScreenVisible(true);
    } else {
      Alert.alert(
        'Identifiants invalides',
        'Le nom d’utilisateur ou le mot de passe que vous avez entré est incorrect.'
      );
    }
  };

  const handleAddItem = (newItem) => {
    setItems(prev => {
      const updatedItems = [...prev, newItem];
      return updatedItems;
    });
  };

  const handleEditItem = (index, updatedItem) => {
    setItems(prev => {
      const updatedItems = [...prev];
      updatedItems[index] = updatedItem;
      return updatedItems;
    });
  };

  const handleDeleteItem = (index) => {
    setItems(prev => {
      const updatedItems = [...prev];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const handlePlay = () => {
    setEnabled(false);
    if (wheelRef.current) {
      wheelRef.current.spinWheel();
    }
  };

  const handleLogoClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickCountRef.current === 5) {
      setAdminModalVisible(true);
      logoClickCountRef.current = 0;
    }
  };

  useEffect(() => {
    if (modalVisible) {
      setShowWinner(false);
      const timer = setTimeout(() => {
        setShowWinner(true);
      }, 3000); // Adjust the delay as needed
      return () => clearTimeout(timer);
    }
  }, [modalVisible]);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          {adminScreenVisible ? (
            <AdminPanel
              items={items}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onClose={() => setAdminScreenVisible(false)}
            />
          ) : (
            <>
              <Header onLogoClick={handleLogoClick} />
              <Wheel
                ref={wheelRef}
                items={items}
                winner={winner}
                setWinner={setWinner}
                setModalVisible={setModalVisible}
                enabled={enabled}
                setEnabled={setEnabled}
                setItems={setItems}
              />
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlay}
              >
                <RNText style={styles.playButtonText}>Jouer</RNText>
              </TouchableOpacity>
            </>
          )}
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <ImageBackground source={clientLogo} style={styles.backgroundImage} imageStyle={styles.backgroundImageStyle}>
                <View style={styles.modalContent}>
                  {!showWinner ? (
                    <LottieView
                      source={require('./assets/animations/box_opening.json')}
                      autoPlay
                      loop={false}
                      style={styles.lottie}
                      onAnimationFinish={() => setShowWinner(true)}
                    />
                  ) : (
                    <>
                      <LottieView
                        source={require('./assets/animations/fireworks.json')}
                        autoPlay
                        loop={true}
                        style={styles.fireworks}
                      />
                      <RNText style={styles.winnerText}>Vous avez gagné:</RNText>
                      <Icon name={winner.logo} size={50} color="#005E8C" />
                      <RNText style={styles.winnerName}>{winner.name}</RNText>
                    </>
                  )}
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <RNText style={styles.closeButtonText}>Fermer</RNText>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>
          <Modal visible={adminModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButtonTop}
                  onPress={() => setAdminModalVisible(false)}
                >
                  <Icon name="times" size={20} color="#000" />
                </TouchableOpacity>
                <RNText style={styles.modalTitle}>Accès Admin</RNText>
                <TextInput
                  style={styles.input}
                  placeholder="Nom d'utilisateur"
                  onChangeText={text => { usernameRef.current = text }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  onChangeText={text => { passwordRef.current = text }}
                  secureTextEntry={true}
                />
                <TouchableOpacity onPress={handleLogin}>
                  <RNText style={styles.loginButton}>Se connecter</RNText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007DBC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    marginTop: 20,
    backgroundColor: '#F48C1F',
    padding: 20,
    borderRadius: 10,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.1,
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007DBC',
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#005E8C',
    textAlign: 'center',
  },
  winnerName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#005E8C',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#E32E26',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButtonTop: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  loginButton: {
    fontSize: 18,
    backgroundColor: '#007BFF',
    color: "#fff",
    marginTop: 10,
    padding: 10,
    borderRadius: 10
  },
  lottie: {
    width: 500,
    height: 500,
  },
  fireworks: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: -20,
  },
});
