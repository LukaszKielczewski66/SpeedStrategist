import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const AuthorsScreen = () => {
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
                    <Text className="text-slate-800 text-white text-xl mr-12">Autorzy</Text>
                </View>
            </View>
        </SafeAreaView>
        <View className="flex-1 justify-center items-center">
                <Text className="mt-5 text-lg text-white">Łukasz Kiełczewski</Text>
                <Text className="mt-5 text-lg text-white">Cezary Kożuchowski</Text>
                <Text className="mt-5 text-lg text-white">Kamil Jakubiak</Text>
            </View>
        </View>
    )
}

export default AuthorsScreen;