module.exports = function (api) {
  api.cache(true); // Performans için cache mekanizması
  return {
    presets: ['babel-preset-expo'], // Expo için gerekli Babel preset'i
    plugins: [
      [
        'module:react-native-dotenv', // Dotenv dosyası için eklenti
        {
          moduleName: '@env', // Değişkenleri @env'den çağırmak için ayar
          path: '.env', // .env dosyasının yolu
        },
      ],
    ],
  };
};
