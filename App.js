import React, {Component} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';


export default class App extends Component {
  state = {
    hasCameraPermission: null,
    cameraType: Camera.Constants.Type.back,
    capturing: null,
  }

  async componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({ hasCameraPermission: cameraStatus === 'granted' && audioStatus === 'granted' });
  }

  handleCameraType=()=> {
    const { cameraType } = this.state

    this.setState({cameraType:
      cameraType === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    })
  }

  takePicture = async () => {
    const { uri } = await this.camera.takePictureAsync();
    const asset = await MediaLibrary.createAssetAsync(uri);
    this.setState({capturing: false});
  }

//   recordVideo = async () => {
//     const { uri } = await this.camera.recordAsync();
//     const asset = await MediaLibrary.createAssetAsync(uri);
//     this.setState({capturing: false});
// };

  pickImage = async () => {
    let result = await ImagePicker.requestCameraRollPermissionsAsync();
    let pickerResult = await ImagePicker.launchImageLibraryAsync();  
  }


  render(){
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } 
    
    else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } 
    
    else {
      return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType}  ref={ref => {this.camera = ref}}>
              <View style={styles.container}>
                
                <TouchableOpacity
                  style={styles.gallery}
                  onPress={()=>this.pickImage()}>
                  <FontAwesome name="picture-o" size={45} color="#fff" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style = {styles.capturebutton}
                  onPress={()=>{this.takePicture()}}> 
                  <FontAwesome name="circle" size={90} color="white" />  
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.flip}
                  onPress={()=>this.handleCameraType()}>
                  <MaterialCommunityIcons name="swap-vertical-bold" size={45} color="#fff" />
                </TouchableOpacity>
                
              </View>
            </Camera>
            
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1, 
    flexDirection:"row",
    justifyContent:"space-between",
    margin:45,
    marginBottom: 20,
  },
  gallery: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent'                 
  },
  capturebutton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  flip: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
});
