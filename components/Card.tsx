// components/Card.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type CardProps = {
  value: string;
  onPress?: () => void;
};

const Card: React.FC<CardProps> = ({ value, onPress }) => {
  const isWild = value === 'WILD';
  const isSkip = value === 'SKIP';
  const colorCode = {
    R: '#e74c3c',
    G: '#27ae60',
    B: '#3498db',
    Y: '#f1c40f'
  };

  let bgColor = '#ccc';
  if (isWild) bgColor = '#9b59b6';
  else if (isSkip) bgColor = '#34495e';
  else bgColor = colorCode[(value[0] as keyof typeof colorCode)] || '#ccc';

  return (
     <TouchableOpacity onPress={onPress} style={styles.card}>
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>{value}</Text>
    </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 60,
    height: 90,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  }
});
 export default Card;