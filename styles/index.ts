// styles/index.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
  },
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
