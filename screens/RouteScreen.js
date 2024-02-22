import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import API_CONFIG from '../config/api-config';
import axios from "axios";


const RouteScreen = () => {
    const route = useRoute();
    const { item, email, icon } = route.params;
    const GOOGLE_MAPS_APIKEY = '';
    const [location, setLocation] = useState({
        latitude: 52.1900717, longitude: 21.5305133
    });
      const [tabTimes, setTabTimes] = useState([]);

      useEffect(() => {
        console.log('icon: ', icon)
        console.log('start: ',tabTimes[0]);
        const getLocationAsync = async () => {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const subscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 500 },
                (newLocation) => {
                    console.log(newLocation)
                  setLocation(newLocation.coords);
                //   setShowSpeed(newLocation.coords.speed * 10000)
                }
              )
            } else {
              console.log('Brak uprawnień do lokalizacji');
            }
          } catch (error) {
            console.error('Błąd podczas pobierania lokalizacji:', error);
          }
        };

        getLocationAsync();
      }, []);

      const [times, setTimes] = useState([]);
      const [controls, setControls] = useState([]);
      const [actualTimes, setActualTimes] = useState([]);
      const [desiredTimes, setDesiredTimes] = useState([]);

      useEffect(() => {
        const getControlPoints = async() => {
          let data = {
            email: email,
            routeName: item.title
          }

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_CONFIG.baseUrl}/getControlPoints`,
            data: data
          }
          console.log('config', config)

          try {
            const res = await axios.request(config);
            if (res) {
              const resTimes = JSON.parse(res.data.times);
              // console.log('res times', res.data.times)
              console.log('PARSE TIMES: ', resTimes)
              console.log('ACTUAL TIMES: ', resTimes.actualTimes)
              console.log('DESIRED TIMES: ', resTimes.desiredTimes)
              console.log('CONTROLS: ', JSON.parse(res.data.controls));
              setTimes(resTimes)
              setControls(JSON.parse(res.data.controls))
              setActualTimes(resTimes.actualTimes)
              setDesiredTimes(resTimes.desiredTimes)
            }
          } catch (e) {
            console.log(e)
          }
        }

        getControlPoints()
      }, [])

      const showControlPoints = () => {
        setControlsModalVisible(true);
        console.log('hi');
      }

      const [lastTime, setLastTime] = useState(null)

      const getUserTabTimes = async () => {
        try {
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_CONFIG.baseUrl}/getRouteTimes`,
            headers: { 
                'Content-Type': 'application/json'
            },
            data: {
                title: item.title,
            }
        }
          const response = await axios.request(config);
          if (response) {
            setTabTimes(response.data)
          }
        } catch(e) {
          console.log(e)
        }
      }
      

      useEffect(() => {
        getUserTabTimes();
        const tab = getUserTabTimes()
      }, [])
      

      const [intervalId, setIntervalId] = useState(null);
      const [speed, setSpeed] = useState(0);
      const [time, setTime] = useState(0);
      const [endRoute, setEndRoute] = useState(false)


      const handleStartPress = () => {
        if (intervalId === null) {
            const newIntervalId = setInterval(async () => {
                let currentLocation = await Location.getCurrentPositionAsync({});
                setTime((prevTime) => {
                    const newTime = prevTime + 1;
                    setTime(newTime)
                    return newTime
                })
                console.log('current location: ', currentLocation);
                setSpeed(currentLocation.coords.speed.toFixed(2));
              }, 1000);

              setIntervalId(newIntervalId);
        }
      }
      const [saveTime, setSaveTime] = useState(null)

      const handleStopPress = () => {
        console.log('stop');
        setEndRoute(true);
        setSaveTime(time);
        clearInterval(intervalId);
        setIntervalId(null)
        setSpeed(0);
        setTime(0)
      }
      

      const saveUserTime = async() => {
        let timesTab = JSON.parse(item.timesTab);
        timesTab.push({ user: email, time: saveTime });
        console.log(timesTab)
        try {
            let config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: `${API_CONFIG.baseUrl}/updateTimesTab`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data: {
                    title: item.title,
                    timesTab: JSON.stringify(timesTab)
                }
            }

            const response = await axios.request(config);
            if (response) {
                console.log(response.data.route)
                createAlert("Pomyślnie zapisano czas")
                getUserTabTimes();
                if (tabTimes) {
                  console.log('update driver profile')
                  let driverProfileConfig = {
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: `${API_CONFIG.baseUrl}/updateProperties`,
                    data: {
                        userEmail: email,
                        propsToUpdate: 'allRoutes'
                    }
                  }

                  await axios.request(driverProfileConfig);

                  let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${API_CONFIG.baseUrl}/getRouteTimes`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data: {
                        title: item.title,
                    }
                }
                  const response = await axios.request(config);
                  console.log('TAB TIMES !!!!: ', response.data)
                  
                  if (response.data[0].user === email) {
                    driverProfileConfig.data.propsToUpdate = 'firstPlaces';
                    const res = await axios.request(driverProfileConfig);
                    console.log('add first place', driverProfileConfig);
                  } else if (response.data[1].user === email) {
                    driverProfileConfig.data.propsToUpdate = 'secondPlaces';
                    const res = await axios.request(driverProfileConfig);
                    console.log('add second place');
                    console.log(res);
                  } else if (response.data[2].user === email) {
                    driverProfileConfig.data.propsToUpdate = 'thirdPlaces';
                    const res = await axios.request(driverProfileConfig);
                    console.log('add first place');
                    console.log(res);
                  }

                  let lastPlace;

                  response.data.forEach((el, index) => {
                    if (el.user === email) {
                      lastPlace = index;
                    }
                  })

                  const updateLastRide = {
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: `${API_CONFIG.baseUrl}/updateLastRide`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data: {
                        userEmail: email,
                        lastRide: item.title,
                        lastPlace: lastPlace
                    }
                  }

                  console.log('update last ride: ', updateLastRide);

                  await axios.request(updateLastRide);

                }
            }
        } catch(e) {
            console.log(e);
            createAlert("Błąd przy zapisie")
        }
      }

      const [modalVisible, setModalVisible] = useState(false);
      const [controlsModalVisible, setControlsModalVisible] = useState(false);

      const showRank = () => {
        if (typeof tabTimes === 'string') {
          setTabTimes(JSON.parse(tabTimes))
        }
        console.log(tabTimes)
        setModalVisible(true);
      }

      const closeModal = () => {
        setModalVisible(false);
      }

      const closeControlModal = () => {
        setControlsModalVisible(false);
      }
      
    const createAlert = alertContent => {
        console.log(alertContent);
        Alert.alert(alertContent, "", [
          {
            text: 'Ok',
            onPress: () => {console.log('Ok pressed'); },
          }
        ])
      }

    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View className="flex-row justify-start mt-14">
                    <TouchableOpacity
                        onPress={()=> navigation.goBack()} 
                        className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                        <ArrowLeftIcon size="20" color="black" />
                    </TouchableOpacity>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-slate-800 text-white text-xl mr-12">Trasa: {item.title}</Text>
                    </View>
                </View>
                <View>
                    <Text className="font-bold text-center text-white mx-8">Autor: {item.author}</Text>
                    <Text className="font-bold text-center text-white mx-8">Dystans: {item.distance} km</Text>
                    <View className="flex-row">
                    <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl my-3">
                        <Text 
                        onPress={ showRank }
                        className="font-bold text-center text-gray-700 mx-8">Ranking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="mx-3 py-3 bg-yellow-400 rounded-xl my-3">
                        <Text 
                        onPress={ showControlPoints }
                        className="font-bold text-center text-gray-700 mx-8">Punkty kontrolne</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-row mt-5">
                    <Text className="text-center text-white mx-8">Prędkość: { (speed * 10000).toFixed(2) }</Text>
                    <Text className="text-center text-white mx-8">Czas: {time}s</Text>
                </View>
                { endRoute ? (
                    <View className="flex-row mt-5">
                    <Text className="text-center text-white mx-8">Twój czas: {saveTime}s</Text>
                </View>
                ) : (
                    <View></View>
                )}
            </View>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker coordinate={location} title="Twoja lokalizacja">
                {
                  icon ? (
                  <Image 
                    source={{ uri: icon }}
                    style={{ width: 32, height: 32 }}
                  />
                  ) : (<View></View>)
                }
                </Marker>
                {
                  controls.map((marker, index) => (
                    <Marker
                       key={ index }
                       coordinate={
                        {
                          longitude: marker.longitude,
                          latitude: marker.latitude
                        }
                       }
                       title="punkt kontrolny"
                       description={ `Punkt kontrolny nr. ${index}` }
                    ></Marker>
                  ))
                }
                <MapViewDirections
                  origin={JSON.parse(item.origin)}
                  destination={JSON.parse(item.destination)}
                  apikey={GOOGLE_MAPS_APIKEY}
                  waypoints={JSON.parse(item.waypoints)}
                  strokeWidth={5}
                  strokeColor="hotpink"
                />
            </MapView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    className="py-3 bg-yellow-400 rounded-xl"
                    onPress={ handleStartPress }
                >
                    <Text className="font-bold text-center text-gray-700 mx-8">Start</Text>
                </TouchableOpacity>
                { endRoute ? (
                    <TouchableOpacity
                    className="py-3 bg-yellow-400 rounded-xl"
                    onPress={ saveUserTime }
                >
                    <Text className="font-bold text-center text-gray-700 mx-8">Zapisz</Text>
                </TouchableOpacity>
                ) : (
                    <View></View>
                )
                }
                <TouchableOpacity 
                    className="py-3 bg-yellow-400 rounded-xl"
                    onPress={ handleStopPress }
                >
                    <Text className="font-bold text-center text-gray-700 mx-8">Stop</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.modalOverlay}></View>
                </TouchableWithoutFeedback>

                <View style={styles.modalContent}>
                <Text className="text-lg">Ranking</Text>
                {
                  tabTimes ?
                   (<View>
                    { tabTimes.map((el, index) => 
                      (
                        <Text 
                           key={index}
                           className="text-base my-2"
                           >{index + 1}. Użytkownik: {el.user}, Czas: {el.time}s</Text>
                      )
                    )}
                   </View>) 
                   : 
                   (
                    <View>
                      <Text>Brak zapisanych czasów</Text>
                    </View>
                    )
                }
            
            <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl my-3">
                        <Text 
                        onPress={ closeModal }
                        className="font-bold text-center text-gray-700 mx-8">Zamknij</Text>
                    </TouchableOpacity>
            </View>
        </Modal>

        <Modal
                animationType="slide"
                transparent={true}
                visible={controlsModalVisible}
                onRequestClose={closeControlModal}
            >
                <TouchableWithoutFeedback onPress={closeControlModal}>
                <View style={styles.modalOverlay}></View>
                </TouchableWithoutFeedback>

                <View style={styles.modalContent}>
                <Text className="text-lg">Punkty kontrolne: </Text>

                <View className="flex-row w-100 mb-10">
                        <Text className="mx-1 text-slate-800 text-xl">Punkty kontrolne</Text>
                        <Text className="mx-1 text-slate-800 text-xl">Twój czas </Text>
                        <Text className="mx-1 text-slate-700 text-xl">Pożądany czas</Text>
                    </View>
                {
                  actualTimes ?
                   (<View>
                    { actualTimes.map((el, index) => 
                      (
                        <View className="flex-row w-100 mx-4" key={ index }>
                          <Text className="mx-7 p-3">Punkty: { index === 0 ? 'Start' : index } - { index === actualTimes.length -1 ? 'meta' : index  + 1 } </Text>
                          <Text className="mx-7 p-3">  { el } </Text>
                          <TextInput
                           key={ index }
                           placeholder="pożądany czas"
                           value={ desiredTimes[index] }
                           className="p-3 bg-gray-100 text-gray-700 rounded mb-3"
                          ></TextInput>
                        </View>
                      )
                    )}
                   </View>) 
                   : 
                   (
                    <View>
                      <Text>Brak zapisanych czasów</Text>
                    </View>
                    )
                }
  
            
            <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl my-3">
                        <Text 
                        onPress={ closeControlModal }
                        className="font-bold text-center text-gray-700 mx-8">Zamknij</Text>
                    </TouchableOpacity>
            </View>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: Dimensions.get('window').height / 3,
      backgroundColor: '#0f172a',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    map: {
      flex: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#0f172a',
      },
      button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      openButton: {
        fontSize: 20,
        color: 'blue',
        fontWeight: 'bold',
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        position: 'absolute',
        backgroundColor: '#0f172a',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: Dimensions.get('window').height / 2,
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      closeButton: {
        color: 'blue',
        marginTop: 10,
      },
  });

export default RouteScreen