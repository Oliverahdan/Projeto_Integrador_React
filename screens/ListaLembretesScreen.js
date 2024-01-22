import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";


export default function ListaLembretesScreen({ navigation }) {
  const [lembretes, setLembretes] = useState([]);

  useEffect(() => {
    const carregarLembretes = async () => {
      try {
        const existingData = (await AsyncStorage.getItem("estudos")) || "[]";
        const existingDataArray = JSON.parse(existingData);
        setLembretes(existingDataArray);
      } catch (error) {
        console.error("Erro ao carregar lembretes:", error);
      }
    };

    carregarLembretes();
  }, []);

  const handleExcluirLembrete = async (index) => {
    const novosLembretes = [...lembretes];
    novosLembretes.splice(index, 1);

    try {
      await AsyncStorage.setItem("estudos", JSON.stringify(novosLembretes));
      setLembretes(novosLembretes);
    } catch (error) {
      console.error("Erro ao excluir lembrete:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

      {lembretes.length > 0 ? (
        <FlatList
          data={lembretes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.lembreteItem}>
              <Text>{`${item.selectedHourValue} hora's de ${item.selectedSubjectValue} no dia ${item.selectedDate}`}</Text>
              {}
              <TouchableOpacity
                style={styles.excluirButton}
                onPress={() => handleExcluirLembrete(index)}
              >
                <Icon name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>Nenhum lembrete de estudo encontrado.</Text>
      )}
    
    </View>
  );
}

const styles = StyleSheet.create({
  lembreteItem: {
    marginTop: 10,
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#F0F0F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#CDD0D4',
    borderRadius: 5,
  },
  excluirButton: {
    padding: 5,
  },
});
