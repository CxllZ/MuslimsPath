import React , { useState }from 'react';
import { StyleSheet, SafeAreaView, Text, Dimensions, FlatList  } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';

const juzzJson = require('./QPages/juz.json')
const surahJson = require('./QPages/surah.json')

const Quran = ({navigation}) => {
  const [juzz, setJuzz] = useState();
  const [surah, setSurah] = useState();
  
    return (
      <>
        <SafeAreaView style={[styles.container, {flex: 0.3}]}>
          <Text style={[styles.text, {flex: 0.25}]}>Juzz</Text>

          <Text style={{width: 20}}></Text>

          <Text style={[styles.text, {flex: 0.25}]}>Surah</Text>

          <Text style={{width: 20}}></Text>

          <Text style={styles.text}>Ayaah</Text>
        </SafeAreaView>

        <SafeAreaView style={styles.container}>
          <WheelPickerExpo
              haptics={true}
              selectedStyle={{borderColor: '#000', borderWidth: 1}}
              backgroundColor='#5bb398'
              height={Dimensions.get('window').height / 2}
              width={Dimensions.get('window').width / 5}
              initialSelectedIndex={0}
              items={juzzJson.map(key => ({ label: parseInt(key.index, 10), value: '' }))}
              onChange={({ item }) => setJuzz(item.label)}
              renderItem={(props) => (
                  <Text
                    style={[
                      styles.text,
                      { color: props.fontColor, textAlign: props.textAlign },
                    ]}>
                    {props.label}
                  </Text>
                )}
          />

          <Text style={{width: 20}}></Text>

          {juzz == undefined ? 
          (console.log("Juzz not selected"),
          <Text>No Juzz selected</Text>
          // <WheelPickerExpo
          //     haptics={true}
          //     selectedStyle={{borderColor: '#000', borderWidth: 1}}
          //     backgroundColor='#000000'
          //     height={Dimensions.get('window').height / 2}
          //     width={Dimensions.get('window').width / 5}
          //     initialSelectedIndex={0}
          //     // initialSelectedIndex={juzz == '' ? 2 : parseInt(juzzJson[juzz].start.index, 10)}
          //     items={surahJson.map(key => ({ label: key.title, value: '' }))}
          //     // items={juzz.map(key => ({ label: parseInt(key.start.index, 10), value: '' }))}
          //     onChange={({ item }) => setSurah(item.label)}
          //     renderItem={(props) => (
          //         <Text
          //           style={[
          //             styles.text,
          //             { color: props.fontColor, textAlign: props.textAlign },
          //           ]}>
          //           {props.label}
          //         </Text>
          //       )}
          //   /> 
          ) :
            (console.log("juzz", juzz, "surah number", parseInt(juzzJson[juzz-1].start.index, 10)),
            
            <WheelPickerExpo
              haptics={true}
              extras={juzz}
              selectedStyle={{borderColor: '#000', borderWidth: 1}}
              backgroundColor='#5bb398'
              height={Dimensions.get('window').height / 2}
              width={Dimensions.get('window').width / 5}
              initialSelectedIndex={parseInt(juzzJson[juzz-1].start.index, 10)-1}
              items={surahJson.map(key => ({ label: key.title, value: '' }))}
              onChange={({ item }) => setSurah(item.label)}
              renderItem={(props) => (
                  <Text
                    style={[
                      styles.text,
                      { color: props.fontColor, textAlign: props.textAlign },
                    ]}>
                    {props.label}
                  </Text>
                )}
            />
            )
            }

          

          <Text style={{width: 20}}></Text>

          <WheelPickerExpo
              haptics={true}
              selectedStyle={{borderColor: '#000', borderWidth: 1}}
              backgroundColor='#5bb398'
              height={Dimensions.get('window').height / 2}
              width={Dimensions.get('window').width / 5}
              initialSelectedIndex={0}
              items={juzzJson.map(key => ({ label: parseInt(key.start.index, 10), value: '' }))}
              // items={juzz.map(key => ({ label: parseInt(key.start.index, 10), value: '' }))}
              onChange={({ item }) => setSurah(item.label)}
              renderItem={(props) => (
                  <Text
                    style={[
                      styles.text,
                      { color: props.fontColor, textAlign: props.textAlign },
                    ]}>
                    {props.label}
                  </Text>
                )}
            />
        </SafeAreaView>

        <SafeAreaView style={styles.container2}>
          <Text style={styles.text}>Selected Value:</Text>
          <Text style={styles.text}>{juzz}</Text>
          <Text style={styles.text}>{surah}</Text>
        </SafeAreaView>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#002331",
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    backgroundColor: "#002331",
    flex: 0.5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white'
  },
});

export default Quran;