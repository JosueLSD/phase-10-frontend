// screens/GameScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { styles } from '../styles';
import Card from '../components/Card';
import { RootStackParamList } from '../App';
import socket from '../socket';

type Props = {
  route: RouteProp<RootStackParamList, 'Game'>;
};

export default function GameScreen({ route }: Props) {
  const { name, room } = route.params;
  const [hand, setHand] = useState<string[]>([]);
  const [turnPlayer, setTurnPlayer] = useState<string | null>(null);

  useEffect(() => {
    socket.on('start_game', ({ hand, turnPlayer }: { hand: string[]; turnPlayer: string }) => {
      setHand(hand);
      setTurnPlayer(turnPlayer);
    });

    socket.on('turn_update', ({ nextPlayer }: { nextPlayer: string }) => {
      setTurnPlayer(nextPlayer);
    });

    return () => {
      socket.off('start_game');
      socket.off('turn_update');
    };
  }, []);

  useEffect(() => {
  socket.on('card_drawn', ({ card }) => {
    setHand(prev => [...prev, card]);
  });

  socket.on('discard_update', ({ newTop, nextPlayer }) => {
    setDiscardTop(newTop);
    setTurnPlayer(nextPlayer);
  });
}, []);

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.title}>Tus cartas:</Text>
      <ScrollView horizontal>
        {hand.map((card, i) => (
          <Card key={i} value={card} onPress={() => {
            if (turnPlayer === name) {
              console.log('Carta seleccionada:', card);  
              socket.emit('play_card', { room, card });
            }
          }} />
        ))}
            {hand.map((card, i) => (
                    <Card
                        key={i}
                        value={card}
                        onPress={() => {
                        if (turnPlayer === name) {
                            socket.emit('discard_card', { room, card });
                        }
                        }}
                    />
            ))}
      </ScrollView>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
        <TouchableOpacity onPress={() => socket.emit('draw_card', { room, from: 'deck' })}>
            <View style={[styles.card, { backgroundColor: '#777' }]}>
            <Text style={styles.text}>MAZO</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => socket.emit('draw_card', { room, from: 'discard' })}>
            <View style={[styles.card, { backgroundColor: '#333' }]}>
            <Text style={styles.text}>DESC</Text>
            </View>
        </TouchableOpacity>
    </View>
    </>
  );
}
