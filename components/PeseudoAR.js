import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Location, Camera, Permissions } from "expo";
import APIKey from "../config/APIKey";

class PeseudoAR extends Component {
  state = {
    image: null,
    hasCameraPermission: null,
    hasLocationPermission: null,
    type: Camera.Constants.Type.back,
    location: null
  };

  async componentDidMount() {
    const { status: cameraStatus } = await Permissions.askAsync(
      Permissions.CAMERA
    );
    const { status: locationStatus } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    const updateLocation = async () => {
      const { coords } = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true
      });
      const latlng = `${coords.latitude},${coords.longitude}`;
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${APIKey}`
      );
      const json = await res.json();
      this.setState({
        location: json.results[0] && json.results[0].formatted_address
      });
    };

    updateLocation();
    setInterval(updateLocation, 10000);

    this.setState({
      hasCameraPermission: cameraStatus === "granted",
      hasLocationPermission: locationStatus === "granted"
    });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  {" "}
                  Flip{" "}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flex: 0.8,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  Location: {JSON.stringify(this.state.location)}
                </Text>
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

export default PeseudoAR;
