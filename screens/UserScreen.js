import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import API_CONFIG from '../config/api-config';
import axios from "axios";

const UserScreen = () => {
    const route = useRoute();
    const { email } = route.params;

    const [userRoutes, setUserRoutes] = useState(null);

    useEffect(() => {
        const getRoutes = async() => {
            console.log('email: ', email)
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
                    setUserRoutes(response.data.routes);
                }
            } catch(e) {
                console.log(e);
                createAlert("Błąd podczas pobierania tras")
            }
        }

        getRoutes();
    }, [])

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
        <View className="flex-1" style={{ backgroundColor: "#0f172a" }}>
        <SafeAreaView className="flex">
            <View className="flex-row justify-start">
                <TouchableOpacity
                    onPress={()=> navigation.goBack()} 
                    className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                    <ArrowLeftIcon size="20" color="black" />
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-slate-800 text-white text-xl mr-12">Moje trasy</Text>
                </View>
            </View>
        </SafeAreaView>
        <View>
            <ScrollView contentContainerStyle={styles.scrollContainer} className="flex px-5">
             
                { userRoutes ? (
                    <View>

                    {userRoutes && userRoutes.map((item, index) => (
                        <View 
                            className="flex-row mt-7"
                            key={index}
                        >
                            <View className="flex justify-center mr-3">
                                <Text className="text-white text-xl font-bold">{index + 1}.</Text>
                            </View>
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-white">Tytuł: {item.title}</Text>
                                <Text className="text-white">Twój czas: {item.time}</Text>
                                <Text className="text-white">Dystans: {item.distance}</Text>
                            </View>
                            <View className="flex items-center justify-center">
                                <TouchableOpacity
                                className="py-3 bg-yellow-400 rounded-xl"
                                onPress={ () => navigation.navigate('RouteScreen', { item, email }) }>
                                    <Text className="font-bold text-center text-gray-700 mx-8">Podgląd</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    </View>

                ) : (<Text className="text-white text-xl font-bold">Brak zapisanych tras</Text>)}


            </ScrollView>
            <View className="flex items-center justify-center">
                <TouchableOpacity
                 onPress = { () => navigation.navigate('Home', { startNewRoute: true }) }
                 className="py-3 bg-yellow-400 rounded-xl my-12">
                        <Text className="font-bold text-center text-gray-700 mx-8">Stwórz nową trasę</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
      },
})

export default UserScreen;