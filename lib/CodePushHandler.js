var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Alert, AppState, Dimensions, Modal, TouchableOpacity, View } from 'react-native';
import codePush from 'react-native-code-push';
import UpdateView from './UpdateView';
/**
 * Indicates when you would like to check for (and install) updates from the CodePush server.
 */
var CheckFrequency;
(function (CheckFrequency) {
    /**
     * When the app is fully initialized (or more specifically, when the root component is mounted).
     */
    CheckFrequency[CheckFrequency["ON_APP_START"] = 0] = "ON_APP_START";
    /**
     * When the app re-enters the foreground.
     */
    CheckFrequency[CheckFrequency["ON_APP_RESUME"] = 1] = "ON_APP_RESUME";
})(CheckFrequency || (CheckFrequency = {}));
const decorator = (options) => (WrappedComponent) => {
    class HOC extends Component {
        constructor() {
            super(...arguments);
            this.isChecking = false;
            this.state = {
                modalVisible: false,
                isMandatory: false,
                updateInfo: {},
                progress: 0,
                progressDesc: ''
            };
            this._handleAppStateChange = (appState) => __awaiter(this, void 0, void 0, function* () {
                if (this.props.isDebugMode) {
                    console.log('appstate change ' + appState);
                }
                if (appState === 'active') {
                    this.checkForUpdate();
                    this.isChecking = false;
                }
            });
            this.checkForUpdate = () => __awaiter(this, void 0, void 0, function* () {
                if (this.isChecking) {
                    return;
                }
                if (this.props.isDebugMode) {
                    console.log('开始检查热更新...');
                }
                this.isChecking = true;
                let remotePackage;
                try {
                    remotePackage = (yield codePush.checkForUpdate());
                }
                catch (e) {
                    console.log('检查热更新失败\n', e.message);
                    if (this.props.isDebugMode) {
                        Alert.alert('', '检查热更新失败\n' + e.message);
                    }
                    this.isChecking = false;
                    return;
                }
                //如果前面安装失败过，则忽略更新
                if (remotePackage.failedInstall) {
                    return;
                }
                if (remotePackage) {
                    //需要检查下是否能连接到服务器，防止出现对话框但又下载失败
                    //https://github.com/facebook/react-native/issues/19435
                    //有bug，直接失败,暂时屏蔽
                    // try {
                    //   let response: Response = await fetch(remotePackage.downloadUrl, {
                    //     method: 'HEAD'
                    //   });
                    //   console.log(response);
                    // } catch (e) {
                    //   console.log(e.message);
                    //   return;
                    // }
                    let desc = remotePackage.description;
                    let uuid = '0';
                    //兼容老版本
                    try {
                        desc = JSON.parse(remotePackage.description).description;
                    }
                    catch (e) {
                        console.log(e.message);
                    }
                    try {
                        uuid = JSON.parse(remotePackage.description).uuid;
                    }
                    catch (e) {
                    }
                    remotePackage.desc = desc;
                    //默认是不弹出对话框
                    remotePackage.isSilent = true;
                    try {
                        let isSilent = JSON.parse(remotePackage.description).isSilent;
                        if (isSilent != undefined && typeof isSilent == 'boolean') {
                            remotePackage.isSilent = isSilent;
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    if (!(this.props.willDownload == undefined ||
                        typeof this.props.willDownload != 'function' ||
                        this.props.willDownload != undefined && this.props.willDownload(remotePackage) == undefined ||
                        this.props.willDownload(remotePackage) == true)) {
                        this.isChecking = false;
                        return;
                    }
                    //静默直接下载安装
                    if (remotePackage.isSilent) {
                        this.setState({
                            updateInfo: remotePackage
                        }, () => {
                            this.downloadAndInstall();
                        });
                    }
                    else {
                        this.setState({
                            modalVisible: true,
                            updateInfo: remotePackage
                        });
                    }
                    if (this.props.isDebugMode) {
                        console.log('安装包信息:', remotePackage);
                    }
                }
                else {
                    if (this.props.isDebugMode) {
                        Alert.alert('', this.props.newestAlertInfo);
                        console.log('已是最新版本');
                    }
                }
            });
            this.downloadAndInstall = () => __awaiter(this, void 0, void 0, function* () {
                this.setState({
                    //为了显示progressDesc，必须设置一个值
                    progress: 0.01,
                    progressDesc: '准备下载...',
                    isMandatory: true
                });
                const { updateInfo } = this.state;
                let localPackage;
                try {
                    localPackage = yield updateInfo.download((progress) => {
                        if (this.props.isDebugMode) {
                            console.log('codePushHandler:', progress);
                        }
                        this.setState({
                            progressDesc: '',
                            progress: progress.receivedBytes / progress.totalBytes
                        });
                    });
                }
                catch (e) {
                    this.setState({
                        progressDesc: '',
                        modalVisible: false,
                        progress: 0
                    });
                    if (!updateInfo.isSilent) {
                        Alert.alert('', '下载失败!' + e.message, [{ text: '知道了' }]);
                    }
                }
                if (localPackage) {
                    if (this.props.isDebugMode) {
                        console.log('下载成功！');
                    }
                    //只能这里关闭，后面因为app会自动重启，会失效,导致modal关闭不了
                    try {
                        //暂停半分钟之后应用
                        yield localPackage.install(updateInfo.isSilent ? codePush.InstallMode.ON_NEXT_SUSPEND : codePush.InstallMode.ON_NEXT_RESTART, 30);
                        //安装成功后会变成isPending
                        if (localPackage.isPending) {
                            if (this.props.isDebugMode) {
                                console.log('安装成功！');
                            }
                            yield codePush.notifyAppReady();
                        }
                        else {
                            throw new Error('安装状态错误!');
                        }
                        if (!updateInfo.isSilent) {
                            //屏蔽Alert弹窗，在部分情况下(譬如刚好弹出授权弹窗),Alert会不显示，导致无法重启
                            // Alert.alert('提示', this.props.successAlertInfo, [{
                            //   text: '确定',
                            //   onPress: () => {
                            //     this.setState({
                            //       modalVisible: false
                            //     },()=>{
                            //       codePush.restartApp();
                            //     });
                            //   }
                            // }], { cancelable: false });
                            let delay = this.props.successDelay;
                            //不延迟，必须手动关闭
                            if (delay === null || delay === undefined) {
                                this.setState({
                                    progressDesc: this.props.successBtnText
                                });
                            }
                            //不延迟，不等待用户,立马执行重启App
                            else if (delay <= 0) {
                                codePush.restartApp();
                            }
                            else {
                                this.setState({
                                    progressDesc: this.props.successBtnText + `(${delay}s)`
                                });
                                this.deplayInterval = setInterval(() => {
                                    delay--;
                                    if (delay === 0) {
                                        this.deplayInterval && clearInterval(this.deplayInterval);
                                        codePush.restartApp();
                                    }
                                    else {
                                        this.setState({
                                            progressDesc: this.props.successBtnText + `(${delay}s)`
                                        });
                                    }
                                }, 1000);
                            }
                        }
                        else {
                            //静默模式，app在后台30s以上或者手动重启App，会自动更新
                            this.setState({
                                modalVisible: false
                            });
                        }
                        // this.setState({modalVisible: false},()=>{
                        //   codePush.restartApp();
                        // });
                    }
                    catch (e) {
                        //失败后关闭modal
                        this.setState({
                            modalVisible: false
                        }, () => {
                            if (!updateInfo.isSilent) {
                                Alert.alert('', '安装失败!' + e.message, [{ text: '知道了' }]);
                            }
                        });
                    }
                }
            });
        }
        componentDidMount() {
            if (this.props.checkFrequency === CheckFrequency.ON_APP_RESUME) {
                AppState.addEventListener('change', this._handleAppStateChange);
            }
            this.checkForUpdate();
            this.isChecking = false;
        }
        componentWillUnmount() {
            if (this.props.checkFrequency === CheckFrequency.ON_APP_RESUME) {
                AppState.removeEventListener('change', this._handleAppStateChange);
            }
        }
        render() {
            const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');
            const { updateInfo } = this.state;
            const updateViewProps = {
                width: D_WIDTH * 0.9,
                message: updateInfo.desc,
                versionName: updateInfo.label,
                progress: this.state.progress,
                packageSizeDesc: (updateInfo.packageSize / 1024 / 1024).toFixed(1) + 'MB',
                isMandatory: updateInfo.isMandatory || this.state.isMandatory,
                progressDesc: this.state.progressDesc,
                successBtnText: this.props.successBtnText,
                restartApp: () => {
                    codePush.restartApp();
                },
                onDownload: () => __awaiter(this, void 0, void 0, function* () {
                    this.downloadAndInstall();
                }),
                onIgnore: () => {
                    this.setState({
                        modalVisible: false,
                        progress: 0
                    });
                }
            };
            return (<View style={{ flex: 1 }}>
          <WrappedComponent {...this.props}/>
          <Modal animationType="slide" transparent={true} visible={this.state.modalVisible} onRequestClose={() => {
                if (this.state.isMandatory) {
                    return;
                }
                this.setState({
                    modalVisible: false
                });
            }}>
            <TouchableOpacity activeOpacity={1} style={{ backgroundColor: 'rgba(1,1,1,0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            {this.props.updateView ?
                this.props.updateView(updateViewProps)
                :
                    <UpdateView {...updateViewProps}/>}
            </TouchableOpacity>
          </Modal>
        </View>);
        }
    }
    HOC.defaultProps = {
        checkFrequency: CheckFrequency.ON_APP_RESUME,
        isDebugMode: false,
        newestAlertInfo: '已是最新版本',
        successAlertInfo: '安装成功，点击[确定]后App将自动重启，重启后即更新成功！',
        successBtnText: '立即重启APP',
        successDelay: 5,
        failAlertInfo: ''
    };
    hoistNonReactStatic(HOC, WrappedComponent);
    //传递默认属性
    if (options) {
        for (let key in options) {
            HOC.defaultProps[key] = options[key];
        }
    }
    return HOC;
};
export default decorator;
//# sourceMappingURL=CodePushHandler.js.map