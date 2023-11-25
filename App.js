import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AlarmeScreen from './screens/AlarmeScreen';
import EstudosScreen from './screens/EstudosScreen';
import AniversarioScreen from './screens/AniversarioScreen';
import EstudoScreenLembrate from './screens/EstudoScreenLembrate';


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
            backgroundColor: '#FCD166', // Cor de fundo do cabeçalho
          },
          headerTintColor: '#FCD166', // Cor do texto no cabeçalho
          headerTitleStyle: {
            fontSize: 24, // Estilo do título no cabeçalho
          },
        }}
      />
        <Stack.Screen name="Aniversários" 
        component={AniversarioScreen} 
        options={{
          headerStyle: {
            backgroundColor:'#FCD167',
            height: 100,
          },
          headerTitleStyle: {
            fontSize: 25,
            color:'#765A13',
            marginTop: -10,
          },
          headerLeftContainerStyle: {
            marginTop: -10, // Ajuste este valor conforme necessário
          },
        }} />
        <Stack.Screen name="Estudos" component={EstudosScreen} />
        <Stack.Screen 
        name="Alarmes"
        component={AlarmeScreen}
        options={{
          headerStyle: {
            backgroundColor:'#FCD167',
            height: 100,
          },
          headerTitleStyle: {
            fontSize: 25,
            color:'#765A13',
            marginTop: -35,
          },
          headerLeftContainerStyle: {
            marginTop: -35, // Ajuste este valor conforme necessário
          },
        }}
        />
         <Stack.Screen name="EstudoScreenLembrate" component={EstudoScreenLembrate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}