import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import API_CONFIG from '../config/api-config';
import axios from "axios";
import { Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const DriverProfileScreen = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const { settings } = route.params;

    const [routes, setUserRoutes] = useState(null);
    const [driverProfile, setDriverProfile] = useState({});

    useEffect(() => {
        const getRoutes = async() => {
            const email = settings.email;
            try {
                let data = JSON.stringify({
                    email
                  });
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${API_CONFIG.baseUrl}/userRoutes`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data: data
                }
    
                const response = await axios.request(config)
                if (response.data) {
                    setUserRoutes(response.data.routes.length);
                }
            } catch(e) {
                console.log(e);
            }
        }

        const getDriverProfile = async() => {
            const userEmail = settings.email;
            try {
                let data = JSON.stringify({
                    userEmail
                  });
                  let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${API_CONFIG.baseUrl}/driverProfile`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data: data
                }

                const response = await axios.request(config)
                if (response.data) {
                    console.log('DRIVER PROFILE: ', response.data);
                    setDriverProfile(response.data.driverProfile)
                }

            } catch (e) {
                console.log(e)
            }

        }

        getDriverProfile();
        getRoutes();
    }, [])

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
                        <Text className="text-slate-800 text-white text-xl mr-12">Profil kierowcy</Text>
                    </View>
                </View>
            </SafeAreaView>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.label}>Liczba własnych tras:</Text>
                    <Text style={styles.value}>{ routes }</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Liczba wszystkich przebytych tras:</Text>
                    <Text style={styles.value}>{ driverProfile.allRoutes } </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Wyścigi ukończone na 1 miejscu:</Text>
                    <Text style={styles.value}>{ driverProfile.firstPlaces }</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Wyścigi ukończone na 2 miejscu:</Text>
                    <Text style={styles.value}>{ driverProfile.secondPlaces }</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Wyścigi ukończone na 3 miejscu:</Text>
                    <Text style={styles.value}>{ driverProfile.thirdPlaces }</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Ostatni wyścig:</Text>
                    <Text style={styles.value}>{ driverProfile.lastRide }</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Zajęte miejsce:</Text>
                    <Text style={styles.value}>{ driverProfile.lastPlace }</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      section: {
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 3,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333333',
        textAlign: 'center',
      },
      value: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'center',
      },
  });

export default DriverProfileScreen;