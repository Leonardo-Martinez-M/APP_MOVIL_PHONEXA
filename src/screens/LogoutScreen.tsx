import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderDos from '../components/headerDos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../navigation/AppNavigator';

const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');
type LogoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Logout'
>;

export default function LogoutScreen() {
  const navigation = useNavigation<LogoutScreenNavigationProp>();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión correctamente.');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: handleLogout },
      ]
    );
  };

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fullScreen}
    >
      <Image
        source={BackgroundAbstract}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      <SafeAreaView>
        <HeaderDos />
      </SafeAreaView>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.LogOutText}>¿Deseas cerrar sesión?</Text>
          <Text style={styles.subText}>
            Si sales, necesitarás iniciar sesión nuevamente para acceder a tu cuenta.
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={confirmLogout}
          >
            <Text style={styles.buttonText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  LogOutText: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 60,
  },
  subText: {
    fontSize: 16,
    fontFamily: 'MontserratAlternates-Regular',
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 10,
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  logoutButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'MontserratAlternates-SemiBold',
  },
});
