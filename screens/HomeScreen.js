import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";

export default function HomeScreen({ navigation }) {
  return (
    <Grid style={styles.container}>
      <Col>

      <View style={styles.botoes}>
        <Image
          source={require("../assets/1.png")}
          style={styles.background}
        />
      </View>

      {/* Corpo da página */}
      <Row style={styles.botao} >
        {/* Retângulo rosa 1 */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Estudos")}
          style={styles.retangulo}
        >
            <Image
              source={require("../assets/estudos.png")}
              style={styles.image}
            />
            <Text style={styles.estudos}>Estudos</Text>
        </TouchableOpacity>
      </Row>
      <Row style={styles.botao} size={1}>
        {/* Retângulo rosa 2 */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Alarmes")}
          style={styles.retangulo}
        >
            <Image
              source={require("../assets/alarmes.png")}
              style={styles.image}
            />
            <Text style={styles.alarmes}>Alarmes</Text>
        </TouchableOpacity>
      </Row>
      <Row style={styles.botao}>
        {/* Retângulo rosa 3 */}
        <View style={styles.center}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Aniversários")}
          style={styles.retangulo}
        >
            <Image
              source={require("../assets/aniversario.png")}
              style={styles.image}
            />
            <Text style={styles.aniversario}>Aniversários</Text>
        </TouchableOpacity>
        </View>
      </Row>
      </Col>
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCD166",
    justifyContent: "center",
    alignContent: "center", // Center horizontally
  },
  background: {
    width: 300,
    height: 400,
    alignItems: "center",
  },
  botoes:{
    alignItems: "center",
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
    backgroundColor: "white",
    borderRadius: 20,
    textAlign: "right",
    textAlignVertical: "center",
    fontSize: 35,
    elevation: 10,
    marginTop: -30,
   
  },
  botao: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    width: "260px",
  },
});
