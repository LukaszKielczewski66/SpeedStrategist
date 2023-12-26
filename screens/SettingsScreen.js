import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";

const SettingsScreen = () => {

    const handleLogout = async () => {
        // wyloguj
    }

    const [settings, setSettings] = useState([]);
    useEffect(() => {
        const fetchSettings = async () => {
            try {
            //    Pobierz dane z mongodb
            } catch (error) {
                console.error('Error fetching settings', error);
            }
        };

        fetchSettings();
    }, [user]);

    const saveSettings = async() => {
        if (settings.name !== "") {
            try {
                // Update danych
            } catch (err) {
                console.error('Error podczas zapisu do bazy', err);
            }
        }
    }

    const onFieldChange = (key, text) => {
        setSettings({...settings, [key]: text})
        return text;
    }

    const navigation = useNavigation()
    return (
        <View className="flex-1">

        { user ? (
            <View className="flex-1" style={{ backgroundColor: "#0f172a" }}>
        <SafeAreaView className="flex">
            <View className="flex-row justify-start mb-12">
                <TouchableOpacity
                    onPress={()=> navigation.goBack()} 
                    className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                    <ArrowLeftIcon size="20" color="black" />
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-slate-800 text-white text-xl mr-12">Ustawienia</Text>
                </View>
            </View>
            <View className="flex mx-7">
                <Text className="text-white mx-3 mt-3">Imię</Text>
                <TextInput 
                className="p-4 text-white rounded-xl mb-3"
                style={ styles.textInput }
                value= { settings.name }
                onChangeText={ value => onFieldChange('name', value) }
                />

                <Text className="text-white mx-3 mt-3">Nazwisko</Text>
                <TextInput 
                className="p-4 text-white rounded-xl mb-3"
                style={ styles.textInput }
                value={ settings.surname }
                onChangeText= { value => onFieldChange('surname', value) }
                />
                <Text className="text-white mt-3 text-center text-lg">Mój samochód</Text>
                <View className="flex-row mt-3">
                    <View className="flex-1">
                        <Text className="text-white text-center mx-3 mt-3">Marka</Text>
                        <TextInput 
                        className="p-4 text-white rounded-xl mb-3"
                        style={ styles.textInput }
                        value={ settings.car }
                        onChangeText={ value => onFieldChange('car', value) }
                    />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-center mx-3 mt-3">Model</Text>
                        <TextInput 
                        className="p-4 text-white rounded-xl mb-3"
                        style={ styles.textInput }
                        value= { settings.model }
                        onChangeText= { value => onFieldChange('model', value) }
                        />
                    </View>
                </View>
                <TouchableOpacity
                     className="py-3 bg-yellow-400 rounded-xl mt-8"
                     onPress={ saveSettings }
                    >
                        <Text className="text-xl font-bold text-center text-gray-700">Zapisz ustawienia</Text>
                    </TouchableOpacity>
            </View>
            <View className="flex mx-7">
                <View className="mt-9">
                    <TouchableOpacity
                     className="py-3 bg-yellow-400 rounded-xl"
                    >
                        <Text className="text-xl font-bold text-center text-gray-700">Zmiana hasła</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-3">
                    <TouchableOpacity
                     className="py-3 bg-yellow-400 rounded-xl"
                    >
                        <Text className="text-xl font-bold text-center text-gray-700">Zmiana ikonki pojazdu</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-3">
                    <TouchableOpacity
                     className="py-3 bg-yellow-400 rounded-xl"
                     onPress={ () => snavigation.navigate('Authors')}
                    >
                        <Text className="text-xl font-bold text-center text-gray-700">Autorzy</Text>
                    </TouchableOpacity>
                </View>
                

                <TouchableOpacity onPress = { handleLogout } className="p-1 bg-red-400 rounded-lg mt-8">
                    <Text className="text-white text-lg font-bold text-center">Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </View>
        ) : (
            <LoadingScreen message="Trwa ładowanie ustawień..."/>
        ) }

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

export default SettingsScreen;