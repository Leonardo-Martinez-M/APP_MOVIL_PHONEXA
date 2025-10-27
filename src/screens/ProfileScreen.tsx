import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// Importamos la librería de sonido
import Sound from 'react-native-sound'; 
// Icono para el botón de sonido
import SoundIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// Nuestros "mapas" de assets locales (asegúrate que la ruta sea correcta)
import { SoundMap } from '../components/soundMap';
import { IconMap} from '../components/iconsMap'
// Habilitamos la reproducción de audio
Sound.setCategory('Playback');

// --- Props que la tarjeta espera recibir ---
// ¡AQUÍ ESTÁ LA CLAVE!
// Definimos que este componente SÍ ACEPTA 'text' y 'pronunciation'
interface AlphabetCardProps {
  text: string;           // Ej: "Alpha"
  pronunciation: string;  // Ej: "Al-fa"
}

/**
 * Este es el componente de tu tarjeta.
 * Acepta 'text' y 'pronunciation' y se encarga de
 * buscar el icono SVG y el sonido MP3 correctos.
 */
const AlphabetCard = ({ text, pronunciation }: AlphabetCardProps) => {
    
    // 1. Obtenemos la letra inicial del texto, ej: "Alpha" -> "A"
    const letter = text.length > 0 ? text[0] : '?';
    
    // 2. Obtenemos el componente SVG correcto desde nuestro IconMap
    // Usamos 'text' ("Alpha") como clave
const TopIconComponent = IconMap[text as keyof typeof IconMap] || null;
    // 3. Obtenemos el archivo de sonido local desde nuestro SoundMap
    // Usamos 'text' ("Alpha") como clave
    const soundFile = SoundMap[text];

    /**
     * Función para reproducir el sonido.
     * Esta lógica ahora vive DENTRO de la tarjeta.
     */
    const playSound = () => {
        if (!soundFile) {
            console.warn(`Sonido no encontrado en SoundMap para: ${text}`);
            return;
        }

        // Usamos 'Sound' para cargar el archivo local (require)
        const sound = new Sound(soundFile, (err) => {
            if (err) {
                console.log(`Fallo al cargar el sonido para ${text}`, err);
                return;
            }
            
            // Sonido cargado, ¡reproducir!
            sound.play((success) => {
                if (!success) {
                    console.log(`Fallo en la reproducción del sonido para ${text}`);
                }
                // Libera la memoria después de reproducir
                sound.release(); 
            });
        });
    };

    // --- Renderizado del componente ---
    return (
        <View style={styles.card}>
            {/* Icono superior (SVG dinámico) */}
            <View style={styles.topIconContainer}>
                {TopIconComponent ? (
                    // Si encontramos el icono en IconMap, lo renderizamos
                    <TopIconComponent width={48} height={48} fill="#FFFFFF" />
                ) : (
                    // Un icono de 'fallback' si no se encuentra
                    <SoundIcon name="help" size={48} color="#FFFFFF" />
                )}
            </View>

            {/* Letra grande */}
            <Text style={styles.letterText}>{letter}</Text>

            {/* Nombre de la letra (ALPHA) */}
            <Text style={styles.nameText}>{text.toUpperCase()}</Text>

            {/* Pronunciación (Al-fa) */}
            <Text style={styles.pronunciationText}>{pronunciation}</Text>

            {/* Botón de Sonido */}
            <TouchableOpacity style={styles.soundButton} onPress={playSound}>
                <SoundIcon name="volume-high" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

// --- Estilos para la tarjeta ---
const styles = StyleSheet.create({
    card: {
        width: 180,
        height: 280, // Altura ajustada para la pronunciación
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo translúcido
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)', // Borde translúcido
        marginHorizontal: 10, // Espacio entre tarjetas
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between', // Distribuye el contenido
    },
    topIconContainer: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    nameText: {
        fontSize: 20,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    pronunciationText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)', // Color más suave
    },
    soundButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Botón translúcido
        borderRadius: 50, // Círculo perfecto
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AlphabetCard;
