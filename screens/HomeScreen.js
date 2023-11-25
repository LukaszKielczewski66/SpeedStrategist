import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { HomeIcon, Cog6ToothIcon, FireIcon } from "react-native-heroicons/solid";
import { auth } from "../config/firebase";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import LoadingScreen from "./LoadingScreen";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
      const getLocationAsync = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
          } else {
            console.log('Brak uprawnień do lokalizacji');
          }
        } catch (error) {
          console.error('Błąd podczas pobierania lokalizacji:', error);
        }
      };
  
      getLocationAsync();
    }, []);

    const navigation = useNavigation()
    return (
        <View className="flex-1">
        {location ? (
          <MapView
            className="flex-1"
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={location} title="Twoja lokalizacja" />
          </MapView>
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
            onPress={()=> navigation.navigate('User')}
            className="border-4-white flex-1 justify-center items-center">
            <HomeIcon size="50" color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=> navigation.navigate('Ride')}
            className="border-4-white flex-1 justify-center items-center">
            <FireIcon size="50" color="white" />
          </TouchableOpacity>
        </View>
      )}
      </View>
    )
}

export default HomeScreen