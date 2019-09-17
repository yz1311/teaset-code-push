import React, { PureComponent } from "react";
import { View, ImageBackground, Text, ActivityIndicator, TouchableOpacity, Dimensions, PixelRatio } from "react-native";
import { WebView } from 'react-native-webview'; //0.60.x，webview彻底被移除了
const htmlWrapper = ({ message }) => {
    return `
  <html style="font-size: ${PixelRatio.getPixelSizeForLayoutSize(16)}px;">${message}</html>
  `;
};
export default class UpdateView extends PureComponent {
    render() {
        const { width, message, progress, isMandatory, progressDesc, onDownload, onIgnore, packageSizeDesc } = this.props;
        const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");
        return (<View style={[{ width: width }, this.props.style]}>
          {this.props.headerImg !== undefined ?
            this.props.headerImg
            :
                <ImageBackground style={{
                    width: width,
                    height: (width / 512) * 164,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                }} resizeMode="contain" source={this.props.headerImgSrc ? this.props.headerImgSrc : require("./imgs/app_update_bg.png")}/>}
        <View style={{
            backgroundColor: "#fff",
            minHeight: D_HEIGHT * 0.35,
            maxHeight: D_HEIGHT * 0.6,
            paddingHorizontal: 10
        }}>
          <Text style={{ fontSize: 16, color: "#666", marginVertical: 6 }}>
            {"包大小：" + packageSizeDesc}
          </Text>
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <WebView source={{ html: htmlWrapper({ message: this.props.message }), baseUrl: '' }} automaticallyAdjustContentInsets 
        // scalesPageToFit
        useWebKit={true} style={{ flex: 1 }}/>
          </View>
          <Text style={{ fontSize: 13, color: "#999", marginBottom: 10 }}>
            下载后会自动重启即更新成功
          </Text>
        </View>
        <View style={{ backgroundColor: "#fff", paddingVertical: 15 }}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {
            if (!this.props.progress) {
                onDownload && onDownload();
            }
        }} style={{
            paddingVertical: 12,
            backgroundColor: "#f24a52",
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 15
        }}>
            {this.props.progress ? (<View style={[{ flexDirection: "row", alignItems: "center" }, this.props.btnContainerStyle]}>
                <ActivityIndicator color="#fff"/>
                <Text style={{
            fontSize: 16,
            color: "#fff",
            marginLeft: 6
        }}>
                  {progressDesc
            ? progressDesc
            : (progress * 100).toFixed(1) + "%"}
                </Text>
              </View>) : (<Text style={[{ fontSize: 16, color: "#fff" }, this.props.btnTextStyle]}>{this.props.btnText}</Text>)}
          </TouchableOpacity>
        </View>
        {!isMandatory ? (<TouchableOpacity activeOpacity={0.75} style={{ alignSelf: "center" }} onPress={() => {
            onIgnore && onIgnore();
        }}>
            <View style={{
            width: 30,
            height: 30,
            marginTop: 20,
            borderRadius: 15,
            borderColor: "#fff",
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
              <Text style={{ color: "#fff", fontSize: 16 }}>X</Text>
            </View>
          </TouchableOpacity>) : null}
      </View>);
    }
}
UpdateView.defaultProps = {
    hint: "下载后会自动重启即更新成功",
    isMandatory: false,
    btnText: '立即更新'
};
//# sourceMappingURL=UpdateView.js.map