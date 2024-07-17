import React from 'react';
import { StyleSheet, View, Image, Text as RNText, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Header = ({ onLogoClick }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onLogoClick}>
        <Image style={styles.logo} source={require('../assets/images/client_logo_moov.png')} />
      </TouchableOpacity>
      <RNText style={styles.sloganText}>GAGNEZ AVEC MOOVE OIL</RNText>
      <RNText style={styles.sloganSubText}>Tentez votre chance et gagnez</RNText>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02, // Adjust margin bottom based on screen height
  },
  logo: {
    width: width * 0.3, // 25% of screen width
    height: width * 0.3, // 25% of screen width to maintain aspect ratio
    resizeMode: 'contain',
    marginBottom: height * 0.01, // Adjust margin bottom based on screen height
  },
  sloganText: {
    fontSize: width * 0.06, // Adjust font size based on screen width
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: height * 0.005, // Adjust margin bottom based on screen height
  },
  sloganSubText: {
    fontSize: width * 0.04, // Adjust font size based on screen width
    color: '#fff',
    textAlign: 'center',
  },
});

export default Header