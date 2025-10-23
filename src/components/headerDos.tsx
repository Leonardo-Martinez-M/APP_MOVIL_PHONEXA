// HeaderDos.js
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importa SafeAreaView
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Para usar la flecha

function HeaderDos() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon 
            name="chevron-left" 
            size={32}           
            color="white"       
          />
        </TouchableOpacity>

        <Image
          source={require('../assets/images/avion.png')}
          style={styles.planeIcon}
        />
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20, 
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 5, 
  },
  
  planeIcon: {
    width: 60,
    height: 30,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
  },
});

export default HeaderDos;