// screens/LobbyScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../styles';
import { RootStackParamList } from '../App';
import socket from '../socket';

type Props = {
  route: RouteProp<RootStackParamList, 'Lobby'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lobby'>;
};

export default function LobbyScreen({ route, navigation }: Props) {
  const { name, room } = route.params;
  const [players, setPlayers] = useState<string[]>([]);

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
      <Button title="Iniciar juego" onPress={() => {
        socket.emit('start_game', { room });
        navigation.navigate('Game', { name, room });
      }} />
    </View>
  );
}
