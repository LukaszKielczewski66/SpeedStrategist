import React from "react";
import { View, Image, Text } from "react-native";

const LoadingScreen = props => {
    return (
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: "#61A3BA" }}>
            <Image source={require("../assets/images/speedstrategist.png")}
                    style={{width: 350, height: 350}} />
            <Text className="text-slate-800 text-white text-xl">{ props.message }</Text>
        </View>
    )
}

export default LoadingScreen;