export const getIcon = (fileName: string) => {
  try {
    // Limpiar el nombre - quitar extensión y cualquier ruta
    const cleanName = fileName
      .replace('.svg', '')
      .replace('.png', '')
      .replace('.jpg', '')
      .toLowerCase()
      .split('/')
      .pop() || 'alpha'; // Extraer solo el nombre del archivo

    console.log(`Buscando ícono: "${fileName}" -> "${cleanName}"`);

    // Mapeo consistente de íconos - todos con rutas relativas correctas
    const icons: Record<string, any> = {
      'alpha': require('../assets/icons/alpha.jpg'),
      'bravo': require('../assets/icons/bravo.svg'),
      'charlie': require('../assets/icons/charlie.svg'),
      'delta': require('../assets/icons/delta.svg'),
      'echo': require('../assets/icons/echo.svg'),
      'foxtrot': require('../assets/icons/foxtrot.svg'),
      'golf': require('../assets/icons/golf.svg'),
      'hotel': require('../assets/icons/hotel.svg'),
      'india': require('../assets/icons/india.svg'),
      'juliet': require('../assets/icons/juliet.svg'),
      'kilo': require('../assets/icons/kilo.svg'),
      'lima': require('../assets/icons/lima.svg'),
      'mike': require('../assets/icons/mike.svg'),
      'november': require('../assets/icons/november.svg'),
      'oscar': require('../assets/icons/oscar.svg'),
      'papa': require('../assets/icons/papa.svg'),
      'quebec': require('../assets/icons/quebec.svg'),
      'romeo': require('../assets/icons/romeo.svg'),
      'sierra': require('../assets/icons/sierra.svg'),
      'tango': require('../assets/icons/tango.svg'),
      'uniform': require('../assets/icons/uniform.svg'),
      'victor': require('../assets/icons/victor.svg'),
      'whiskey': require('../assets/icons/whiskey.svg'),
      'xray': require('../assets/icons/x-ray.svg'), // Cambiado de 'x-ray' a 'xray'
      'x-ray': require('../assets/icons/x-ray.svg'),
      'yankee': require('../assets/icons/yankee.svg'),
      'zulu': require('../assets/icons/zulu.svg'),
    };

    const icon = icons[cleanName];
    
    if (!icon) {
      console.warn(`❌ No se encontró ícono para: "${cleanName}" (original: "${fileName}")`);
      console.log('Íconos disponibles:', Object.keys(icons));
    } else {
      console.log(`✅ Ícono encontrado: ${cleanName}`);
    }

    return icon;

  } catch (error) {
    console.warn('❌ Error al cargar ícono:', fileName, error);
    return null;
  }
};

export const getSound = (fileName: string) => {
  try {
    // Limpiar el nombre - similar a getIcon
    const cleanName = fileName
      .replace('.mp3', '')
      .replace('.wav', '')
      .toLowerCase()
      .split('/')
      .pop() || 'alpha';

    console.log(`Buscando sonido: "${fileName}" -> "${cleanName}"`);

    const sounds: Record<string, any> = {
      'alpha': require('../assets/sounds/alpha.mp3'),
      'bravo': require('../assets/sounds/bravo.mp3'),
      'charlie': require('../assets/sounds/charlie.mp3'),
      'delta': require('../assets/sounds/delta.mp3'),
      'echo': require('../assets/sounds/echo.mp3'),
      'foxtrot': require('../assets/sounds/foxtrot.mp3'),
      'golf': require('../assets/sounds/golf.mp3'),
      'hotel': require('../assets/sounds/hotel.mp3'),
      'india': require('../assets/sounds/india.mp3'),
      'juliet': require('../assets/sounds/juliet.mp3'),
      'kilo': require('../assets/sounds/kilo.mp3'),
      'lima': require('../assets/sounds/lima.mp3'),
      'mike': require('../assets/sounds/mike.mp3'),
      'november': require('../assets/sounds/november.mp3'),
      'oscar': require('../assets/sounds/oscar.mp3'),
      'papa': require('../assets/sounds/papa.mp3'),
      'quebec': require('../assets/sounds/quebec.mp3'),
      'romeo': require('../assets/sounds/romeo.mp3'),
      'sierra': require('../assets/sounds/sierra.mp3'),
      'tango': require('../assets/sounds/tango.mp3'),
      'uniform': require('../assets/sounds/uniform.mp3'),
      'victor': require('../assets/sounds/victor.mp3'),
      'whiskey': require('../assets/sounds/whiskey.mp3'),
      'xray': require('../assets/sounds/x-ray.mp3'), // Cambiado de 'x-ray' a 'xray'
      'x-ray': require('../assets/sounds/x-ray.mp3'),
      'yankee': require('../assets/sounds/yankee.mp3'),
      'zulu': require('../assets/sounds/zulu.mp3'),
    };

    const sound = sounds[cleanName];
    
    if (!sound) {
      console.warn(`❌ No se encontró sonido para: "${cleanName}" (original: "${fileName}")`);
      console.log('Sonidos disponibles:', Object.keys(sounds));
    } else {
      console.log(`✅ Sonido encontrado: ${cleanName}`);
    }

    return sound;

  } catch (error) {
    console.warn('❌ Error al cargar sonido:', fileName, error);
    return null;
  }
};