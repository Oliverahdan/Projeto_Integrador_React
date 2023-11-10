import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
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
          title: 'Tela Inicial',
          headerStyle: {
            backgroundColor: '#FCD166', // Cor de fundo do cabeçalho
          },
          headerTintColor: '#000000', // Cor do texto no cabeçalho
          headerTitleStyle: {
            fontSize: 24, // Estilo do título no cabeçalho
          },
        }}
      />
        <Stack.Screen name="Aniversario" component={AniversarioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}