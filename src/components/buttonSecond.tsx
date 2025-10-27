import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MenuButton = ({ title, iconName }: { title: string, iconName: string }) => (
    <TouchableOpacity style={styles.button}>
        <Icon name={iconName} size={28} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

function ButtonMenu() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>

                <View style={styles.menuContainer}>
                    <MenuButton
                        title="APRENDER EL ALFABETO"
                        iconName="book-open-variant"
                    />
                    {/* <MenuButton 
                        title="PRACTICAR PRONUNCIACIÓN" 
                        iconName="account-voice" 
                    /> */}
                    <MenuButton
                        title="CUESTIONARIOS Y RETOS"
                        iconName="trophy-outline"
                    />
                </View>

                {/* Este es el botón "PRÓXIMAMENTE" que se ve en tu imagen */}
                <View style={[styles.button, styles.disabledButton]}>
                    <Text style={styles.disabledButtonText}>PRÓXIMAMENTE...</Text>
                </View>

            </View>
        </SafeAreaView>
    );
}

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
        fontSize: 16,
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
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    }
});

export default ButtonMenu;