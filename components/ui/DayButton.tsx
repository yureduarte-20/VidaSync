import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const DayButton = ({ onPress }) => {
    const theme = useTheme()
    const styles = StyleSheet.create({
        container: {
          backgroundColor: theme.colors.background, 
          padding: 15,
          borderRadius: 8,
          borderColor: theme.colors.primary,
          margin: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3, 
        },
        textContainer: {
          alignItems: 'center',
        },
        dayTimeText: {
          fontSize: 14,
          color: '#666',
          marginBottom: 4,
        },
        editorText: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
        },
      });
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.dayTimeText}>Quarta 09:41 AM</Text>
        <Text style={styles.editorText}>Editor</Text>
      </View>
    </TouchableOpacity>
  );
};



export default DayButton;