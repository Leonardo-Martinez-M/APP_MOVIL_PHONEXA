// FooterNavBar.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Definición de las constantes de diseño basadas en la imagen de propiedades
const DESIGN_PROPS = {
  HEIGHT: 56,
  WIDTH: 240, // Se recomienda usar '100%' o un porcentaje para hacerlo responsivo
  PADDING_HORIZONTAL: 20, // Añadido para espaciar los íconos
  BORDER_RADIUS: 16,
  BORDER_WIDTH: 1,
  BORDER_COLOR_RGB: 'rgba(5, 130, 82, 0.32)', 
  SHADOW_COLOR: 'rgba(0, 0, 0, 0.16)', 
  SHADOW_OFFSET_Y: 2,
  SHADOW_BLUR: 8,
};

// Componente para un único ícono del navbar
const FooterIcon = ({ name, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.iconButton}>
    <Icon name={name} size={24} color="white" />
  </TouchableOpacity>
);

export default function FooterNavBar({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.navBar}>
        
        {/* Ícono de Perfil (Persona) */}
        <FooterIcon 
          name="account-outline" 
          onPress={() => { /* navigation.navigate('Profile') */ }} 
        />
        
        {/* Ícono de Inicio (Home) - Nota: En la imagen principal, esta es la pantalla, por lo que podría no ser necesario */}
        <FooterIcon 
          name="home-outline" 
          onPress={() => { /* navigation.navigate('Home') */ }} 
        />
        
        {/* Ícono de Configuración (Gear) */}
        <FooterIcon 
          name="cog-outline" 
          onPress={() => { /* navigation.navigate('Settings') */ }} 
        />
        
        {/* Ícono de Salida (Logout) */}
        <FooterIcon 
          name="exit-to-app" 
          onPress={() => { /* logout() */ }} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Fija el contenedor en la parte inferior de la pantalla
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100, // Asegura que esté por encima del resto del contenido
  },
  navBar: {
    // Usamos un ancho del 90% en lugar de 240px fijos para responsividad
    width: '90%', 
    maxWidth: DESIGN_PROPS.WIDTH, // Máximo de 240px si quieres apegarte al diseño
    height: DESIGN_PROPS.HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribuye los íconos uniformemente
    alignItems: 'center',
    
    // Borde
    borderWidth: DESIGN_PROPS.BORDER_WIDTH,
    borderColor: DESIGN_PROPS.BORDER_COLOR_RGB,
    borderRadius: DESIGN_PROPS.BORDER_RADIUS,

    // Fondo (El color oscuro de la imagen es similar al fondo de la pantalla)
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Fondo semitransparente

    // Sombras (iOS)
    shadowColor: 'black', // Usar 'black' o el color de sombra
    shadowOffset: { width: 0, height: DESIGN_PROPS.SHADOW_OFFSET_Y },
    shadowOpacity: 0.16, // Corresponde al 16%
    shadowRadius: DESIGN_PROPS.SHADOW_BLUR / 2, // RN usa un cálculo diferente para el radio de sombra

    // Sombra (Android - Elevation)
    elevation: 10, // Un valor de elevación general para la sombra de Android
  },
  iconButton: {
    padding: 10, // Área de toque
  },
});