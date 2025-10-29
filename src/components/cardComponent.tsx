import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import SoundIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 

interface AlphabetCardProps {
    topIcon: React.ReactNode; 
    letter: string;
    name: string;
    onPressSound: () => void;
}

const AlphabetCard = ({ topIcon, letter, name, onPressSound }: AlphabetCardProps) => {
    return (
        <View style={styles.card}>
            {/* Icono superior (avión, etc.) */}
            <View style={styles.topIconContainer}>
                {topIcon}
            </View>

            {/* Letra grande */}
            <Text style={styles.letterText}>{letter}</Text>

            {/* Nombre de la letra (ALPHA) */}
            <Text style={styles.nameText}>{name}</Text>

            {/* Botón de Sonido */}
            <TouchableOpacity style={styles.soundButton} onPress={onPressSound}>
                <SoundIcon name="volume-high" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180, // Ancho fijo para las cards del carrusel
        height: 240, // Altura fija
        backgroundColor: 'red', // Fondo translúcido oscuro
        borderRadius: 20, // Bordes redondeados
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)', // Borde claro
        marginHorizontal: 10, // Espacio entre cards en el carrusel
        padding: 40,
        alignItems: 'center',
        justifyContent: 'space-around', // Distribuye el espacio uniformemente
    },
    topIconContainer: {
        // Contenedor para el icono SVG superior, si necesitas un tamaño o margen específico
        marginBottom: 10, // Espacio debajo del icono superior
        width: 48, // Ajusta según el tamaño de tu SVG
        height: 48, // Ajusta según el tamaño de tu SVG
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontSize: 70, // Letra grande
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    nameText: {
        fontSize: 20,
        color: '#FFFFFF',
        textTransform: 'uppercase', // Para que se vea como "ALPHA"
        marginBottom: 15, // Espacio antes del botón de sonido
    },
    soundButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo translúcido para el botón
        borderRadius: 50, // Círculo
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AlphabetCard;
