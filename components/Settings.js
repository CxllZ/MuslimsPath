import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, ImageBackground, Image, SafeAreaView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list'
import axios from 'axios';
import * as Permissions from 'expo-notifications';

const Settings = ({ navigation }) => {
    const [ selectedCity, setSelectedCity] = useState();
    const [ selectedMosque, setSelectedMosque] = useState();
    const [ mosques1, setMosques] = useState();
    const [ disabledDropdown, setDisableDropdown] = useState('none');
    const [ notifPerms, setNotifPerms] = useState();

    async function checkNotifPerms() {
        const { status } = await Permissions.requestPermissionsAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
            setNotifPerms('*Permission to schedule local notifications not granted');
        }
    }

    useEffect(() => {
        checkNotifPerms();
    }, [])
    const cities = ['Bristol', 'London', 'Edinburgh', 'Bolton', 'Nelson', 'Derby', 'Trowbridge']

    return (
        <ImageBackground style={styles.container} source={require("../assets/wallpaper.jpg")}>
            <SelectList
                search={false}
                placeholder='Choose A City...'
                setSelected={(val) => setSelectedCity(val)} 
                data={cities} 
                save="value"
                boxStyles={styles.dropdown1BtnStyle}
                dropdownItemStyles={styles.dropdown1BtnItemStyle}
                onSelect={() => {
                    const selectedItem = selectedCity;
                    console.log(selectedItem);
                    const saveCity = async () => {
                        try{
                            await AsyncStorage.setItem("selectedCity", selectedItem);
                        } catch (err) {
                            alert(err);
                        }
                    }

                    axios.get(
                        "https://go2masjid.com/api/papi/loc_getcity.php?name="+selectedItem
                        ).then(function(response){
                            const mosques = [];

                            console.log(response.data.length)
                            
                            while (true) {
                                try {
                                    var amount = response.data.length;
                                } catch (err) {
                                    console.log(err)
                                }
                                
                                if (amount != undefined) {
                                    try {
                                        for(var i = 0; i < amount; i++){
                                            mosques.push(response.data[i].masjidname);
                                        }
                                        setMosques(mosques);
                                    } catch(err) {
                                        console.log(err)
                                    }
                                    break
                                }
                            }
                        }
                    )
                    saveCity();
                    setDisableDropdown("");
                }}
            />

            <Text></Text>

            <SafeAreaView style={{display: disabledDropdown}}>
                <SelectList
                    search={false}
                    placeholder='Choose A Mosque...'
                    setSelected={(val) => setSelectedMosque(val)}
                    data={mosques1} 
                    save="value"
                    boxStyles={styles.dropdown1BtnStyle}
                    dropdownItemStyles={styles.dropdown1BtnItemStyle}
                    onSelect={(selectedItem) => {
                        var selectedItem = selectedMosque;
                        const index = mosques1.findIndex(x => x == selectedItem);
                        console.log(selectedItem)
                        console.log(index);

                        const saveMosqueIndex = async () => {
                            try{
                                await AsyncStorage.setItem("mosqueIndex", index.toString());
                            } catch (err) {
                                alert(err);
                            }
                        }

                        saveMosqueIndex();

                        Alert.alert('Success', "The selected mosque is saved, click 'Back' to return")
                    }}
                />
            </SafeAreaView>

            <SafeAreaView style={styles.powered}>
                <Text style={{color: "white", fontWeight: "bold", alignSelf: 'flex-end'}}>Powered By</Text>
                <Image
                    style={styles.tinyLogo}
                    source={require("../assets/go2masjid_logo.png")}
                />
            </SafeAreaView>

            <SafeAreaView style={{alignSelf: 'flex-start', top: Dimensions.get('window').height / 4}}>
                <Text style={{color: "white", textAlign: 'center', alignSelf: 'flex-start', width: 150}}>{notifPerms}</Text>                    
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    dropdown1BtnStyle: { width: Dimensions.get('window').height / 3, height: 50, borderRadius: 8, backgroundColor: 'white' },
    dropdown1BtnItemStyle: {backgroundColor: 'white', borderColor: 'black', borderWidth: 0.5},
    tinyLogo: { width: 150, height: 30 },
    powered: {
        alignSelf: 'flex-end',
        top: Dimensions.get('window').height / 2.7
    }
  });

export default Settings;