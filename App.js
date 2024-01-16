import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import AlarmeScreen from "./screens/AlarmeScreen";
import EstudosScreen from "./screens/EstudosScreen";
import AniversarioScreen from "./screens/AniversarioScreen";
import EstudoScreenLembrate from "./screens/EstudoScreenLembrate";
import ListaLembretesScreen from "./screens/ListaLembretesScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerStyle: {
              backgroundColor: "#FCD166",
            },
            headerTintColor: "#FCD166",
            headerTitleStyle: {
              fontSize: 24,
            },
          }}
        />
        <Stack.Screen
          name="Aniversários"
          component={AniversarioScreen}
          options={{
            headerStyle: {
              backgroundColor: "#FCD167",
              height: 100,
            },
            headerTitleStyle: {
              fontSize: 25,
              color: "#765A13",
              marginTop: -10,
            },
            headerLeftContainerStyle: {
              marginTop: -10,
            },
          }}
        />
        <Stack.Screen
          name="Estudos"
          component={EstudosScreen}
          options={{
            headerStyle: {
              backgroundColor: "#FCD167",
              height: 100,
            },
            headerTitleStyle: {
              fontSize: 25,
              color: "#765A13",
              marginTop: -35,
            },
            headerLeftContainerStyle: {
              marginTop: -35,
            },
          }}
        />
        <Stack.Screen
          name="Alarmes"
          component={AlarmeScreen}
          options={{
            headerStyle: {
              backgroundColor: "#FCD167",
              height: 100,
            },
            headerTitleStyle: {
              fontSize: 25,
              color: "#765A13",
              marginTop: -35,
            },
            headerLeftContainerStyle: {
              marginTop: -35,
            },
          }}
        />
        <Stack.Screen
          name="EstudoScreenLembrate"
          component={EstudoScreenLembrate}
          options={{
            headerStyle: {
              backgroundColor: "#FCD167",
              height: 100,
            },
            headerTitleStyle: {
              fontSize: 25,
              color: "#765A13",
              marginTop: -35,
            },
            headerLeftContainerStyle: {
              marginTop: -35,
            },
          }}
        />
        <Stack.Screen
          name="ListaLembretesScreen"
          component={ListaLembretesScreen}
          options={{
            headerStyle: {
              backgroundColor: "#FCD167",
              height: 100,
            },
            headerTitleStyle: {
              fontSize: 25,
              color: "#765A13",
              marginTop: -35,
            },
            headerLeftContainerStyle: {
              marginTop: -35,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
