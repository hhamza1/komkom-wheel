import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#015e8b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  wheelContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: 'contain',
    marginBottom: height * 0.02,
  },
  sloganText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    color: '#fff',
    textAlign: 'center',
  },
  sloganSubText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: width * 0.05,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#007DBC',
  },
  winnerText: {
    fontSize: width * 0.05,
    marginBottom: height * 0.01,
    color: '#005E8C',
  },
  winnerName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#E32E26',
  },
  closeButton: {
    fontSize: width * 0.05,
    color: '#007BFF',
    marginTop: height * 0.02,
  },
  input: {
    width: '100%',
    padding: width * 0.03,
    marginBottom: height * 0.01,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: width * 0.04,
  },
  loginButton: {
    fontSize: width * 0.05,
    color: '#007BFF',
    marginTop: height * 0.02,
  },
  adminScreen: {
    width: '100%',
    padding: width * 0.05,
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#fff',
  },
  itemRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.03,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  addItemButton: {
    marginTop: height * 0.02,
    padding: width * 0.03,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  addItemButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeAdminButton: {
    marginTop: height * 0.02,
    padding: width * 0.03,
    backgroundColor: '#6c757d',
    borderRadius: 5,
  },
  closeAdminButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  playButton: {
    position: 'absolute',
    bottom: height * 0.05,
    backgroundColor: '#FFD700',
    padding: width * 0.04,
    borderRadius: 10,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.06,
  },
});

export default styles;