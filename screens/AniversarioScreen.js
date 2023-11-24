import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';

export default function AniversarioScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  return (
    <Grid style={styles.container}>
      <Col>
      <Row>
        <Col style={styles.col}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do aniversariante"
              onChangeText={text => setNome(text)}
              value={nome}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de Nascimento:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a data de nascimento do aniversariante"
              onChangeText={text => setDataNascimento(text)}
              value={dataNascimento}
            />
          </View>
        </Col>
      </Row>


      </Col>
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {
    margin: 10,
  },
  inputContainer: {
    marginTop: 20,
    width: '100%', // Use 100% to take the full width of the column
  },
  label: {
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
