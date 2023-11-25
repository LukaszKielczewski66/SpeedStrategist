import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../config/firebase"

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
      // TODO dlaczego to hasło nie działa?
  // const [password, setPassword] = useState('');
  const password = 'mock-password';

  const handleSubmit = async () => {
    if (email) {
      console.log(email, password);
      try {
          await createUserWithEmailAndPassword(auth, email, password);
      } catch (err) {
          console.log('got error', err.message);
          createAlert();
      }
    }
  }

  const createAlert = () => {
    Alert.alert('Wystąpił problem podczas rejestracji', 'Spróbuj ponownie', [
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
            value=""
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
