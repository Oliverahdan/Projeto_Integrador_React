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
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Meus Lembretes:</Text>

      {lembretes.length > 0 ? (
        <FlatList
          data={lembretes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.lembreteItem}>
              <Text>{`Estudar ${item.selectedHourValue} horas de ${item.selectedSubjectValue} no dia ${item.selectedDate}`}</Text>
              {}
              <TouchableOpacity
                style={styles.excluirButton}
                onPress={() => handleExcluirLembrete(index)}
              >
                <Icon name="delete" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>Nenhum lembrete de estudo encontrado.</Text>
      )}

      {}
      <TouchableOpacity
        style={{
          marginTop: 20,
          width: 150,
          height: 60,
          backgroundColor: "#EA86BF",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#822E5E" }}>
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  lembreteItem: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  excluirButton: {
    backgroundColor: "#EA86BF",
    borderRadius: 5,
    padding: 5,
  },
});
