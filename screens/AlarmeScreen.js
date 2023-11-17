import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Grid, Row } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlarmeScreen({ navigation }) {
  const [showMiniDisplay, setShowMiniDisplay] = useState(false);
  const [selectedAlarme, setSelectedAlarme] = useState(null);
  const [showAddAlarmeModal, setShowAddAlarmeModal] = useState(false);
  const [novoAlarme, setNovoAlarme] = useState({
    horario: '',
    descricao: '',
    titulo: '',
  });

  const [alarmesData, setAlarmesData] = useState([]);

  // Carregar dados dos alarmes ao iniciar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosArmazenados = await AsyncStorage.getItem('alarmesData');
        if (dadosArmazenados) {
          setAlarmesData(JSON.parse(dadosArmazenados));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  // Salvar dados dos alarmes ao atualizar
  useEffect(() => {
    const salvarDados = async () => {
      try {
        await AsyncStorage.setItem('alarmesData', JSON.stringify(alarmesData));
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      }
    };

    salvarDados();
  }, [alarmesData]);

  const CustomButton = ({ onPress, title, marginBottom }) => (
    <TouchableOpacity
      style={[styles.customButton, { marginBottom }]}
      onPress={onPress}
    >
      <Text style={styles.customButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderAlarmeItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.alarmeItem}
        onPress={() => handleAlarmePress(item)}
      >
        <Text style={styles.itemHorario}>{item.horario}</Text>
        <Text style={styles.itemTitulo}>{item.titulo}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.excluirButton}
        onPress={() => excluirAlarme(item.id)}
      >
        <Text style={styles.excluirButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAlarmePress = (alarme) => {
    setSelectedAlarme(alarme);
    setShowMiniDisplay(true);
  };

  const closeMiniDisplay = () => {
    setShowMiniDisplay(false);
    setSelectedAlarme(null);
  };

  const openAddAlarmeModal = () => {
    setShowAddAlarmeModal(true);
  };

  const closeAddAlarmeModal = () => {
    setShowAddAlarmeModal(false);
    setNovoAlarme({ horario: '', descricao: '', titulo: '' });
  };

  const adicionarAlarme = () => {
    const novoId = String(alarmesData.length + 1);
    const novoAlarmeData = {
      id: novoId,
      horario: novoAlarme.horario,
      descricao: novoAlarme.descricao,
      titulo: novoAlarme.titulo,
    };

    // Atualizar o estado alarmesData
    setAlarmesData([...alarmesData, novoAlarmeData]);

    // Fechar o modal
    closeAddAlarmeModal();
  };

  const excluirAlarme = (alarmeId) => {
    const novosAlarmes = alarmesData.filter((alarme) => alarme.id !== alarmeId);
    setAlarmesData(novosAlarmes);
  };

  return (
    <Grid style={styles.container}>
      <Row style={styles.botoes} size={3}>
        <FlatList
          data={alarmesData}
          keyExtractor={(item) => item.id}
          renderItem={renderAlarmeItem}
        />
      </Row>

      {showMiniDisplay && selectedAlarme && (
        <View style={styles.miniDisplay}>
          <Text style={styles.miniDisplayText}>
            Horário: {selectedAlarme.horario}
          </Text>
          <Text style={styles.miniDisplayText}>
            Título: {selectedAlarme.titulo}
          </Text>
          <Text style={styles.miniDisplayText}>
            Descrição: {selectedAlarme.descricao}
          </Text>
          <TouchableOpacity onPress={closeMiniDisplay}>
            <Text style={styles.fecharMiniDisplay}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Row style={styles.botoes} size={1}>
        <TouchableWithoutFeedback onPress={openAddAlarmeModal}>
          <View style={styles.botaoAdicionar}>
            <Text style={styles.textoBotaoAdicionar}>Adicionar Alarme</Text>
          </View>
        </TouchableWithoutFeedback>
      </Row>

      <Modal
        visible={showAddAlarmeModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Alarme</Text>
            <TextInput
              style={styles.input}
              placeholder="Horário"
              value={novoAlarme.horario}
              onChangeText={(text) =>
                setNovoAlarme({ ...novoAlarme, horario: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={novoAlarme.titulo}
              onChangeText={(text) =>
                setNovoAlarme({ ...novoAlarme, titulo: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={novoAlarme.descricao}
              onChangeText={(text) =>
                setNovoAlarme({ ...novoAlarme, descricao: text })
              }
            />
            <CustomButton onPress={adicionarAlarme} title="Adicionar" marginBottom={10} />
            <CustomButton onPress={closeAddAlarmeModal} title="Cancelar" marginBottom={0} />
          </View>
        </View>
      </Modal>
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EBEE',
    justifyContent: 'center',
    alignContent: 'center', // Center horizontally
  },
  background: {
    width: 300,
    height: 400,
    marginLeft: 25,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9ED',
    padding: 20,
  },
  itemHorario: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#822E5E',
  },
  itemDescricao: {
    fontSize: 16,
    marginTop: 5,
  },
  botaoAdicionar: {
    backgroundColor: '#EA86BF',
    borderRadius: 20,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    marginLeft:'27.5%',
    height: 70,
    justifyContent: 'center',
    marginTop: 30,
  },
  textoBotaoAdicionar: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#822E5E',
  },
  miniDisplay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(180, 180, 180, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniDisplayText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fecharMiniDisplay: {
    marginTop: 30,
    color: '#822E5E',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#E8EBEE',
    padding: 20,
    borderRadius: 10,
    elevation: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#822E5E',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3944', // Adicione uma cor apropriada para o título
  },
  customButton: {
    backgroundColor: '#EA86BF',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  customButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#822E5E',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9ED',
    padding: 20,
  },
  alarmeItem: {
    flex: 1,
  },
  excluirButton: {
    backgroundColor: '#EA86BF',
    borderRadius: 10,
    padding: 10,
  },
  excluirButtonText: {
    color: '#822E5E',
  },
});