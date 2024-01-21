import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const EditarAniversarioModal = ({ isVisible, aniversario, onClose, onSave }) => {
  const [nome, setNome] = useState(aniversario?.nome || '');
  const [dataNascimento, setDataNascimento] = useState(aniversario?.dataNascimento || '');

  const handleSave = () => {
    // Valide os campos antes de salvar
    if (nome.trim() === '' || dataNascimento.trim() === '') {
      // Pode exibir um alerta ou mensagem de erro aqui
      return;
    }

    onSave({ ...aniversario, nome, dataNascimento });
    onClose();
  };

  const handleDateChange = (text) => {
    let formattedText = text;

    if (formattedText.length === 2 && !formattedText.includes('/')) {
      formattedText += '/';
    }

    if (formattedText.length === 5 && formattedText.charAt(4) !== '/') {
      formattedText += '/';
    }

    if (formattedText.length > 10) {
      formattedText = formattedText.slice(0, 10);
    }

    setDataNascimento(formattedText);
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.modalTitle}>Editar Aniversário</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            onChangeText={setNome}
            value={nome}
          />
          <TextInput
            style={styles.input}
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            onChangeText={handleDateChange} // Alteração aqui
            value={dataNascimento}
            keyboardType='numeric'
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#CF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditarAniversarioModal;
