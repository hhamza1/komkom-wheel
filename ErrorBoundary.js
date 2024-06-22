import React from 'react';
import { Text as RNText, View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error:', error, 'Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <RNText style={styles.errorText}>Something went wrong.</RNText>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: width * 0.05,
  },
  errorText: {
    fontSize: width * 0.05,
    color: '#fff',
    textAlign: 'center',
  },
});

export default ErrorBoundary