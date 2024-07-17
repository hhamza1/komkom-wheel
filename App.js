import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Text as RNText,
  Image,
  Dimensions
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Wheel from './components/Wheel';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { initialItems } from './data/initialItems';
import clientLogo from './assets/images/client_logo_moov.png';
import ErrorBoundary from './ErrorBoundary';
import cahierMoovImage from './assets/gifts/cahier-moov.png';
import briquetMoovImage from './assets/gifts/briquet-moov.png';
import impermeableMoovImage from './assets/gifts/impermeable-moov.png';
import casquetteMoovImage from './assets/gifts/casquette-moov.png';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [winner, setWinner] = useState({ name: null, logo: null, image: null });
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
      console.error('Erreur lors de la sauvegarde des articles', error);
    }
  };

  const loadItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('items');
      if (savedItems) {
        return JSON.parse(savedItems);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles', error);
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
    if (username === 'admin' && password === 'passwordMoov24') {
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
      }, 3000); // Ajuster le délai si nécessaire
      return () => clearTimeout(timer);
    }
  }, [modalVisible]);

  const renderWinnerImage = (logo) => {
    switch (logo) {
      case 'hat-cowboy':
        return casquetteMoovImage;
      case 'vest':
        return impermeableMoovImage;
      case 'notebook':
        return cahierMoovImage;
      case 'fire':
        return briquetMoovImage;
      default:
        return null;
    }
  };

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
              <View style={styles.winnerModalContent}>
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
                    <RNText style={styles.winnerText}>FÉLICITATIONS, VOUS AVEZ GAGNÉ</RNText>
                    <View style={styles.winnerImageContainer}>
                      {renderWinnerImage(winner.logo) ? (
                        <Image source={renderWinnerImage(winner.logo)} style={styles.winnerImage} />
                      ) : (
                        <Icon name={winner.logo} size={100} color="#005E8C" />
                      )}
                    </View>
                    <RNText style={styles.winnerName}>{winner.name}</RNText>
                    <Image source={clientLogo} style={styles.clientLogo} />
                  </>
                )}
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <RNText style={styles.closeButtonText}>Fermer</RNText>
                </TouchableOpacity>
              </View>
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
      padding: width * 0.05,
    },
    playButton: {
      marginTop: height * 0.02,
      backgroundColor: '#F48C1F',
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.1,
      borderRadius: 10,
    },
    playButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: Math.min(width, height) * 0.03,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: width * 0.05,
    },
    winnerModalContent: {
      width: '80%',
      padding: width * 0.05,
      backgroundColor: '#4e8cbd',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    modalContent: {
      width: '80%',
      padding: width * 0.05,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
      position: 'relative',
    },
    winnerText: {
      fontSize: Math.min(width, height) * 0.04,
      fontWeight: 'bold',
      marginBottom: height * 0.02,
      color: '#fff',
      textAlign: 'center',
    },
    winnerImageContainer: {
      width: Math.min(width, height) * 0.5,
      height: Math.min(width, height) * 0.5,
      backgroundColor: '#fff',
      borderRadius: Math.min(width, height) * 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: height * 0.02,
      marginBottom: height * 0.02,
    },
    winnerImage: {
      width: '66.67%',
      height: '66.67%',
      resizeMode: 'contain',
    },
    clientLogo: {
      width: Math.min(width, height) * 0.2,
      height: Math.min(width, height) * 0.2,
      resizeMode: 'contain',
      marginTop: height * 0.02,
    },
    closeButton: {
      marginTop: height * 0.02,
      backgroundColor: '#E32E26',
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.1,
      borderRadius: 5,
    },
    closeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: Math.min(width, height) * 0.03,
    },
    closeButtonTop: {
      position: 'absolute',
      top: height * 0.01,
      right: width * 0.03,
    },
    input: {
      width: '100%',
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.03,
      marginBottom: height * 0.01,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      fontSize: Math.min(width, height) * 0.03,
    },
    loginButton: {
      fontSize: Math.min(width, height) * 0.03,
      backgroundColor: '#007BFF',
      color: "#fff",
      marginTop: height * 0.02,
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.1,
      borderRadius: 10,
      textAlign: 'center',
    },
    lottie: {
      width: Math.min(width, height) * 0.8,
      height: Math.min(width, height) * 0.8,
    },
    fireworks: {
      width: Math.min(width, height) * 0.4,
      height: Math.min(width, height) * 0.4,
      position: 'absolute',
      top: '-2%',
    },
    winnerName: {
      fontSize: Math.min(width, height) * 0.05,
      fontWeight: 'bold',
      marginBottom: height * 0.02,
      color: '#fff',
      textAlign: 'center',
    },
});