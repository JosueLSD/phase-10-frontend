import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { styles } from '../styles';
import Card from '../components/Card';
import { RootStackParamList } from '../App';
import socket from '../socket';
import { isValidPhase1 } from '../phaseValidations/validations';

type Props = {
  route: RouteProp<RootStackParamList, 'Game'>;
};

export default function GameScreen({ route }: Props) {
  const { name, room } = route.params;
  const [hand, setHand] = useState<string[]>([]);
  const [turnPlayer, setTurnPlayer] = useState<string | null>(null);
  const [discardTop, setDiscardTop] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [phaseCards, setPhaseCards] = useState<string[][]>([[], []]); // dos grupos
  const [phaseLocked, setPhaseLocked] = useState(false);

  useEffect(() => {
    socket.on('start_game', ({ hand, turnPlayer, discardTop }: { hand: string[]; turnPlayer: string; discardTop: string }) => {
      setHand(hand);
      setTurnPlayer(turnPlayer);
      setDiscardTop(discardTop);
      console.log("Inicio de juego. Turno de:", turnPlayer);
    });

    socket.on('turn_update', ({ nextPlayer }: { nextPlayer: string }) => {
      setTurnPlayer(nextPlayer);
      console.log("Siguiente turno:", nextPlayer);
    });

    return () => {
      socket.off('start_game');
      socket.off('turn_update');
    };
  }, []);

  useEffect(() => {
    socket.on('card_drawn', ({ card }: { card: string }) => {
      setHasDrawn(true);
      setHand(prev => [...prev, card]);
    });
    socket.on('discard_card_succesfully', ({ player }: { player: string }) => {
      setHasDrawn(false);
    });

    socket.on('discard_update', ({ newTop, nextPlayer, discardedBy }: { newTop: string, nextPlayer: string, discardedBy: string }) => {
      if (discardedBy === name) {
        setHand(prev => {
          const index = prev.indexOf(newTop);
          if (index !== -1) {
            const newHand = [...prev];
            newHand.splice(index, 1);
            return newHand;
          }
          return prev;
        });
      }
      setDiscardTop(newTop);
      setTurnPlayer(nextPlayer);
      console.log("Descarte actualizado:", newTop, "→ Siguiente:", nextPlayer);
    });


    return () => {
      socket.off('card_drawn');
      socket.off('discard_update');
      socket.off('discard_card_succesfully');
    };
  }, []);

  function moveCardToPhase(card: string, groupIndex: number) {
    if (phaseLocked) return;

    setHand(prev => prev.filter(c => c !== card)); // quitar de la mano
    setPhaseCards(prev => {
      const newGroup = [...prev[groupIndex], card];
      const newPhase = [...prev];
      newPhase[groupIndex] = newGroup;
      return newPhase;
    });
  }

  function removeCardFromPhase(card: string, groupIndex: number) {
    if (phaseLocked) return;

    setPhaseCards(prev => {
      const newGroup = prev[groupIndex].filter(c => c !== card);
      const newPhase = [...prev];
      newPhase[groupIndex] = newGroup;
      return newPhase;
    });
    setHand(prev => [...prev, card]);
  }



  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Tus cartas:</Text>
        <Text style={styles.subtitle}>
          {turnPlayer === name ? 'Tu turno' : `Turno de: ${turnPlayer}`}
        </Text>

        {/*<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
        </View>*/}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
          {hand.map((card, i) => (
            <Card
              key={i}
              value={card}
              onPress={() => {
                // Por defecto lo mandamos al primer grupo vacío o con < 3 cartas
                const targetGroup = phaseCards[0].length < 3 ? 0 : 1;
                moveCardToPhase(card, targetGroup);
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
          <Text style={styles.subtitle}>Zona de fase:</Text>
          {phaseCards.map((group, groupIndex) => (
            <View key={groupIndex} style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
              {group.map((card, i) => (
                <Card
                  key={i}
                  value={card}
                  onPress={() => removeCardFromPhase(card, groupIndex)}
                />
              ))}
            </View>
          ))}
        </View>
        {!phaseLocked && (
          <TouchableOpacity
            disabled={!isValidPhase1(phaseCards)}
            style={[
              styles.button,
              { backgroundColor: isValidPhase1(phaseCards) ? 'green' : 'gray' }
            ]}
            onPress={() => {
              socket.emit('play_phase', { room, phaseCards });
              setPhaseLocked(true);
            }}
          >
            <Text style={styles.text}>Jugar Fase 1</Text>
          </TouchableOpacity>
        )}
        {(!hasDrawn && (turnPlayer === name)) && <Text>Toma una carta!</Text>}
        {(!hasDrawn && (turnPlayer === name)) && <Text>Descartá che!</Text>}


      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
        <TouchableOpacity onPress={() => socket.emit('draw_card', { room, from: 'deck' })}>
          <View style={[styles.card, { backgroundColor: '#777' }]}>
            <Text style={styles.text}>MAZO</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity >
          <View style={[styles.card, { backgroundColor: '#333' }]}>
            <Card
              value={discardTop ?? '...'}
              onPress={() => socket.emit('draw_card', { room, from: 'discard' })}
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
