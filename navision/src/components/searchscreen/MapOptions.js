import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet,View,TouchableOpacity} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
//icons
import NetworkHeart from '../../assets/icons/searchicons/NetworkHeart';
import SearchAI from '../../assets/icons/searchicons/SearchAI';
import SearchLocation from '../../assets/icons/searchicons/SearchLocation';
import Star from '../../assets/icons/searchicons/Star';


const MapOptions = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location ? location.latitude : 37.78825,
        longitude: location ? location.longitude : -122.4324,
        latitudeDelta: 0.01, // Daha dar bir alan gösterimi için
        longitudeDelta: 0.01,
      }}
    >
      {location && (
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="My Location"
          description="This is your current location"
        />
      )}
      <View style={styles.options}>
          <TouchableOpacity style={styles.icon}>
          <SearchAI width={24} height={24} color='grey'/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon1}>
          <SearchLocation width={24} height={24} color='grey' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon2}>
          <NetworkHeart width={22} height={22} color='grey' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon3}>
          <Star width={22} height={22} color='grey' />
          </TouchableOpacity>
          </View>
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width - 33,
    height: 200,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginLeft: 20,
    marginTop: 20,
  },
  //options
  options: {
     width: 55,
     height: 199,
     backgroundColor: "background: rgba(255, 255, 255, 0.5)",
     marginLeft:305,
     
   },
   icon: {
     color: "rgba(128,128,128,1)",
     fontSize: 24,
     height: 27,
     width: 24,
     marginTop: 20,
     marginLeft: 14
   },
   icon1: {
     color: "rgba(128,128,128,1)",
     fontSize: 24,
     height: 27,
     width: 24,
     marginTop: 16,
     marginLeft: 14
   },
   icon2: {
     color: "rgba(128,128,128,1)",
     fontSize: 24,
     height: 27,
     width: 24,
     marginTop: 19,
     marginLeft: 14
   },
   icon3: {
     color: "rgba(128,128,128,1)",
     fontSize: 24,
     height: 27,
     width: 24,
     marginTop: 18,
     marginLeft: 14
   }
});

export default MapOptions;
