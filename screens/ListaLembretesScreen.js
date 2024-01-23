import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Notifications from 'expo-notifications';
import moment from 'moment-timezone';

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

  const scheduleLocalNotification = async (lembrete) => {
    try {
      console.log('Tentando agendar notificação para:', lembrete);

      // Obter a data atual
      const currentDate = moment().tz('America/Sao_Paulo');

      // Configurar a data da notificação para 7 horas da manhã do dia do lembrete
      let notificationDate = moment(lembrete.selectedDate + ' 07:00', 'DD-MM-YYYY HH:mm').tz('America/Sao_Paulo');
      
      // Verificar se a data já passou, se sim, não agendar notificação
      if (notificationDate.isBefore(currentDate, 'minute')) {
        console.log('Data do lembrete já passou. Não será agendada notificação.');
        return;
      }

      // Calcular o tempo restante até a data da notificação
      const timeUntilNotification = notificationDate.diff(currentDate, 'seconds');

      // Agendar a notificação
      const schedulingOptions = {
        content: {
          title: 'Lembrete de Estudo!',
          body: `Hora de estudar ${lembrete.selectedSubjectValue}! 📚`,
          channelId: 'LembrAPP',
  
        },
        trigger: {
          seconds: timeUntilNotification,
        },
      };

      const identifier = await Notifications.scheduleNotificationAsync(schedulingOptions);
      console.log('Notificação agendada:', identifier);
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
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
