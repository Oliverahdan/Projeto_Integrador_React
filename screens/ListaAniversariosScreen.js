import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialIcons";
import EditarAniversarioModal from './EditarAniversarioModal';
import * as Notifications from 'expo-notifications';
import moment from 'moment-timezone';

const STORAGE_KEY = 'aniversarios';

const ListaAniversariosScreen = () => {
  const navigation = useNavigation();
  const [aniversarios, setAniversarios] = useState([]);
  

  useEffect(() => {
    loadAniversarios();
    registerForPushNotificationsAsync();
  }, []);

  const loadAniversarios = async () => {
    try {
      const storedAniversarios = await AsyncStorage.getItem(STORAGE_KEY);
  
      console.log('Stored Aniversarios:', storedAniversarios); // Adicione este log
  
      if (storedAniversarios) {
        const aniversariosArray = JSON.parse(storedAniversarios);
        setAniversarios(aniversariosArray);
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAniversario, setSelectedAniversario] = useState(null);
  const [viewDateModalVisible, setViewDateModalVisible] = useState(false);

  const handleViewDate = (aniversario) => {
    setSelectedAniversario(aniversario);
    setViewDateModalVisible(true);
  };

  const handleEdit = (aniversario) => {
    if (aniversario && aniversario.nome) {
      setSelectedAniversario(aniversario);
      setModalVisible(true);
    }
  };

  const handleSaveEdit = async (editedAniversario) => {
    try {
      const updatedAniversarios = aniversarios.map((item) =>
        item === selectedAniversario ? editedAniversario : item
      );
  
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAniversarios));
      setAniversarios(updatedAniversarios);
  
      await scheduleLocalNotification(editedAniversario);
    } catch (error) {
      console.error('Erro ao salvar as edições:', error);
    }
  
    setModalVisible(false);
  };
  
  const registerForPushNotificationsAsync = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      console.log('Status de permissões:', status);
  
      if (status !== 'granted') {
        const { status: askStatus } = await Notifications.requestPermissionsAsync();
        console.log('Status de permissões após a solicitação:', askStatus);
  
        if (askStatus !== 'granted') {
          console.log('Permissão de notificação não concedida');
          return;
        }
      }
  
      const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('Device Token:', deviceToken);
    } catch (error) {
      console.error('Erro ao obter o token do dispositivo:', error);
    }
  };
  
  const scheduleLocalNotification = async (aniversario) => {
    try {
      console.log('Tentando agendar notificação para:', aniversario);
      
      // Extrair o dia e mês do aniversário
      const [day, month] = aniversario.dataNascimento.split('/').map(Number);
  
      // Obter a data atual
      const currentDate = moment().tz('America/Sao_Paulo');

  
      // Configurar a data da notificação para o próximo aniversário
      let notificationDate = moment(aniversario.dataNascimento, 'DD/MM/YYYY').tz('America/Sao_Paulo');
      
      // Verificar se a data já passou, se sim, configurar para o próximo ano
      if (notificationDate.isBefore(currentDate, 'day')) {
        notificationDate.add(1, 'year');
      }
  
      // Calcular o tempo restante até a data da notificação
      const timeUntilNotification = notificationDate.diff(currentDate, 'seconds');
  
      // Agendar a notificação
      const schedulingOptions = {
        content: {
          title: 'Aniversário!',
          body: `Hoje é o aniversário de ${aniversario.nome}! 🎉`,
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
  
  const handleAniversarioPress = (aniversario) => {
    setSelectedAniversario(aniversario);
    setModalVisible(true);
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
            <TouchableOpacity onPress={() => handleViewDate(item)}>
              <View style={styles.aniversarioContainer}>
                <Text style={styles.nomeText}>{`Nome: ${item.nome}`}</Text>
                <Text style={styles.idadeText}>{`Idade: ${calculateAge(item.dataNascimento)}`}</Text>
                <TouchableOpacity onPress={() => item && handleEdit(item)}>
                  <Icon name="edit" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => item && handleExcluir(index)}>
                  <Icon name="delete" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

<Modal
        visible={viewDateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setViewDateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalDateText}>{`Data de Aniversário: ${selectedAniversario?.dataNascimento}`}</Text>
            <TouchableOpacity onPress={() => setViewDateModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <EditarAniversarioModal
        isVisible={modalVisible}
        aniversario={selectedAniversario}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEdit}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor escura de fundo
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalDateText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ListaAniversariosScreen;
