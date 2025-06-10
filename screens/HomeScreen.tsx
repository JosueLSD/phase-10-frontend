// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../styles';
import { RootStackParamList } from '../App';
import socket from '../socket';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <View style={styles.container}>
      <Text>Tu nombre:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Nombre de sala:</Text>
      <TextInput style={styles.input} value={room} onChangeText={setRoom} />

      <Button title="Crear sala" onPress={() => {
        socket.emit('create_room', { name, room });
        navigation.navigate('Lobby', { name, room });
      }} />

      <Button title="Unirse a sala" onPress={() => {
        socket.emit('join_room', { name, room });
        navigation.navigate('Lobby', { name, room });
      }} />
    </View>
  );
}
