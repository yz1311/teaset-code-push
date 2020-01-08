
import {Component} from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleProp,
    ViewStyle,
    TextStyle
} from 'react-native';
import { LocalPackage, RemotePackage } from 'react-native-code-push';
    /**
 * Indicates when you would like to check for (and install) updates from the CodePush server.
 */
export enum CheckFrequency {
    /**
     * When the app is fully initialized (or more specifically, when the root component is mounted).
     */
    ON_APP_START,

    /**
     * When the app re-enters the foreground.
     */
    ON_APP_RESUME,
}

export type myRemotePackage = RemotePackage & { desc: string, isSilent: boolean };

export interface CodePushhandlerOptions {
    //检查频率,默认为resume时更新
    checkFrequency?: CheckFrequency,
    //是否为调试模式
    isDebugMode?: boolean,
    //将要下载事件，返回值，true代表继续更新，false终止更新，默认为true
    //譬如可以根据网络状态来控制是否更新
    willDownload?: (packageInfo: myRemotePackage)=>boolean,
    //当前是最新版本的提示信息
    newestAlertInfo?: string,
    //下载安装成功后的提示信息
    successAlertInfo?: string,
    //替换默认的更新对话框,必须实现IUpdateViewProps相关属性
    updateView?: (props:IUpdateViewProps) => Element
}

export function CodePushHandler(options?: CodePushhandlerOptions): (x: any) => any;

//自定义updateView需要实现的属性
export interface IUpdateViewProps {
    style?: StyleProp<ViewStyle>;
    //对话框的borderRadius，默认值:6
    modalBorderRadius?: number,
    width: number;
    //是否强制更新,为true时，底部的关闭按钮不显示
    isMandatory: boolean;
    //提示，默认是热更新的提示
    hint: string;
    versionName?: string;
    message: string;
    packageSizeDesc: string;
    progress: number;
    progressDesc: string;
    //点击下载按钮回调事件
    onDownload: () => void;
    //点击底部的关闭按钮回调事件
    onIgnore: () => void;
    headerImg: Image;
    headerImgSrc?: ImageSourcePropType;
    //按钮容器样式
    btnContainerStyle?: StyleProp<ViewStyle>,
    //按钮文字样式
    btnTextStyle?: StyleProp<TextStyle>,
    //按钮文字
    btnText?: string
}

export class UpdateView extends Component<IUpdateViewProps,any>{
    static defaultProps: Partial<IUpdateViewProps>
}