import { Image, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useState } from "react";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const password = 'mock-password';

  const handleSubmit = async () => {
    if (email) {
      console.log(email, password);
      try {
          await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
          console.log('got error', err.message);
          createAlert();
      }
    }
  }

  const createAlert = () => {
    Alert.alert('Błędny użytkownik lub hasło', 'Spróbuj ponownie', [
      {
        text: 'Ok',
        onPress: () => {console.log('Ok pressed'); },
        style: 'Ok'
      }
    ])
  }

  const navigation = useNavigation()
    return (
      <View className="flex-1 bg-white" style={{ backgroundColor: "#61A3BA" }}>
         <SafeAreaView className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={()=> navigation.goBack()} 
          className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View  className="flex-row justify-center">
          <Image source={require('../assets/images/BeepBeepRacer.png')} 
          style={{width: 330, height: 280}} />
        </View>
        </SafeAreaView>
        
        <View 
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50, marginTop: 25}} 
        className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2 mt-8">
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
              secureTextEntry
              placeholder="password"
              value={ password } 
              // onTextChange={ value => setPassword(value) }
            />
            <TouchableOpacity 
              onPress={ handleSubmit }
              className="py-3 bg-yellow-400 rounded-xl">
                <Text 
                    className="text-xl font-bold text-center text-gray-700"
                >
                        Login
                </Text>
             </TouchableOpacity>
            
          </View>
          
          <View className="flex-row justify-center mt-20">
              <Text className="text-gray-500 font-semibold">
                  Don't have an account?
              </Text>
              <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                  <Text className="font-semibold text-yellow-500"> Sign Up</Text>
              </TouchableOpacity>
          </View>
          </View>

      </View>
    )
}

export default LoginScreen
