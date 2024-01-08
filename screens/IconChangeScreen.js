import { Image, Text, TextInput, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import API_CONFIG from '../config/api-config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const IconChangeScreen = () => {
    return (
        <View></View>
    )
}

export default IconChangeScreen