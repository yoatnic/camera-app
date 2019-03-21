import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PeseudoAR from "./components/PeseudoAR";

export default class App extends React.Component {
  render() {
    return <PeseudoAR />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
