// HeaderDos.js
import React from 'react';
import { View, Image, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importa SafeAreaView

function HeaderUno() {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
    justifyContent: "flex-end", 
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20, 
    backgroundColor: 'transparent',
  },  
  planeIcon: {
    width: 60,
    height: 30,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
  },
});

export default HeaderUno;