import React from 'react';
import { StyleSheet, SafeAreaView, Text, Image } from 'react-native';

const OnboardingScreen = ({navigation}) => {
    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={{width: 150, height: 90, top: -100}}
                source={require('../assets/numeric-1.png')}
            />
            <Text style={{color: "white", width: "70%", textAlign: 'center', fontSize: 18, top: -80}}>
                Find a location with minimal interference: Go to an open space away from large metallic objects, speakers, magnets, or other sources of magnetic interference.
            </Text>
            <Image
                style={{width: 150, height: 90}}
                source={require('../assets/numeric-2.png')}
            />
            <Text style={{color: "white", width: "70%", textAlign: 'center', fontSize: 18, bottom: -50}}>
                Rotate your phone: Hold your phone in your hand and rotate it in a figure-eight motion, moving the phone around all three axes.
            </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#002331' }
  });

export default OnboardingScreen;