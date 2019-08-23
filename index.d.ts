declare module '@yz1311/teaset-code-push' {
    import {
        Component,
        Image,
        ImageSourcePropType,
        StyleProp,
        ViewStyle,
        TextStyle
    } from 'react-native';
        /**
     * Indicates when you would like to check for (and install) updates from the CodePush server.
     */
    enum CheckFrequency {
        /**
         * When the app is fully initialized (or more specifically, when the root component is mounted).
         */
        ON_APP_START,
    
        /**
         * When the app re-enters the foreground.
         */
        ON_APP_RESUME,
    }

    export interface CodePushhandlerOptions {
        //仅在wifi环境下自动更新，默认false，静默更新不判断网络
        onlyDownloadWhenWifi?: boolean,
        //检查频率,默认为resume时更新
        checkFrequency?: CheckFrequency,
        //是否为调试模式
        isDebugMode?: boolean,
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
        style?: any;
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
}