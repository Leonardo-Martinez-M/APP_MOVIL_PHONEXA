import React,{useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import SplashScreen from '../screens/SplashScreen';

// Screens de autenticación
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const loadCriticalResources = async () => {
await new Promise(resolve => {
    setTimeout(() => resolve(null), 2500); 
  });
};

export default function AppNavigator() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    loadCriticalResources().then(() => {
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


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name='Profile' component={ProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
