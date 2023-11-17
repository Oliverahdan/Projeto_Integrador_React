import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import { Grid, Row } from 'react-native-easy-grid';

export default function AlarmeScreen({ navigation }) {
  const [showMiniDisplay, setShowMiniDisplay] = useState(false);
  const [selectedAlarme, setSelectedAlarme] = useState(null);
  const [showAddAlarmeModal, setShowAddAlarmeModal] = useState(false);
  const [novoAlarme, setNovoAlarme] = useState({
    horario: '',
    descricao: '',
    nome: '',
  });

  const CustomButton = ({ onPress, title, marginBottom }) => (
    <TouchableOpacity
      style={[styles.customButton, { marginBottom }]}
      onPress={onPress}
    >
      <Text style={styles.customButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const alarmesData = [
    { id: '1', titulo: 'Reunião', horario: '08:00', descricao: 'Reunião importante' },
    { id: '2', titulo: 'Almoço', horario: '12:30', descricao: 'Almoço' },
    // Adicione mais dados conforme necessário
  ];

  const renderAlarmeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleAlarmePress(item)}
    >
      <Text style={styles.itemHorario}>{item.horario}</Text>
      <Text style={styles.itemTitulo}>{item.titulo}</Text>
    </TouchableOpacity>
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
    setNovoAlarme({ horario: '', descricao: '', nome: '' });
  };

  const adicionarAlarme = () => {
    alarmesData.push({
      id: String(alarmesData.length + 1),
      horario: novoAlarme.horario,
      descricao: novoAlarme.descricao,
      titulo: novoAlarme.titulo, // Adicionando o campo de título
    });
    closeAddAlarmeModal();
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniDisplayText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fecharMiniDisplay: {
    color: 'blue',
    fontSize: 16,
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
});
