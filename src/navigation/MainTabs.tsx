import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabIcon = ({ name, color }: { name: string, color: string }) => (
    <View style={styles.footerIconWrapper}>
        <Icon name={name} size={40} color={color} />
    </View>
);

export default function MainTabs() {
    return (
        <Tab.Navigator
            // ... (resto de screenOptions sin cambios importantes)
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    // El `size` ya no es necesario pasarlo al componente custom
                    tabBarIcon: ({ color }) => (
                        <CustomTabIcon name="home" color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <CustomTabIcon name="account" color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <CustomTabIcon name="cog" color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Logout"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <CustomTabIcon name="exit-to-app" color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    // ... (tus estilos aquí)
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderTopWidth: 0,
        height: 80,
        width: 'auto',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 20,
    },
    footerIconWrapper: {
        alignItems: 'center',
        padding: 5,
    },
});