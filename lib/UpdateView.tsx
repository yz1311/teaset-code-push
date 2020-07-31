import React, { PureComponent } from "react";
import {
  View,
  ImageBackground,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  ImageSourcePropType,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  PixelRatio
} from "react-native";

import {WebView} from 'react-native-webview';  //0.60.x，webview彻底被移除了

interface IProps {
  style?: any;
  modalBorderRadius?: number,
  width: number;
  //是否强制更新
  isMandatory: boolean;
  //提示，默认是热更新的提示
  hint: string;
  versionName?: string;
  message: string;
  packageSizeDesc: string;
  progress: number;
  progressDesc: string;
  onDownload: () => void;
  onIgnore: () => void;
  headerImg?: Image;
  headerImgSrc?: ImageSourcePropType;
  btnContainerStyle?: StyleProp<ViewStyle>;
  btnTextStyle?: StyleProp<TextStyle>;
  btnText?: string;
  restartApp: ()=>void;
  successbtnText: string;
}

interface IState {}

const htmlWrapper = ({message})=>{
  return `
  <html style="font-size: ${PixelRatio.getPixelSizeForLayoutSize(16)}px;">${message}</html>
  `;
}

export default class UpdateView extends PureComponent<IProps, IState> {
  static defaultProps = {
    modalBorderRadius: 6,
    hint: "下载后会自动重启即更新成功",
    isMandatory: false,
    btnText: '立即更新'
  };

  render() {
    const {
      modalBorderRadius,
      width,
      message,
      progress,
      isMandatory,
      progressDesc,
      onDownload,
      onIgnore,
      packageSizeDesc,
      restartApp,
      successbtnText
    } = this.props;
    const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");
    let webviewSource:any = {
      html: htmlWrapper({message: this.props.message})
    };
    if(Platform.OS==='android') {
        webviewSource.baseUrl = '';
    }
    return (
      <View style={[{ width: width }, this.props.style]}>
          {this.props.headerImg!==undefined?
          this.props.headerImg
          :
            <ImageBackground
            style={{
                width: width,
                height: (width / 512) * 164,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8
            }}
            imageStyle={{ borderTopLeftRadius: modalBorderRadius, borderTopRightRadius: modalBorderRadius}} 
            resizeMode="contain"
            source={this.props.headerImgSrc?this.props.headerImgSrc:require("./imgs/app_update_bg.png")}
            />
          }
        <View
          style={{
            backgroundColor: "#fff",
            minHeight: D_HEIGHT * 0.36,
            maxHeight: D_HEIGHT * 0.6,
            paddingHorizontal: 10
          }}
        >
          <Text style={{ fontSize: 16, color: "#666", marginVertical: 6 }}>
            {"包大小：" + packageSizeDesc}
          </Text>
          <View style={{flex:1,overflow:'hidden'}}>
            <WebView
              source={webviewSource}
              automaticallyAdjustContentInsets
              // scalesPageToFit
              useWebKit={true}
              style={{flex:1}}
            />
          </View>
          <Text style={{ fontSize: 13, color: "#999",marginBottom:10, marginTop:10 }}>
            下载后会自动重启即更新成功
          </Text>
        </View>
        <View style={{ backgroundColor: "#fff", paddingVertical: 15,borderBottomLeftRadius: modalBorderRadius, borderBottomRightRadius: modalBorderRadius }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (!this.props.progress) {
                onDownload && onDownload();
              } else {
                  //必须校验文字，防止出现下载完成，但是没安装完成的情况
                  if(progress===1&&progressDesc.indexOf(successbtnText)>=0) {
                      restartApp&&restartApp();
                  }
              }
            }}
            style={{
              paddingVertical: 12,
              backgroundColor: "#f24a52",
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 15
            }}
          >
            {this.props.progress ? (
              <View style={[{ flexDirection: "row", alignItems: "center" },this.props.btnContainerStyle]}>
                {progress<1?
                <ActivityIndicator color="#fff" />:null}
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    marginLeft: 6
                  }}
                >
                  {progressDesc
                    ? progressDesc
                    : (progress * 100).toFixed(1) + "%"}
                </Text>
              </View>
            ) : (
              <Text style={[{ fontSize: 16, color: "#fff" },this.props.btnTextStyle]}>{this.props.btnText}</Text>
            )}
          </TouchableOpacity>
        </View>
        {!isMandatory ? (
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ alignSelf: "center" }}
            onPress={() => {
              onIgnore && onIgnore();
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                marginTop: 20,
                borderRadius: 15,
                borderColor: "#fff",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>X</Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
