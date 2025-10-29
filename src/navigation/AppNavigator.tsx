import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import SplashScreen from '../screens/SplashScreen';
import { isLoggedIn, login, logout } from '../api/authService';
// Screens de autenticación
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProductListScreen from '../screens/ProductListScreen';
import QuizScreen from '../screens/QuizScreen';
import LogoutScreen from '../screens/LogoutScreen';
import { RootStackParamList } from '../types/navigation';
import { LoginRequest } from '../types/loginRequest.interface';
//import CardScreen from '../screens/CardScreen';


type AuthContextType = {
  signIn: (data: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | null>(null);

const Stack = createNativeStackNavigator<RootStackParamList>();


const loadCriticalResources = async () => {
  await new Promise(resolve => {
    setTimeout(() => resolve(null), 2500);
  });
};

export default function AppNavigator() {
  const [userLogged, setUserLogged] = useState<boolean | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const authContext = useMemo(() => ({
    signIn: async (data: LoginRequest) => {
      await login(data);
      setUserLogged(true);
    },
    signOut: async () => {
      await logout();
      setUserLogged(false);
    }
  }), []);

  const checkSession = async () => {
    try {
      const logged = await isLoggedIn();
      setUserLogged(logged);
    } catch (error) {
      console.error('Error verificando sesión:', error);
      setUserLogged(false);
    }
  };
  useEffect(() => {
    loadCriticalResources().then(() => {
      checkSession();
      setIsAppLoading(false);
    });
  }, []);

  const handleAnimationEnd = () => {
    setIsAnimationComplete(true);
  };

  const showSplash = isAppLoading || !isAnimationComplete;

  if (showSplash) {
    return <SplashScreen onAnimationEnd={handleAnimationEnd} />;
  }

  if (isAppLoading || userLogged === null || !isAnimationComplete) {
    return <SplashScreen onAnimationEnd={handleAnimationEnd} />;
  }

  return (
    <AuthContext.Provider value={authContext}>

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userLogged ?  (
            // 👇 Si ya hay sesión, saltamos Login/Welcome/Register
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Prueba" component={ProductListScreen} />
              <Stack.Screen name="Quiz" component={QuizScreen} />
              <Stack.Screen name='Logout' component={LogoutScreen} />
            </>
          ) : (
            // 👇 Si no hay sesión, mostramos pantallas de autenticación
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
