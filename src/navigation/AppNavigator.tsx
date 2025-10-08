import React,{useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import SplashScreen from '../screens/SplashScreen';

// Screens de autenticación
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

// Simulación de la carga de la aplicación (APIs, fuentes, etc.)
const loadCriticalResources = async () => {
await new Promise(resolve => {
    setTimeout(() => resolve(null), 2500); 
  });
};

export default function AppNavigator() {
    const [isAppLoading, setIsAppLoading] = useState(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // LOGICA DE CARGA DE RECURSOS
  useEffect(() => {
    loadCriticalResources().then(() => {
      // 1. La app terminó de cargar sus datos/recursos
      setIsAppLoading(false);
    });
  }, []); // Se ejecuta solo una vez al montar

  // LOGICA DE TRANSICIÓN
  const handleAnimationEnd = () => {
    // 2. La animación de salida del logo terminó
    setIsAnimationComplete(true);
  };

    const showSplash = isAppLoading || !isAnimationComplete;

  // Renderizado Condicional: Si 'showSplash' es true, mostramos la pantalla de carga
  if (showSplash) {
    return <SplashScreen onAnimationEnd={handleAnimationEnd} />;
  }


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Aqui les dejo de que lo principal, le dan diseño nomás, las screens ya están creadas igual xd*/}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Menú principal y asi... */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
