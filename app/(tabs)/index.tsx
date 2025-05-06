import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
        <Button mode='contained' onPress={() => console.log('asdsa')}>
            <Text>OK</Text>
        </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
