import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import AlarmeScreen from "./screens/AlarmeScreen";
import EstudosScreen from "./screens/EstudosScreen";
import AniversarioScreen from "./screens/AniversarioScreen";
import EstudoScreenLembrate from "./screens/EstudoScreenLembrate";
import ListaLembretesScreen from "./screens/ListaLembretesScreen";
import ListaAniversariosScreen from "./screens/ListaAniversariosScreen";
import { TouchableOpacity, Image} from "react-native";
import EditarAniversarioModal from "./screens/EditarAniversarioModal";


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
              backgroundColor: "#D2AF55",
              height: 35,
            },
            headerTintColor: "#FCD166",
            headerTitleStyle: {
              fontSize: 10,
            },

          }}
        />
        <Stack.Screen
          name="Aniversários"
          component={AniversarioScreen}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: "#FCD167",
              height: 100,
            },
            headerTitleStyle: {
              fontSize: 25,
              color: "black",
              marginTop: -10,
            },
            headerLeftContainerStyle: {
              marginTop: -10,
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('ListaAniversarios')}
                style={{ marginRight: 15 }}
              >
               <Image
                source={require("../Projeto_Integrador_React/assets/menu.png")}
              />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
        name="ListaAniversarios"
        component={ListaAniversariosScreen}
        options={{
          headerStyle: {
            backgroundColor: "#EA86BF",
            height: 100,
          },
          headerTitleStyle: {
            fontSize: 25,
            color: "black",
            marginTop: -10,
          },
          headerLeftContainerStyle: {
            marginTop: -10,
          },
        }}
      />
       <Stack.Screen
        name="EditarAniversarios"
        component={EditarAniversarioModal}
        options={{
          headerStyle: {
            backgroundColor: "#EA86BF",
            height: 100,
          },
          headerTitleStyle: {
            fontSize: 25,
            color: "black",
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
            },
            headerLeftContainerStyle: {
              marginTop: 0,
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
