import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const NearbyMosques = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const markerData = require('./mosques.json')

  return (
    <>
    {location ? (<MapView
                  style={styles.map}
                  showsUserLocation={true}
                  initialRegion={{
                    latitude: location?.coords.latitude ?? 51.5072,
                    longitude: location?.coords.longitude ?? 0.1276,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>

                  {markerData.map((marker, counter) => (
                    <Marker key={counter+1} coordinate={marker.coordinates} title={marker.title}/>
                  ))}
                  </MapView>)  : 
                  <View style={{backgroundColor: "#002331", justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <ActivityIndicator size="large" color="#fff" />
                  </View>}
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default NearbyMosques;