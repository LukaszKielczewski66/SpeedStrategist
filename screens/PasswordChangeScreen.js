import { Text, TextInput, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import API_CONFIG from '../config/api-config';

import axios from "axios";

const PasswordChangeScreen = () => {
    const route = useRoute();
    const navigation = useNavigation()

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");

    const { apiToken } = route.params;

    const changePassword = async () => {
        console.log(newPassword)
        if (oldPassword === "" || newPassword === "" || repeatNewPassword === "") {
            createAlert('Puste pola')
        }
        else if (newPassword !== repeatNewPassword) {
            createAlert('Nowe hasło nie jest takie samo');
        } else if (newPassword === oldPassword) {
            createAlert('Nowe hasło nie może być takie samo jak stare hasło!')
        } else {
            try {
                const data = {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${API_CONFIG.baseUrl}/changePassword`,
                    headers: { 
                        'Authorization': `Bearer ${apiToken}`
                    },
                    data : data
                  }
    
                  const response = await axios.request(config);

                  if (response) {
                    createAlert("Hasło zmienione pomyślnie")
                  }
            } catch (e) {
                console.log('res status: ', e.response.status)
                switch(e.response.status) {
                    case 405:
                        createAlert('Niepoprawne hasło');
                        break;
                    default:
                        createAlert('Błąd poczas zmiany hasła')
                }
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
                    <Text className="text-slate-800 text-white text-xl mr-12">Zmień hasło</Text>
                </View>
            </View>

            <View className="flex mx-7 mt-10">
                <Text className="text-white mx-3 mt-3">Stare hasło</Text>
                    <TextInput 
                    className="p-4 text-white rounded-xl mb-3"
                    secureTextEntry
                    value={ oldPassword }
                    onChangeText={ value => setOldPassword(value) }
                    style={ styles.textInput }
                />

                <Text className="text-white mx-3 mt-3">Nowe hasło</Text>
                    <TextInput 
                    className="p-4 text-white rounded-xl mb-3"
                    secureTextEntry
                    value={ newPassword }
                    onChangeText={ value => setNewPassword(value) }
                    style={ styles.textInput }
                />

                <Text className="text-white mx-3 mt-3">Powtórz nowe hasło</Text>
                    <TextInput 
                    className="p-4 text-white rounded-xl mb-3"
                    secureTextEntry
                    value={ repeatNewPassword }
                    onChangeText={ value => setRepeatNewPassword(value) }
                    style={ styles.textInput }
                />
            </View>

            <View className="mt-5 mx-9">
                    <TouchableOpacity
                     className="py-3 bg-yellow-400 rounded-xl"
                     onPress={ () => changePassword() }
                    >
                        <Text className="text-xl font-bold text-center text-gray-700">Zapisz</Text>
                    </TouchableOpacity>
                </View>

        </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        alignSelf: 'stretch',
        borderBottomColor:'white',
    
        borderBottomColor: 'white',
        borderBottomWidth: 2     
    }
})


export default PasswordChangeScreen
