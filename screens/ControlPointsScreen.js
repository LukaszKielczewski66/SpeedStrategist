import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import API_CONFIG from '../config/api-config';
import axios from "axios";

const ControlPointsScreen = () => {
    const route = useRoute();
    const { controlPoints, routeData, tripName } = route.params;
    const GOOGLE_MAPS_APIKEY = 'AIzaSyAR7ry2g93zY7AtyrSx1rN6qkF88IZblnI';
    const navigation = useNavigation()
    
    const mockWayPoints = [{"latitude":52.1897024,"longitude":21.5320184},{"latitude":52.1889729,"longitude":21.5344283},{"latitude":52.1889058,"longitude":21.5345827},{"latitude":52.1888983,"longitude":21.5347512},{"latitude":52.1888554,"longitude":21.5351395},{"latitude":52.1869063,"longitude":21.5419448},{"latitude":52.1869515,"longitude":21.5423436},{"latitude":52.1870703,"longitude":21.5423974},{"latitude":52.1897367,"longitude":21.5427251},{"latitude":52.1987245,"longitude":21.5365295},{"latitude":52.2016774,"longitude":21.5373876},{"latitude":52.2023976,"longitude":21.5363716},{"latitude":52.2023351,"longitude":21.5367401},{"latitude":52.2021763,"longitude":21.536229},{"latitude":52.1941951,"longitude":21.5293664},{"latitude":52.1911172,"longitude":21.5275546},{"latitude":52.1906676,"longitude":21.5281676},{"latitude":52.1906347,"longitude":21.5284262},{"latitude":52.1906035,"longitude":21.5286719},{"latitude":52.1906035,"longitude":21.5286719},{"latitude":52.1906012,"longitude":21.5286902}]
    const mockDestination = {"latitude":52.1906012,"longitude":21.5286902};
    const mockOrigin = {"latitude":52.1897024,"longitude":21.5320184};
    const mockControls = [{"latitude":52.1897024,"longitude":21.5320184},{"latitude":52.1889729,"longitude":21.5344283},{"latitude":52.1889058,"longitude":21.5345827}];

    useEffect(() => {
        console.log(`route data: `, routeData)
        console.log(`control points`, controlPoints);
    }, [])

    const [modalVisible, setModalVisible] = useState(false);
    const [inputs, setInputs] = useState([]);

    const handleInputChange = (value, index) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
      };

    const [lastTime, setLastTime] = useState(null)

    const closeModal = () => {
        setModalVisible(false);
    }

    const showModal = () => {
        setModalVisible(true)
    }

    const saveControlPoints = async() => {
        console.log(inputs)
        let tab = inputs;
        tab.push(lastTime)
        console.log(lastTime);
        const times = {
            actualTimes: ["2", "3", "4"],
            desiredTimes: tab
        }
        console.log(times)
        let data = {
            email: routeData.author,
            routeName: tripName,
            controls: JSON.stringify(controlPoints),
            times: JSON.stringify(times)
        }
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_CONFIG.baseUrl}/addControlPoints`,
            data: data
        }

        try {
            const res = await axios.request(config);
            if (res) {
                console.log(res);
            }
        } catch (e) {
            console.log(e);
        }
        closeModal();
    }

    return (
        <View className="flex-1" style={{ backgroundColor: "#0f172a" }}>
            <SafeAreaView className="flex mb-10">
                <View className="flex-row justify-start">
                    <TouchableOpacity
                        onPress={()=> navigation.goBack()} 
                        className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                        <ArrowLeftIcon size="20" color="black" />
                    </TouchableOpacity>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-slate-800 text-white text-xl mr-12">Punkty kontrolne</Text>
                    </View>
                </View>
                <View className="mx-10 mt-5">
                    <TouchableOpacity
                        onPress={ showModal } 
                        className="py-3 bg-yellow-400 rounded-xl mx-10">
                        <Text className="font-bold text-center text-gray-700 mx-8">Dodaj swoje czasy</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <View style={styles.container}>
                <MapView style={styles.map} initialRegion={{
                    // latitude: routeData.origin.latitude,
                    // longitude: routeData.origin.longitude,
                    latitude: 52.1897024,
                    longitude: 21.5320184,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>

                {
                    controlPoints.map((marker, index) => (
                        <Marker
                            key={ index }
                            coordinate={
                                {
                                    longitude: marker.longitude,
                                    latitude: marker.latitude
                                }
                             }
                            title="punkt kontrolny"
                            description={ `Punkt kontrolny nr. ${index + 1}` }
                        ></Marker>
                    ))
                }

                <MapViewDirections
                  origin={ routeData.origin }
                  destination={ routeData.destination }
                  waypoints={ routeData.waypoints }
                  apikey={ GOOGLE_MAPS_APIKEY }
                  strokeWidth={5}
                  strokeColor="hotpink"
                />
                </MapView>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}></View>
                </TouchableWithoutFeedback>

                <View style={styles.modalContent}>
                    <View className="flex-row w-100 mb-10">
                        <Text className="mx-1 text-slate-800 text-xl">Punkty kontrolne</Text>
                        <Text className="mx-1 text-slate-800 text-xl">Twój czas </Text>
                        <Text className="mx-1 text-slate-700 text-xl">Pożądany czas</Text>
                    </View>

                    {
                        controlPoints.map((controlPoint, index) => (
                            <View className="flex-row w-100 mx-4" key={ index }>
                                <Text className="mx-7 p-3">Punkty: { index === 0 ? 'Start' : index } - { index + 1 }</Text>
                                <Text className="mx-7 p-3">{ index + 2 }s </Text>
                                <TextInput
                                 key={ index }
                                 onChangeText={(text) => handleInputChange(text, index)}
                                 placeholder="Pożądany czas.."
                                 className="p-3 bg-gray-100 text-gray-700 rounded mb-3"
                                ></TextInput>
                            </View>
                        ))
                    }
                    <View className="flex-row w-100 mx-4">
                        <Text className="mx-7 p-3">{ controlPoints.length } - meta </Text>
                        <Text className="mx-7 p-3">{ controlPoints.length + 3 }s </Text>
                        <TextInput
                            onChangeText={(text) => setLastTime(text)}
                            placeholder="Pożądany czas.."
                            className="p-3 bg-gray-100 text-gray-700 rounded mb-3"
                        ></TextInput>
                    </View>

                    <View className="mx-10 mt-8">
                    <TouchableOpacity
                        onPress={ saveControlPoints } 
                        className="py-3 bg-yellow-400 rounded-xl mx-10">
                        <Text className="font-bold text-center text-gray-700 mx-8">Zapisz czasy</Text>
                    </TouchableOpacity>
                </View>


                </View>
            </Modal>
        </View>
    )

}

export default ControlPointsScreen

const styles = StyleSheet.create({
    container: {
      height: '90%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    map: {
      marginTop: '50px',
      flex: 3,
      width: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        position: 'absolute',
        backgroundColor: '#0f172a',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: Dimensions.get('window').height / 2,
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        display: 'flex',
        alignItems: 'center'
      },
  });