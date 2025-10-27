import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const CustomTabIcon = ({ name, color }: { name: string, color: string }) => (
    <View style={styles.footerIconWrapper}>
        <Icon name={name} size={30} color={color} />
    </View>
);

const LogoutScreen = () => {
    return null;
};


//const renderProfileIcon = ({ color }: { color: string }) => <CustomTabIcon name="person" color={color} />;
const renderHomeIcon = ({ color }: { color: string }) => <CustomTabIcon name="home" color={color} />;
const renderRachaIcon = ({ color }: { color: string }) => <CustomTabIcon name="flame" color={color} />;
const renderLogoutIcon = ({ color }: { color: string }) => <CustomTabIcon name="sign-out" color={color} />;

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
            }}
            tabBar={MyCustomTabBar}
        >
            {/* <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Person',
                    tabBarIcon: renderProfileIcon,
                }}
            /> */}
            <Tab.Screen
                name="Racha"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Flame',
                    tabBarIcon: renderRachaIcon,
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: renderHomeIcon,
                }}
            />
            <Tab.Screen
                name="Logout"
                component={LogoutScreen}
                options={{
                    tabBarLabel: 'Logout',
                    tabBarIcon: renderLogoutIcon,
                }}
            />
        </Tab.Navigator>
    );
}

function MyCustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const icon = options.tabBarIcon ? options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    size: 30
                }) : null;

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabButton}
                    >
                        {icon}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}


const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: 30,
        left: 45,
        right: 45,
        backgroundColor: 'rgba(18, 45, 35, 0.9)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(112, 153, 137, 0.9)',
        height: '9%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 5,
    },
    footerIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    }
});

