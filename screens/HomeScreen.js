import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";

export default function HomeScreen({ navigation }) {
  return (
    <Grid style={styles.container}>
      <Row size={4} style={styles.botoes}>
        <Image
          source={require("../../Projeto_Integrador_React/assets/1.png")}
          style={styles.background}
        />
      </Row>

      {}
      <Row style={styles.botoes} size={1}>
        {}
        <TouchableOpacity
          onPress={() => navigation.navigate("Estudos")}
          style={styles.botao}
        >
          <View style={styles.retangulo}>
            <Image
              source={require("../../Projeto_Integrador_React/assets/estudos.png")}
              style={styles.image}
            />
            <Text style={styles.estudos}>Estudos</Text>
          </View>
        </TouchableOpacity>
      </Row>
      <Row style={styles.botoes} size={1}>
        {}
        <TouchableOpacity
          onPress={() => navigation.navigate("Alarmes")}
          style={styles.botao}
        >
          <View style={styles.retangulo}>
            <Image
              source={require("../../Projeto_Integrador_React/assets/alarmes.png")}
              style={styles.image}
            />
            <Text style={styles.alarmes}>Alarmes</Text>
          </View>
        </TouchableOpacity>
      </Row>
      <Row style={styles.botoes} size={1}>
        {}
        <TouchableOpacity
          onPress={() => navigation.navigate("Aniversários")}
          style={styles.botao}
        >
          <View style={styles.retangulo}>
            <Image
              source={require("../../Projeto_Integrador_React/assets/aniversario.png")}
              style={styles.image}
            />
            <Text style={styles.aniversario}>Aniversários</Text>
          </View>
        </TouchableOpacity>
      </Row>
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCD166",
    justifyContent: "center",
    alignContent: "center",
  },
  background: {
    width: 300,
    height: 400,
    marginLeft: "10%",
  },
  estudos: {
    textAlignVertical: "center",
    fontSize: 25,
    marginLeft: 10,
  },
  alarmes: {
    marginLeft: 10,
    textAlignVertical: "center",
    fontSize: 25,
  },
  aniversario: {
    textAlignVertical: "center",
    fontSize: 25,
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  retangulo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 260,
    backgroundColor: "#E6E9ED",
    borderRadius: 20,
    textAlign: "right",
    textAlignVertical: "center",
    fontSize: 35,
    borderWidth: 2,
    borderColor: "black",
  },
  botao: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    width: "260px",
  },
});
