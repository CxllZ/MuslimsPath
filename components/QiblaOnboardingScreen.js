import React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const Done = ({...props}) => (
    <TouchableOpacity style={{marginHorizontal: 20}} {...props}>
        <Text style={{color: '#fff', fontSize: 16}}>Done</Text>
    </TouchableOpacity>
)

const OnboardingScreen = ({navigation}) => {
    return (
        <Onboarding
            showSkip={true}
            DoneButtonComponent={Done}
            onDone={() => navigation.navigate('realQibla')}
            onSkip={() => navigation.navigate('realQibla')}
            pages={[
                {
                title: '',
                backgroundColor: '#002331',
                // title: 'Calibration',
                image: <SafeAreaView style={{alignItems: 'center'}}><Text style={{color: '#fff', fontSize: 26, textAlign: 'center', paddingBottom: 15, top: -100}}>Calibration</Text><Image source={require('../assets/numeric-1.png')} style={{ width: 100, height: 100 }} /></SafeAreaView>,
                subtitle: 'Find a location with minimal interference: Go to an open space away from large metallic objects, speakers, magnets, or other sources of magnetic interference.',
                },
                {
                title: '',
                backgroundColor: '#002331',
                image: <SafeAreaView style={{alignItems: 'center'}}><Text style={{color: '#fff', fontSize: 26, textAlign: 'center', paddingBottom: 15, top: -100}}>Calibration</Text><Image source={require('../assets/numeric-2.png')} style={{ width: 100, height: 100 }} /></SafeAreaView>,
                subtitle: 'Rotate your phone: Hold your phone in your hand and rotate it in a figure-eight motion, moving the phone around all three axes.',
                }
            ]}
        />
    )
}

export default OnboardingScreen;