import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { HomeIcon, Cog6ToothIcon, FireIcon } from "react-native-heroicons/solid";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import LoadingScreen from "./LoadingScreen";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import API_CONFIG from '../config/api-config';
import axios from "axios";



const HomeScreen = () => {
  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [waypoints, setWaypoints] = useState([]);
  const [speed, setSpeed] = useState([]);
  const GOOGLE_MAPS_APIKEY = '';
  const route = useRoute();

  const routeStart = route.params?.startNewRoute;
  const [userRouteMarkers, setUserRouteMarkers] = useState([]);
  const [showSpeed, setShowSpeed] = useState(0)
  const [stopTrackRoute, setStopTrackRoute] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [location, setLocation] = useState(null);
  const [apiToken, setApiToken] = useState(null);
  const [direction, setDirection] = useState(null);
  const [region, setRegion] = useState({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  const [user, setUser] = useState(null);

    getUserInfo = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('apiToken');
          if (storedToken) {
              setApiToken(storedToken);

              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${API_CONFIG.baseUrl}/user`,
                headers: { 
                  'Authorization': `Bearer ${storedToken}`
                }
              }

              const response = await axios.request(config);
              if (response.data) {
                setUser(response.data);
                console.log(response.data.icon);
                console.log('user: ', user)
              }
          }
      } catch (e) {
        console.log(e);
      }
    }

    const handleStartPress = () => {
      
      if (intervalId === null) {
        const newIntervalId = setInterval(async () => {
          let currentLocation = await Location.getCurrentPositionAsync({});

          setWaypoints(prevWaypoints => [
            ...prevWaypoints,
            {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude
            }
          ]);
          setDestination(
            {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude
            }
          )
          setSpeed(prevUserSpeed => [
            ...prevUserSpeed,
            {
              speed: currentLocation.coords.speed
            }
          ])
        }, 1000);

        setIntervalId(newIntervalId);
    }
  }
  useEffect(() => {
    console.log(waypoints)
    if (waypoints.length > 1) {
      setOrigin(waypoints[0])
    }
  }, [waypoints]);

    const handleEndPress = () => {
      clearInterval(intervalId);
      setIntervalId(null);
      setStopTrackRoute(true)
    }

    useEffect(() => {
      if (stopTrackRoute) {
        setDirection(true);
      }
    }, [stopTrackRoute])

    useEffect(() => {
      const getLocationAsync = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            // const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
            const subscription = await Location.watchPositionAsync(
              { accuracy: Location.Accuracy.High, timeInterval: 1000 },
              (newLocation) => {
                setLocation(newLocation.coords);
                setShowSpeed(newLocation.coords.speed * 10000)
              }
            )

            // console.log('latitude: ', location.coords.latitude);
            // console.log('longtitude: ', location.coords.longitude);
          } else {
            console.log('Brak uprawnień do lokalizacji');
          }
        } catch (error) {
          console.error('Błąd podczas pobierania lokalizacji:', error);
        }
      };
      getLocationAsync();

      // return () => {
      //   if (subscription) {
      //     subscription.remove();
      //   }
      // };
    }, []);

    useFocusEffect(
      React.useCallback(() => {
        getUserInfo();
      }, [])
    );

    const saveRoute = () => {
      setDirection(false)
      const routeData = {
        author: user.email,
        origin: origin,
        waypoints: waypoints,
        destination: destination,
        speed: speed
      }

      navigation.navigate('SaveRoute', { routeData });
    }
 
    const navigation = useNavigation()
    return (
        <View className="flex-1">
        {location ? (
          <View style={styles.container}>
            <MapView
              className="flex-1"
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker coordinate={location} title="Twoja lokalizacja">
                {
                  user ? (
                  <Image 
                    source={{ uri: user.icon }}
                    style={{ width: 32, height: 32 }}
                  />
                  ) : (<View></View>)
                }
              </Marker>

              {direction && (
                <MapViewDirections
                  origin={origin}
                  destination={destination}
                  apikey={GOOGLE_MAPS_APIKEY}
                  waypoints={waypoints}
                  strokeWidth={3}
                  strokeColor="hotpink"
                />
              )}
            </MapView>
            <View style={styles.speedContainer}>
                <Text style={styles.speedText}>{`${showSpeed.toFixed(2)} km/h`}</Text>
              </View>
              { direction ? (
                <View style={styles.saveContainer}>
                  <TouchableOpacity onPress={ saveRoute } style={styles.button}>
                    <Text style={styles.buttonText}>Zapisz trasę</Text>
                  </TouchableOpacity>
                </View>
              ) : (<View></View>) }
            { routeStart ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={ handleStartPress } style={styles.button}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
                

              <TouchableOpacity onPress={ handleEndPress } style={styles.button}>
                <Text style={styles.buttonText}>Koniec</Text>
              </TouchableOpacity>
                
          </View>
         ) : (<View></View>) }
          </View>
        ) 
        : (
          <LoadingScreen message="Trwa pobieranie lokalizacji..."/>
        )}
        {location && (
          
        <View className="border-t-4 border-indigo-500 d-flex flex-row" style={{ height: 100, backgroundColor: '#0f172a' }}>

        <TouchableOpacity 
            onPress={()=> navigation.navigate('Settings')}
            className="border-4-white flex-1 justify-center items-center">
            <Cog6ToothIcon size="50" color="white" />
          </TouchableOpacity>

        <TouchableOpacity
            onPress={()=> navigation.navigate('User', { email: user.email })}
            className="border-4-white flex-1 justify-center items-center">
            <HomeIcon size="50" color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=> navigation.navigate('Ride', { email: user.email })}
            className="border-4-white flex-1 justify-center items-center">
            <FireIcon size="50" color="white" />
          </TouchableOpacity>
        </View>
      )}
      </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  saveContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: 'rgba(0, 122, 255, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  speedContainer: {
    position: 'absolute',
    top: 130,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  speedText: {
    backgroundColor: 'rgba(0, 122, 255, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: 'white'
  },
  buttonText: {
    color: 'white',
  },
})