import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const Stack = createNativeStackNavigator<RootStackParamList>();
const socket = io('http://192.168.100.23:3000');
//const socket = io('http://localhost:3000'); // Cámbialo por tu IP local o dominio cuando pruebes en celular

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Lobby: { name: string; room: string };
};

function HomeScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> }) {
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

function LobbyScreen({ route }: { route: RouteProp<RootStackParamList, 'Lobby'> }) {
  const { name, room } = route.params;
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on('room_update', (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off('room_update');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sala: {room}</Text>
      <Text style={styles.title}>Jugadores:</Text>
      {players.map((p, i) => (
        <Text key={i}>- {p}</Text>
      ))}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Lobby" component={LobbyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  title: { fontWeight: 'bold', fontSize: 20, marginTop: 20 },
});
