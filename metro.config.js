// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Obtenemos la configuración por defecto
const defaultConfig = getDefaultConfig.getDefaultValues(__dirname);

// Extraemos las extensiones de assets y de código fuente
const {
  resolver: { sourceExts, assetExts },
} = defaultConfig;

/**
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // Le decimos a Metro que use este transformador
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Quitamos 'svg' de la lista de 'assets' (imágenes estáticas)
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    // Agregamos 'svg' a la lista de 'source' (código fuente)
    sourceExts: [...sourceExts, 'svg'],
  },
};

// Unimos la configuración por defecto con nuestra configuración personalizada
module.exports = mergeConfig(defaultConfig, config);