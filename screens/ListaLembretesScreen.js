import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListaLembretesScreen({ navigation }) {
  const [lembretes, setLembretes] = useState([]);

  useEffect(() => {
    // Carregar os lembretes salvos ao abrir a tela
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Lista de Lembretes de Estudos</Text>

      {lembretes.length > 0 ? (
        <FlatList
          data={lembretes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.lembreteItem}>
              <Text>{`Estudar ${item.selectedHourValue} horas de ${item.selectedSubjectValue} no dia ${item.selectedDate}`}</Text>
            </View>
          )}
        />
      ) : (
        <Text>Nenhum lembrete de estudo encontrado.</Text>
      )}

      {/* Botão para voltar à tela anterior */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          width: 150,
          height: 60,
          backgroundColor: "#EA86BF",
          justifyContent: "center",
          alignItems: "center",
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
  },
});
