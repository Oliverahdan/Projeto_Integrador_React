import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialIcons";

const STORAGE_KEY = 'aniversarios';

const ListaAniversariosScreen = () => {
  const navigation = useNavigation();
  const [aniversarios, setAniversarios] = useState([]);

  useEffect(() => {
    loadAniversarios();
  }, []);

  const loadAniversarios = async () => {
    try {
      const storedAniversarios = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedAniversarios) {
        setAniversarios(JSON.parse(storedAniversarios));
      }
    } catch (error) {
      console.error('Erro ao carregar aniversários do AsyncStorage:', error);
    }
  };

  const handleExcluir = async (index) => {
    try {
      const novosAniversarios = [...aniversarios];
      novosAniversarios.splice(index, 1);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosAniversarios));
      setAniversarios(novosAniversarios);
    } catch (error) {
      console.error('Erro ao excluir aniversário do AsyncStorage:', error);
    }
  };

  const calculateAge = (birthdate) => {
    const [day, month, year] = birthdate.split('/').map(Number);
    const birthDateObj = new Date(year, month - 1, day); // Mês é base 0 no JavaScript
    const currentDate = new Date();
  
    let ageYears = currentDate.getFullYear() - birthDateObj.getFullYear();
    const birthMonth = birthDateObj.getMonth();
    const currentMonth = currentDate.getMonth();
  
    // Verifica se ainda não chegou o aniversário este ano
    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDate.getDate() < birthDateObj.getDate())
    ) {
      ageYears--;
    }
  
    if (ageYears === 0) {
      // Se a pessoa tem menos de um ano, calcular a diferença em meses
      const months = (currentDate.getMonth() - birthDateObj.getMonth() + 12) % 12;
      if (months === 0) {
        return 'Menos de um mês';
      } else {
        return `${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
    } else {
      return `${ageYears} ${ageYears === 1 ? 'ano' : 'anos'}`;
    }
  };
  
  

  return (
    <View style={styles.container}>
      {aniversarios.length === 0 ? (
        <Text>Você não tem aniversários marcados</Text>
      ) : (
        <FlatList
          data={aniversarios}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.aniversarioContainer}>
              <Text style={styles.nomeText}>{`Nome: ${item.nome}`}</Text>
              <Text style={styles.idadeText}>{`Idade: ${calculateAge(item.dataNascimento)}`}</Text>

              <TouchableOpacity onPress={() => handleExcluir(index)}>
                <Icon name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aniversarioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderWidth: 1,
    borderColor: '#CDD0D4',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 320, // Ajuste conforme necessário
  },
  nomeText: {
    fontSize: 16,
  },
  idadeText: {
    fontSize: 14,
    color: '#555',
  },
  excluirText: {
    fontSize: 14,
    color: 'red',
  },
});

export default ListaAniversariosScreen;
