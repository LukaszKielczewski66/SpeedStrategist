import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const UserScreen = () => {

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
                    <Text className="text-slate-800 text-white text-xl mr-12">Home</Text>
                </View>
            </View>
        </SafeAreaView>
        <View>
            <Text className="text-slate-800 text-white text-xl ml-5 my-5">Moje trasy:</Text>
        </View>
        <View>
            <ScrollView contentContainerStyle={styles.scrollContainer} className="flex px-5">
                <View className="flex-row mt-7">
                    <View className="flex justify-center mr-3">
                        <Text className="text-white text-xl font-bold">1.</Text>
                    </View>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-white">Tytuł: moja trasa</Text>
                        <Text className="text-white">Czas: 21:37</Text>
                        <Text className="text-white">Miejsce w rankingu: 5</Text>
                    </View>
                    <View className="flex items-center justify-center">
                        <TouchableOpacity
                         className="py-3 bg-yellow-400 rounded-xl"
                         onPress={ () => saveIcon() }>
                            <Text className="font-bold text-center text-gray-700 mx-8">Podgląd</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row mt-7">
                    <View className="flex justify-center mr-3">
                        <Text className="text-white text-xl font-bold">1.</Text>
                    </View>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-white">Tytuł: moja trasa</Text>
                        <Text className="text-white">Czas: 16:12</Text>
                        <Text className="text-white">Miejsce w rankingu: 3</Text>
                    </View>
                    <View className="flex items-center justify-center">
                        <TouchableOpacity
                         className="py-3 bg-yellow-400 rounded-xl"
                         onPress={ () => saveIcon() }>
                            <Text className="font-bold text-center text-gray-700 mx-8">Podgląd</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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