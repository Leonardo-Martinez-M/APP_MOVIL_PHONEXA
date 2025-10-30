import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa el hook
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Modifica MenuButton para aceptar una prop `onPress`
const MenuButton = ({ 
  title, 
  iconName, 
  onPress 
}: { 
  title: string; 
  iconName: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Icon name={iconName} size={28} color="#FFFFFF" style={styles.icon} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

function ButtonMenu() {
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <MenuButton
            title="APRENDER EL ALFABETO"
            iconName="book-open-variant"
            onPress={() => navigation.navigate('Card')} // Navega a CardScreen
          />
          <MenuButton
            title="CUESTIONARIOS Y RETOS"
            iconName="trophy-outline"
            onPress={() => navigation.navigate('Quiz')} // Ejemplo para otra pantalla
          />
        </View>

        <View style={[styles.button, styles.disabledButton]}>
          <Text style={styles.disabledButtonText}>PRÓXIMAMENTE...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Los estilos se mantienen igual...

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent', 
        width: '100%', height: '100%'
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    menuContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 25,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: 20,
    },
    icon: {
        marginRight: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'MontserratAlternates-SemiBold'
    },
    //Boton Proximamente 
    disabledButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
    },
    disabledButtonText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    }
});

export default ButtonMenu;