import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;
const HEADER_HEIGHT = 70;
const HEADER_SCROLL_DISTANCE = 70; // Distancia de scroll para ocultar completamente

// Datos de ejemplo para la galería de ropa
const clothingItems = [
  {
    id: 1,
    name: 'Camiseta Básica',
    price: '$129.99',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Jeans Slim Fit',
    price: '$159.99',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Vestido Floral',
    price: '$249.99',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Chaqueta Denim',
    price: '$279.99',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Sudadera con Capucha',
    price: '$245.99',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    name: 'Falda Plisada',
    price: '$139.99',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 9,
    name: 'Abrigo de Invierno',
    price: '$289.99',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 10,
    name: 'Zapatos Casuales',
    price: '$769.99',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
    {
    id: 11,
    name: 'Camiseta Básica',
    price: '$129.99',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 12,
    name: 'Jeans Slim Fit',
    price: '$259.99',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 13,
    name: 'Vestido Floral',
    price: '$149.99',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 14,
    name: 'Chaqueta Denim',
    price: '$279.99',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
];

export default function HomeScreen() {
  const [scrollY] = useState(new Animated.Value(0));
  const scrollViewRef = useRef(null);
  const lastOffsetY = useRef(0);
  const scrollDirection = useRef('up');

  // Animación para ocultar/mostrar el header completamente
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  // Opacidad del header que desaparece al hacer scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: { nativeEvent: { contentOffset: { y: number } } }) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        
        // Determinar la dirección del scroll
        if (offsetY > lastOffsetY.current) {
          scrollDirection.current = 'down';
        } else if (offsetY < lastOffsetY.current) {
          scrollDirection.current = 'up';
        }
        
        lastOffsetY.current = offsetY;
      }
    }
  );

  return (
    <View style={styles.container}>
      {/* Header que desaparece completamente */}
      <Animated.View style={[
        styles.header, 
        { 
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity
        }
      ]}>
        <Text style={styles.headerTitle}>Nuestra Colección</Text>
        <Text style={styles.headerSubtitle}>Descubre las últimas tendencias</Text>
      </Animated.View>
      
      {/* Galería de productos */}
      <Animated.ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <View style={styles.productsGrid}>
          {clothingItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.productCard}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECEF',
    zIndex: 10,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT + 10, // Compensar el espacio del header
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4C1D95',
  },
});