import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import API_CONFIG from '../config/api-config';
import axios from "axios";

const SaveRouteScreen = () => {
    const route = useRoute();
    const { routeData } = route.params;
    const { controlPoints } = route.params;

    const [tripName, setTripName] = useState('');
    const [distance, setDistance] = useState(null);
    const [time, setTime] = useState(null);
    const [averageSpeed, setAverageSpeed] = useState(null);
    const [speed, setSpeed] = useState(null);

    const [data, setData] = useState(null);

    useEffect(() => {
        console.log('routeData', routeData);
        console.log('controlPoints: ', controlPoints)
        setData(routeData)
        const distance = calculateTotalDistance(routeData.waypoints)

        const time = ((routeData.waypoints.length + 1) * 500 + 1500);
        const averageSpeed = calculateAverageSpeed(distance, time);

        setDistance(distance.toFixed(2));
        setTime(time/1000)
        setAverageSpeed(averageSpeed.toFixed(2))

        console.log('TIME: ', time)
        console.log('DISTANCE: ', distance)
        console.log('SPEED', averageSpeed);
    }, [])

    const calculateTotalDistance = points => {
        let totalDistance = 0;
    
        for (let i = 1; i < points.length; i++) {
            let distanceBetweenPoints = haversine(points[i - 1].latitude, points[i - 1].longitude, points[i].latitude, points[i].longitude);
            totalDistance += distanceBetweenPoints;
        }
    
        return totalDistance;
    }

    const haversine = (lat1, lon1, lat2, lon2) => {
        lat1 = toRadians(lat1);
        lon1 = toRadians(lon1);
        lat2 = toRadians(lat2);
        lon2 = toRadians(lon2);
    
        let dlat = lat2 - lat1;
        let dlon = lon2 - lon1;
    
        let a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const radius = 6371;
        let distance = radius * c;
    
        return distance;
    }
    
    const toRadians = degrees => {
        return degrees * Math.PI / 180;
    }

    const calculateAverageSpeed = (distance, time) => {
        let timeInHours = time / (100 * 60 * 10);
        let averageSpeed = distance / timeInHours;

        return averageSpeed;
    }
    
    const handleSave = async () => {
        if (tripName !== "") {
            const timesTab = [
                { user: routeData.author, time: time }
            ]
            const data = {
                title: tripName,
                author: routeData.author,
                origin: JSON.stringify(routeData.origin),
                waypoints: JSON.stringify(routeData.waypoints),
                destination: JSON.stringify(routeData.destination),
                speed: JSON.stringify(routeData.speed),
                averageSpeed: averageSpeed,
                time: time,
                timesTab: JSON.stringify(timesTab),
                distance: distance
            }
            

            try {
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${API_CONFIG.baseUrl}/addRoute`,
                    data: data
                }

                let driverProfileConfig = {
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: `${API_CONFIG.baseUrl}/updateProperties`,
                    data: {
                        userEmail: routeData.author,
                        propsToUpdate: 'allRoutes'
                    }
                }

                const response = await axios.request(config);
                const res = await axios.request(driverProfileConfig);
                console.log(res.data);
                if (response) {
                    navigation.navigate('User', { email: routeData.author });
                }
            } catch (e) {
                console.log(e)
                createAlert("Błąd podczas zapisu trasy")
            }
        }
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

      const editControlPoints = () => {
        navigation.navigate('ControlPoints', { controlPoints, routeData, tripName })
      }


    const navigation = useNavigation()
    return (
        <View className="flex-1" style={{ backgroundColor: "#0f172a" }}>
            <SafeAreaView className="flex">
                <View className="flex-row justify-start">
                    <TouchableOpacity
                        onPress={()=> navigation.goBack()} 
                        className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                        <ArrowLeftIcon size="20" color="black" />
                    </TouchableOpacity>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-slate-800 text-white text-xl mr-12">Zapisz trasę</Text>
                    </View>
                </View>
            </SafeAreaView>

            <View style={styles.container}>
            <TextInput
                style={[styles.input, { color: 'white'}]}
                placeholder="Nazwa Trasy"
                placeholderTextColor="white"
                value={tripName}
                onChangeText={(text) => setTripName(text)}
            />
            <Text style={styles.label}>Czas: {time} s</Text>
            <Text style={styles.label}>Przebyty dystans: {distance} km</Text>
            <Text style={styles.label}>Średnia prędkość: {averageSpeed} km/h</Text>
                <TouchableOpacity
                    onPress={ editControlPoints } 
                    className="py-3 bg-yellow-400 rounded-xl mx-4 mb-4 m-5 px-5 py-2">
                    <Text className="text-xl font-bold text-center text-gray-700 mx-12">Edytuj punkty kontrolne</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ handleSave } 
                    className="py-3 bg-yellow-400 rounded-xl mx-4 mb-4 m-5 px-5 py-2">
                    <Text className="text-xl font-bold text-center text-gray-700 mx-12">Zapisz</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      color: 'white'
    },
    input: {
      margin: 40,
      color: 'white',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      width: '100%',
    },
    label: {
      margin: 40,
      color: 'white',
      fontSize: 16,
      marginVertical: 5,
    },
  });

export default SaveRouteScreen