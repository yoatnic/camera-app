import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  CameraRoll
} from "react-native";
import { Location, Camera, Permissions, Constants } from "expo";
import APIKey from "../env/APIKey";

class PeseudoAR extends Component {
  state = {
    image: null,
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    hasLocationPermission: null,
    type: Camera.Constants.Type.back,
    location: null
  };

  constructor(...args) {
    super(...args);
    this.snap = this.snap.bind(this);
  }

  async componentDidMount() {
    const { status: cameraStatus } = await Permissions.askAsync(
      Permissions.CAMERA
    );
    const { status: cameraRollStatus } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
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
      hasCameraRollPermission: cameraRollStatus === "granted",
      hasLocationPermission: locationStatus === "granted"
    });
  }

  async snap() {
    if (!this.camera) return;

    const photo = await this.camera.takePictureAsync({
      pictureSize: "1920x1080"
    });
    await CameraRoll.saveToCameraRoll(photo.uri, "photo");
  }

  render() {
    const { hasCameraPermission, hasLocationPermission } = this.state;
    if (hasCameraPermission === null) return <View />;
    if (hasCameraPermission === false) return <Text>No access to camera</Text>;
    if (hasLocationPermission === false) return <Text>No access to GPS</Text>;

    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={this.state.type}
          ref={ref => {
            this.camera = ref;
          }}
        />
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "transparent"
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain"
            }}
            source={require("../resources/images/figure_dance.png")}
          />
        </View>
        <View
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            flexDirection: "row",
            marginTop: Constants.statusBarHeight
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
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              {" "}
              Flip{" "}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 0.9,
              alignSelf: "flex-end",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              Location: {JSON.stringify(this.state.location)}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            flex: 1,
            alignSelf: "center",
            alignItems: "center",
            bottom: 0
          }}
        >
          <Button onPress={this.snap} title="Snap" />
        </View>
      </View>
    );
  }
}

export default PeseudoAR;
