import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  primary?: boolean;
  secondary?: boolean;
};

const CustomButton: React.FC<Props> = ({ title, onPress, primary, secondary }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFFF00',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0000FF',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
  text: {
    fontWeight: 'bold',
    color: '#153AD1',
    fontSize: 17,
  }
});

export default CustomButton;