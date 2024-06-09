import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

const useFonts = (fonts) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync(fonts);
      setFontsLoaded(true);
    })();
  }, []);

  return fontsLoaded;
};

export default useFonts;
