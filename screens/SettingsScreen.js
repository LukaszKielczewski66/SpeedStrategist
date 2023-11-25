import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';

const SettingsScreen = () => {
    const [settings, setSettings] = useState([]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settingsSnapshot = await firestore().collection('Settings').get();
                const settingsData = settingsSnapshot.docs.map(doc => doc.data());
                console.log(settingsData);
                setSettings(settingsData);
            } catch (error) {
                console.error('Error fetching settings', error);
            }
        };

        fetchSettings();
    }, []);

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
                    <Text className="text-slate-800 text-white text-xl mr-12">Ustawienia</Text>
                </View>
            </View>
        </SafeAreaView>
        </View>
    )
}

export default SettingsScreen;