import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AlarmeScreen from './screens/AlarmeScreen';
import EstudosScreen from './screens/EstudosScreen';
import AniversarioScreen from './screens/AniversarioScreen';

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
        <Stack.Screen name="Aniversario" component={AniversarioScreen} />
        <Stack.Screen name="Estudos" component={EstudosScreen} />
        <Stack.Screen 
        name="Alarmes"
        component={AlarmeScreen}
        options={{
          headerStyle: {
            backgroundColor:'#FCD167',
            height: 90,
          },
          headerTitleStyle: {
            fontSize: 30,
            color:'#765A13',
            marginTop: -35,
          },
          headerLeftContainerStyle: {
            marginTop: -30, // Ajuste este valor conforme necessário
          },
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}