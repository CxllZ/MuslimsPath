// Copyright @RahulHaque
// https://github.com/rahulhaque/compass-react-native-expo

import React, { useState, useEffect } from 'react';
import { Image, View, Text, Dimensions } from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';

const { height, width } = Dimensions.get('window');

export default Qibla = ({navigation}) => {
  const [subscription, setSubscription] = useState(null);
  const [magnetometer, setMagnetometer] = useState(0);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    _toggle();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((data) => {
        setMagnetometer(_angle(data));
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _angle = (magnetometer) => {
    const alpha = 0.2; // Smoothing factor
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
      // Apply smoothing filter
      x = alpha * x + (1 - alpha) * _lastMagnetometer.x;
      y = alpha * y + (1 - alpha) * _lastMagnetometer.y;
      z = alpha * z + (1 - alpha) * _lastMagnetometer.z;
      _lastMagnetometer = { x, y, z };
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };
  
  let _lastMagnetometer = { x: 0, y: 0, z: 0 };  

  const _direction = (degree) => {
    if (degree >= 22.5 && degree < 67.5) {
      return 'NE';
    }
    else if (degree >= 67.5 && degree < 112.5) {
      return 'E';
    }
    else if (degree >= 112.5 && degree < 157.5) {
      return 'SE';
    }
    else if (degree >= 157.5 && degree < 202.5) {
      return 'S';
    }
    else if (degree >= 202.5 && degree < 247.5) {
      return 'SW';
    }
    else if (degree >= 247.5 && degree < 292.5) {
      return 'W';
    }
    else if (degree >= 292.5 && degree < 337.5) {
      return 'NW';
    }
    else {
      return 'N';
    }
  };

  // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
  const _degree = (magnetometer) => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  useEffect(() => {
    let subscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      subscription = await Location.watchPositionAsync({}, (newLocation) => {
        setLocation(newLocation);
      });
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  let lat = null;
  let long = null;

  if (location) {
    lat = location.coords.latitude;
    long = location.coords.longitude;
  }

  var latitude = lat;
  var longitude = long;

  // Calculate qibla direction
  var phiK = 21.4 * Math.PI / 180.0;
  var lambdaK = 39.8 * Math.PI / 180.0;
  var phi = latitude * Math.PI / 180.0;
  var lambda = longitude * Math.PI / 180.0;
  var y = Math.sin(lambdaK - lambda);
  var x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  var qibla = Math.atan2(y, x) * 180.0 / Math.PI;

  // Convert qibla direction from degrees to compass direction
  if (qibla < 0) {
    qibla += 360;
  }
  var compass;
  if (qibla >= 337.5 || qibla < 22.5) {
    compass = "north";
  } else if (qibla >= 22.5 && qibla < 67.5) {
    compass = "northeast";
  } else if (qibla >= 67.5 && qibla < 112.5) {
    compass = "east";
  } else if (qibla >= 112.5 && qibla < 157.5) {
    compass = "southeast";
  } else if (qibla >= 157.5 && qibla < 202.5) {
    compass = "south";
  } else if (qibla >= 202.5 && qibla < 247.5) {
    compass = "southwest";
  } else if (qibla >= 247.5 && qibla < 292.5) {
    compass = "west";
  } else if (qibla >= 292.5 && qibla < 337.5) {
    compass = "northwest";
  }

  return (
    <Grid style={{ backgroundColor: '#002331' }}>
      <Row style={{ alignItems: 'center' }} size={.9}>
        <Col style={{ alignItems: 'center' }}>
          <Text
            style={{
              color: '#fff',
              fontSize: height / 26,
              fontWeight: 'bold'
            }}>
            {_direction(_degree(magnetometer))}
          </Text>
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={.1}>
        <Col style={{ alignItems: 'center' }}>
          <View style={{ position: 'absolute', width: width, alignItems: 'center', top: -15 }}>
            <Image source={require('../assets/compass_pointer.png')} style={{
              height: height / 16,
              resizeMode: 'contain',
            }} />
          </View>
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={2}>
        <Text style={{
          color: '#fff',
          fontSize: height / 27,
          width: width,
          position: 'absolute',
          textAlign: 'center' }}>{_degree(magnetometer)}°</Text>

        <Col style={{ alignItems: 'center' }}>
          <Image source={require("../assets/compass_bg.png")} style={{
            height: width - 80,
            justifyContent: 'center',
            alignItems: 'center',
            resizeMode: 'contain',
            transform: [{ rotate: 360 - magnetometer + 'deg' }]
          }} />
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={1}>
        <Col style={{ alignItems: 'center' }}>
          <Text style={{color: '#fff', fontSize: 24}}>Qibla: {qibla.toFixed(0)}° {compass}</Text>
        </Col>
      </Row>
    </Grid>
  );
}