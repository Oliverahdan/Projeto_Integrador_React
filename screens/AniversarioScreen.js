import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function AniversarioScreen() {
  const [nome, setNome] = useState('');

  return (
    <View style={styles.container}>
      <Text>Tela de Aniversário</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do aniversariante"
          onChangeText={text => setNome(text)}
          value={nome}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 20,
    width: '80%',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
  },
});
