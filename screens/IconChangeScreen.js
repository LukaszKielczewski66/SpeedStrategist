import { Image, Text, TextInput, TouchableOpacity, View, Alert, StyleSheet, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import API_CONFIG from '../config/api-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from "./LoadingScreen";

import axios from "axios";


const IconChangeScreen = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const { apiToken } = route.params;
    

    const [userIconName, setUserIconName] = useState(null);
    const [icons, setIcons] = useState(null);

    const createConfig = (methodType, url, auth, data) => {
        const config = {
            method: methodType,
            maxBodyLength: Infinity,
            url: `${API_CONFIG.baseUrl}/${url}`,
        }
        if (auth) {
            config.headers = {
              'Authorization': `Bearer ${apiToken}`
            };
          }
          if (data) {
            config.data = { iconLink: data }
          }

        return config;
    }

    const getUserIcon = async () => {
        try {
            const config = createConfig('get', 'getIcon', true, false)
            const response = await axios.request(config);

            if (response.data) {
                setUserIconName(response.data);
            }
        } catch(e) {
            console.log(e);
            createAlert("Wystąpił błąd podczas pobierania ikony");
        }
    }
    
    const saveIcon = async () => {
        try {
            const config = createConfig('post', 'changeIcon', true, userIconName)
            const response = await axios.request(config);
            if (response) {
                console.log(response);
            }
        } catch(e) {
            console.log(e);
            createAlert('Bład podczas zmiany ikony')
        }
    }

    useEffect(() => {
        const getUserIcon = async () => {
            try {
                const config = createConfig('get', 'getIcon', true, false)
                const response = await axios.request(config);
    
                if (response.data) {
                    console.log('RESPONSE USER ICON: ', response.data.icon);
                    setUserIconName(response.data.icon);
                }
                // console.log(response)
            } catch(e) {
                console.log(e);
                createAlert("Wystąpił błąd podczas pobierania ikony");
            }
        }

        const getIcons = async () => {
            try {
                const config = createConfig('get', 'getIcons', false, false);
    
                const response = await axios.request(config);
                if (response) {
                    console.log(response.data.icons)
                    setIcons(response.data.icons);
                }
            } catch (e) {
                console.log(e);
                createAlert('Błąd podczas pobierania ikon');
            }
        }
        
        getIcons();
        getUserIcon();
      }, []);

    const onIconPick = iconName => {
        setUserIconName(iconName);
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
                    <Text className="text-slate-800 text-white text-xl mr-12">Zmień ikonę</Text>
                </View>
            </View>
            </SafeAreaView>
                <View className="flex items-center justify-center">
                <Text className="text-white my-4">Twoja ikona</Text>
                {userIconName === "" ? (
                <Text className="text-white my-4 mb-5">Nie wybrano ikony</Text>
                ) : (
                    <Image
                    source={{ uri: userIconName }}
                    style={{ width: 100, height: 150 }}
                />
                )}
            </View>
            <View style={{borderTopLeftRadius: 50, borderTopRightRadius: 50 }} 
                className="flex-1 items-center bg-white px-8 pt-8">
                <View>
                    <Text className="font-bold text-xl">Inne dostępne ikony:</Text>
                </View>

                <View className="flex items-center justify-center">
                <ScrollView contentContainerStyle={styles.scrollContainer} className="px-12">

                { icons ? (
                    <View>
                    {icons && icons.map((item, index) => (
                        <TouchableOpacity key={index} onPress={ () => onIconPick(item.iconLink) }>
                            <Image
                             source={{ uri: item.iconLink }}
                             style={ styles.iconPick }
                             className="my-5"
                            ></Image>
                        </TouchableOpacity>
                    ))}
                    </View>
                ) : (
                <Text>Trwa pobieranie ikon...</Text>
                )}

                </ScrollView>
                </View>
                
            </View>
            <View className="bg-white">
                <TouchableOpacity
                    className="py-3 bg-yellow-400 rounded-xl mx-4 mb-4"
                    onPress={ () => saveIcon() }>
                    <Text className="text-xl font-bold text-center text-gray-700 mx-12">Zapisz</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      iconPick: {
        height: 200,
        width: 200,
      },
      iconPicked: {
        borderWidth: 1,
        color: 'gold'
      }
})

export default IconChangeScreen