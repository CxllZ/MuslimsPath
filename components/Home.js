import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, Dimensions, TouchableOpacity, Image, ImageBackground, Alert } from "react-native";
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-reanimated-table';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import momentHijri from 'moment-hijri';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-notifications';


function getCurrentHijriDate() {
    const currentDate = new Date();
    const hijriDate = momentHijri(currentDate).locale('en').format('iD iMMMM iYYYY');
    return hijriDate;
}

const Home = ({ navigation }) => { 
    const d = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const todayHijri = getCurrentHijriDate();
    const today = days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();

    const [mosqueAddr, setMosqueAddr] = useState();
    const [time, setTime] = useState();
    const [newCity, setNewCity] = useState();
    const [newMosqueIndex, setNewMosqueIndex] = useState();
    const [check, setCheck] = useState(true);
    const [isConnected, setIsConnected] = useState(true);
    
    const [prayerTimes0, setprayerTimes0] = useState();
    const [prayerTimes1, setprayerTimes1] = useState();
    const [prayerTimes2, setprayerTimes2] = useState();
    const [prayerTimes3, setprayerTimes3] = useState();
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().getTime());
        }, 1000);

        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
          });

        const asyncLoader = navigation.addListener('focus', () => {
            loadCity().then(async() => await loadMosqueIndex());
        });

        NetInfo.fetch().then(state => {
            if (isConnected !== true) {
                Alert.alert('Warning', 'An Internet Connection Is Required To Load Prayer Times')
            }
        })

        return () => {
            unsubscribe();
            asyncLoader;
        };
    }, []);
      
    const loadCity = async () => {
        try {
            let selectedCity = await AsyncStorage.getItem("selectedCity");
            if (selectedCity !== null) {
                setNewCity(selectedCity);
                setCheck(true);
            }
        } catch (err) {
            alert(err);
        }
    }

    const loadMosqueIndex = async () => {
        try {
            let mosqueIndex = await AsyncStorage.getItem("mosqueIndex");
            if (mosqueIndex !== null) {
                setNewMosqueIndex(mosqueIndex);
                setCheck(true);
            }
        } catch (err) {
            alert(err);
        }
    }

    const getTimes = () => {
        axios.get(
            "https://go2masjid.com/api/papi/loc_getcity.php?name=" + newCity
        ).then(function(response) {
            try {
                const prayerTimesList0 = [ [], [], [], [], [], [] ];
                const prayerTimesList1 = [ [], [], [], [], [], [] ];
                const prayerTimesList2 = [ [], [], [], [], [], [] ];
                const prayerTimesList3 = [ [], [], [], [], [], [] ];

                setMosqueAddr(response.data[newMosqueIndex].masjidname + ", " + response.data[newMosqueIndex].city);
                prayerTimesList0[0].push(response.data[newMosqueIndex].salats[0].fajarstart, response.data[newMosqueIndex].salats[0].fajarjamat);
                prayerTimesList0[1].push(response.data[newMosqueIndex].salats[0].sunrise, '---');
                prayerTimesList0[2].push(days[d.getDay()] == 'Fri' ? response.data[newMosqueIndex].salats[0].jumma : response.data[newMosqueIndex].salats[0].zuhrstart, days[d.getDay()] == 'Fri' ? '---' : response.data[newMosqueIndex].salats[0].zuhrjamat);
                prayerTimesList0[3].push(response.data[newMosqueIndex].salats[0].asarstart, response.data[newMosqueIndex].salats[0].asarjamat);
                prayerTimesList0[4].push(response.data[newMosqueIndex].salats[0].maghrib, response.data[newMosqueIndex].salats[0].maghrib);
                prayerTimesList0[5].push(response.data[newMosqueIndex].salats[0].eshastart, response.data[newMosqueIndex].salats[0].eshajamat);
                setprayerTimes0(prayerTimesList0);

                prayerTimesList1[0].push(response.data[newMosqueIndex].salats[1].fajarstart, response.data[newMosqueIndex].salats[1].fajarjamat);
                prayerTimesList1[1].push(response.data[newMosqueIndex].salats[1].sunrise, '---');
                prayerTimesList1[2].push(days[d.getDay()] == 'Fri' ? response.data[newMosqueIndex].salats[1].jumma : response.data[newMosqueIndex].salats[1].zuhrstart, days[d.getDay()] == 'Fri' ? '---' : response.data[newMosqueIndex].salats[1].zuhrjamat);
                prayerTimesList1[3].push(response.data[newMosqueIndex].salats[1].asarstart, response.data[newMosqueIndex].salats[1].asarjamat);
                prayerTimesList1[4].push(response.data[newMosqueIndex].salats[1].maghrib, response.data[newMosqueIndex].salats[1].maghrib);
                prayerTimesList1[5].push(response.data[newMosqueIndex].salats[1].eshastart, response.data[newMosqueIndex].salats[1].eshajamat);
                setprayerTimes1(prayerTimesList1);

                prayerTimesList2[0].push(response.data[newMosqueIndex].salats[2].fajarstart, response.data[newMosqueIndex].salats[2].fajarjamat);
                prayerTimesList2[1].push(response.data[newMosqueIndex].salats[2].sunrise, '---');
                prayerTimesList2[2].push(days[d.getDay()] == 'Fri' ? response.data[newMosqueIndex].salats[2].jumma : response.data[newMosqueIndex].salats[2].zuhrstart, days[d.getDay()] == 'Fri' ? '---' : response.data[newMosqueIndex].salats[2].zuhrjamat);
                prayerTimesList2[3].push(response.data[newMosqueIndex].salats[2].asarstart, response.data[newMosqueIndex].salats[2].asarjamat);
                prayerTimesList2[4].push(response.data[newMosqueIndex].salats[2].maghrib, response.data[newMosqueIndex].salats[2].maghrib);
                prayerTimesList2[5].push(response.data[newMosqueIndex].salats[2].eshastart, response.data[newMosqueIndex].salats[2].eshajamat);
                setprayerTimes2(prayerTimesList2);

                prayerTimesList3[0].push(response.data[newMosqueIndex].salats[3].fajarstart, response.data[newMosqueIndex].salats[2].fajarjamat);
                prayerTimesList3[1].push(response.data[newMosqueIndex].salats[3].sunrise, '---');
                prayerTimesList3[2].push(days[d.getDay()] == 'Fri' ? response.data[newMosqueIndex].salats[3].jumma : response.data[newMosqueIndex].salats[3].zuhrstart, days[d.getDay()] == 'Fri' ? '---' : response.data[newMosqueIndex].salats[3].zuhrjamat);
                prayerTimesList3[3].push(response.data[newMosqueIndex].salats[3].asarstart, response.data[newMosqueIndex].salats[3].asarjamat);
                prayerTimesList3[4].push(response.data[newMosqueIndex].salats[3].maghrib, response.data[newMosqueIndex].salats[3].maghrib);
                prayerTimesList3[5].push(response.data[newMosqueIndex].salats[3].eshastart, response.data[newMosqueIndex].salats[3].eshajamat);
                setprayerTimes3(prayerTimesList3);
            } catch (err) {
                console.log(err);
            }
        })
    }

    if (check == true) {
        setCheck(false);
        if (newMosqueIndex >= 0 && newMosqueIndex <= 200 && isConnected == true) {
            getTimes()
        }
    }

    useEffect(() => {
        const asynchronous = async () => {
            if (prayerTimes3 !== undefined) {
                try {
                    await Notifications.cancelAllScheduledNotificationsAsync()
                    console.log('All pending notifications have been canceled.');
                } catch (error) {
                    console.error('Error canceling notifications:', error);
                }
                scheduleLocalNotification()
            }
        } 
        
        asynchronous();
    }, [prayerTimes3]);

    async function scheduleLocalNotification() {
        const { status } = await Permissions.requestPermissionsAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
            console.log('Permission to schedule local notifications not granted');
            return;
        }
        
        const allScheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
        const existingNotification = allScheduledNotifications.find(
            notification => notification.identifier === 'notifications'
        );

        
        
        if (existingNotification) {
            console.log('notification already scheduled');
        }
        
        const threeDayNotifier = {
            content: {
                title: 'Please Open The App',
                body: 'Please open the app to maintain notifications.',
                sound: 'default',
            },
            trigger: {
                seconds: 259200, // 3 days
                repeats: true,
            },
            identifier: 'notifications',
        };
        await Notifications.scheduleNotificationAsync(threeDayNotifier);
        
        function pt(num){
            if (num == 0) {
                return prayerTimes0
            } else if (num == 1) {
                return prayerTimes1
            } else if (num == 2) {
                return prayerTimes2
            } else if (num == 3) {
                return prayerTimes3
            }
        }


        for (let i = 0; i < 4; i++) {
            let time = pt(i);
            while (time !== undefined) {
                console.log('-'.repeat(50));
                //  FAJAR START TIME
                let fajarStart = {
                    content: {
                        title: 'Fajar Start Time',
                        body: 'Fajar has started at ' + time[0][0] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[0][0]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled fajar start for time: ' + time[0][0] + ' with time difference: ' + timeDifference(i, time[0][0]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(fajarStart);

                //  FAJAR JAMAAT TIME
                let fajarJamaat = {
                    content: {
                        title: 'Fajar Jamaat Time',
                        body: 'Fajar jamaat has started at ' + time[0][1] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[0][1]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled fajar jamaat for time: ' + time[0][1] + ' with time difference: ' + timeDifference(i, time[0][1]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(fajarJamaat);

                //  SUNRISE START TIME
                let sunriseStart = {
                    content: {
                        title: 'Sunrise Start Time',
                        body: 'Sunrise has started at ' + time[1][0] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[1][0]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled sunrise start for time: ' + time[1][0] + ' with time difference: ' + timeDifference(i, time[1][0]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(sunriseStart);

                // ZUHR/Jummah START TIME
                let zuhrJummahStart = {
                    content: {
                        title: timeDifference(i, time[2][0]).date2Day == '5' ? 'Jummah (Khutbah) Start Time' : 'Zuhr Start Time',
                        body: timeDifference(i, time[2][0]).date2Day == '5' ? 'Jummah (Khutbah)' : 'Zuhr' + ' has started at ' + time[2][0] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[2][0]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log(timeDifference(i, time[2][0]).date2Day == '5' ? 'Scheduled Jummah (Khutbah) start for time: ' + time[2][0] + ' with time difference: ' + timeDifference(i, time[2][0]).diffInSeconds : 'Scheduled zuhr start for time: ' + time[2][0] + ' with time difference: ' + timeDifference(i, time[2][0]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(zuhrJummahStart);

                //  ZUHR JAMAAT TIME
                let zuhrJamaat = {
                    content: {
                        title: 'Zuhr Jamaat Time',
                        body: 'Zuhr jamaat has started at ' + time[2][1] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[2][1]).diffInSeconds,
                        repeats: false,
                    },
                };

                /* The code is checking if the day of the week for the second time in the `time` array
                is equal to '5' (which represents Friday). If it is not Friday, it logs a message
                with the time difference between the current time and the second time in the `time`
                array. It then schedules a notification for the Zuhr jamaat (a congregational
                prayer) using the `Notifications` API. */
                timeDifference(i, time[2][0]).date2Day == '5' ? {} : console.log('Scheduled Zuhr jamaat for time: ' + time[2][1] + ' with time difference: ' + timeDifference(i, time[2][1]).diffInSeconds);
                timeDifference(i, time[2][0]).date2Day == '5' ? {} : await Notifications.scheduleNotificationAsync(zuhrJamaat);

                //  ASR START TIME
                let asrStart = {
                    content: {
                        title: 'Asr Start Time',
                        body: 'Asr has started at ' + time[3][0] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[3][0]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled asr start for time: ' + time[3][0] + ' with time difference: ' + timeDifference(i, time[3][0]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(asrStart);

                //  ASR JAMAAT TIME
                let asrJamaat = {
                    content: {
                        title: 'Asr Jamaat Time',
                        body: 'Asr jamaat has started at ' + time[3][1] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[3][1]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled fajar jamaat for time: ' + time[3][1] + ' with time difference: ' + timeDifference(i, time[3][1]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(asrJamaat);

                //  MAGHRIB START TIME
                let maghribStart = {
                    content: {
                        title: 'Maghrib Start Time',
                        body: 'Maghrib has started at ' + time[4][0] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[4][0]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled maghrib start for time: ' + time[4][0] + ' with time difference: ' + timeDifference(i, time[4][0]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(maghribStart);

                //  MAGHRIB JAMAAT TIME
                let maghribJamaat = {
                    content: {
                        title: 'Maghrib Jamaat Time',
                        body: 'Maghrib jamaat has started at ' + time[4][1] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[4][1]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled fajar start for time: ' + time[4][1] + ' with time difference: ' + timeDifference(i, time[4][1]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(maghribJamaat);

                //  ISHA START TIME
                let ishaStart = {
                    content: {
                        title: 'Isha Start Time',
                        body: 'Isha has started at ' + time[5][0] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[5][0]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled Isha start for time: ' + time[5][0] + ' with time difference: ' + timeDifference(i, time[5][0]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(ishaStart);

                //  ISHA JAMAAT TIME
                let ishaJamaat = {
                    content: {
                        title: 'Isha Jamaat Time',
                        body: 'Isha jamaat has started at ' + time[5][1] + '.',
                        sound: 'default',
                    },
                    trigger: {
                        seconds: timeDifference(i, time[5][1]).diffInSeconds,
                        repeats: false,
                    },
                };
                console.log('Scheduled isha jamaat for time: ' + time[5][1] + ' with time difference: ' + timeDifference(i, time[5][1]).diffInSeconds);
                await Notifications.scheduleNotificationAsync(ishaJamaat);
                break
            }
        }
   
    }

    async function printScheduledNotifications() {
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
        console.log(scheduledNotifications);
    }

    // printScheduledNotifications()

    function timeDifference(day, time) {
        const dst = moment(new Date()).isDST();
        const [hrs, mins] = time.split(':');
        if (dst == true) {
            const date1 = moment(new Date()).add(1, 'hour'); // daylight saving time
            const date2 = moment(new Date()).hour(hrs).minute(mins).second(0).add(1, 'hour').add(day, 'day');

            // calculate the difference in seconds
            const diffInSeconds = date2.diff(date1, 'seconds');

            const date2Day = date2.day();

            return { diffInSeconds, date2Day};
        } else {
            const date1 = moment(new Date())
            const date2 = moment(new Date()).hour(hrs).minute(mins).second(0).add(1, 'hour').add(day, 'day');

            // calculate the difference in seconds
            const diffInSeconds = date2.diff(date1, 'seconds');

            const date2Day = date2.day();

            return { diffInSeconds, date2Day};
        }
    }

    // const remove = async() => {
    //     await AsyncStorage.removeItem("selectedCity");
    //     await AsyncStorage.removeItem("mosqueIndex");
    // }
    // remove();

    const state = {
        tableHead: ['', 'Start', 'Jamaat'],
        tableTitle: ['Fajr', 'Sunrise', days[d.getDay()] == 'Fri' ? 'Jummah\n(Khutbah)' : 'Zuhr', 'Asr', 'Maghrib', 'Isha'],
        tableData: prayerTimes0
    };
    const nextSalah = () => {
        var da = new Date();
        var newdate = moment(new Date()).format('YYYY-MM-DD');
        var nextdate = moment().add(1, 'days').format('YYYY-MM-DD');
        var prevdate = moment().subtract(1, 'days').format('YYYY-MM-DD');

        const fajr = moment(newdate + " " + prayerTimes0[0][0]);
        const nextFajr = moment(nextdate + " " + prayerTimes0[0][0]);
        const sunrise = moment(newdate + " " + prayerTimes0[1][0]);
        const zuhr = moment(newdate + " " + prayerTimes0[2][0]);
        const asr = moment(newdate + " " + prayerTimes0[3][0]);
        const maghrib = moment(newdate + " " + prayerTimes0[4][0]);
        const isha = moment(newdate + " " + prayerTimes0[5][0]);
        const prevIsha = moment(prevdate + " " + prayerTimes0[5][0]);

        if (da.getTime() >= new Date(isha).getTime() && da.getTime() <= new Date(nextFajr).getTime() || da.getTime() >= new Date(prevIsha).getTime() && da.getTime() <= new Date(fajr).getTime()) {
            const timeLeft = moment.utc(nextFajr.diff(moment())).format("HH:mm:ss");
            const salah = "Fajr";

            return [salah, timeLeft];
        } else if (da.getTime() >= new Date(fajr).getTime() && da.getTime() <= new Date(sunrise).getTime()) {
            const timeLeft = moment.utc(sunrise.diff(moment())).format("HH:mm:ss");
            const salah = "Sunrise";

            return [salah, timeLeft];
        } else if (da.getTime() >= new Date(sunrise).getTime() && da.getTime() <= new Date(zuhr)) {
            const timeLeft = moment.utc(zuhr.diff(moment())).format("HH:mm:ss");
            const salah = days[d.getDay()] == 'Fri' ? 'Jummah\n(Khutbah)' : "Zuhr";

            return [salah, timeLeft];
        } else if (da.getTime() >= new Date(zuhr).getTime() && da.getTime() <= new Date(asr)) {
            const timeLeft = moment.utc(asr.diff(moment())).format("HH:mm:ss");
            const salah = "Asr";

            return [salah, timeLeft];
        } else if (da.getTime() >= new Date(asr).getTime() && da.getTime() <= new Date(maghrib)) {
            const timeLeft = moment.utc(maghrib.diff(moment())).format("HH:mm:ss");
            const salah = "Maghrib";

            return [salah, timeLeft];
        } else if (da.getTime() >= new Date(maghrib).getTime() && da.getTime() <= new Date(isha)) {
            const timeLeft = moment.utc(isha.diff(moment())).format("HH:mm:ss");
            const salah = "Isha";

            return [salah, timeLeft];
        }
    };

    const tillNextSalah = () => {
        try {
            return "-" + nextSalah()[1];
        } catch (err) {
            return "-----"
        }
    }

    const whatIsNextSalah = () => {
        try {
            return nextSalah()[0];
        } catch (err) {
            return "---"
        }
    }

  return (
    <ImageBackground style={styles.container} source={require("../assets/wallpaper.jpg")} /*blurRadius={2}*/>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')} >
          <Image source={require("../assets/cog-outline.png")} style={styles.image}/>
        </TouchableOpacity>

        <SafeAreaView style={{alignItems: 'center', top: -25}}>
          <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Next</Text>
          <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold', top: 5}}>{whatIsNextSalah()}</Text>
          <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold', top: 5}}>{tillNextSalah()}</Text>
        </SafeAreaView>


        <SafeAreaView style={{width: Dimensions.get('window').width - 30}}>
            <Text style={{fontSize: 15, color: 'white', fontWeight: 'bold', top: -10}}>Selected Mosque: <Text style={{fontSize: 15, color: 'red', fontWeight: 'normal', top: -10}}>{mosqueAddr == undefined ? "Click The Settings Icon To Select A Mosque" : mosqueAddr}</Text></Text>
            <Text></Text>
            <Text style={{fontSize: 14, color: 'white'}}>{today}</Text>
            <Text style={{fontSize: 14, color: 'white'}}>{todayHijri}</Text>
            <Text></Text>
        </SafeAreaView>

        <Table borderStyle={{borderWidth: 0.5}}>
          <Row data={state.tableHead} flexArr={[1, 2, 2]} style={styles.head} textStyle={styles.text}/>
          <TableWrapper style={styles.wrapper}>
              <Col data={state.tableTitle} style={styles.title} heightArr={[40, 40]} textStyle={styles.rowText}/>
              <Rows data={state.tableData} flexArr={[2, 2]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper>
        </Table>

        <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },

  head: {
      height: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  wrapper: {
      flexDirection: 'row',
      height: 240,
      width: Dimensions.get('window').width - 30,
      backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  title: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  row: {
      height: 40
  },
  text: {
      textAlign: 'center',
      color: 'white',
  },
  rowText: {
      fontSize: 14,
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold'
  },

  image: {
      tintColor: "#66c7aa",
      width: 35,
      height: 35
  },
  button: {
      alignSelf: 'flex-end',
      position: 'absolute',
      top: 30,
      right: 5,
      borderRadius: 10,
      padding: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
  }
});

export default Home;