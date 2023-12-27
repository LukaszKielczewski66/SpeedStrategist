import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import API_CONFIG from '../config/api-config';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
      // TODO dlaczego to hasło nie działa?
  // const [password, setPassword] = useState('');
  const password = 'mock-password';

  const handleSubmit = async () => {
    if (email) {
      try {
        let data = JSON.stringify({
          "email": email,
          "password": password,
          "firstName": name
        });
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${API_CONFIG.baseUrl}/register`,
          headers: { 
            'Content-Type': 'application/json', 
          },
          data : data
        }
        
        const response = await axios.request(config);
        if (response) {
          navigation.navigate('Login');
        }

      } catch (err) {
        switch(err.response.status) {
          case 409:
            createAlert('Email zajęty');
            break;
          case 408:
            createAlert('Email zajęty');
            break;
          default:
            createAlert('Wystąpił błąd podczas rejestracji');
        }
      }
    }
  }

  const createAlert = alertContent => {
    console.log(alertContent);
    Alert.alert(alertContent, "Spróbuj ponownie", [
      {
        text: 'Ok',
        onPress: () => {console.log('Ok pressed'); },
      }
    ])
  }
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#61A3BA" }}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image
            className="ml-12"
            source={require("../assets/images/BeepBeep.png")}
            style={{ width: 350, height: 250 }}
          />
        </View>
      </SafeAreaView>
      <View
        className="flex-1 bg-white px-8 pt-8"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Full Name</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value= { name }
            onChangeText={ value => setName(value) }
            placeholder="Enter Name"
          />
          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value={ email }
            onChangeText={ value => setEmail(value) }
            placeholder="Enter Email"
          />
          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
            
            value={ password }
            // onTextChange={ value => setPassword(value) }
            placeholder="Enter password"
          />
          <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl"
          onPress = { handleSubmit }>
            <Text className="font-xl font-bold text-center text-gray-700">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-20">
            <Text className="text-gray-500 font-semibold">Already have an account?</Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                <Text className="font-semibold text-yellow-500"> Login</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
