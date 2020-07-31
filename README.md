# teaset-code-push

[![npm version](http://img.shields.io/npm/v/@yz1311/teaset-code-push.svg?style=flat-square)](https://npmjs.org/package/@yz1311/teaset-code-push "View this project on npm")
[![npm version](http://img.shields.io/npm/dm/@yz1311/teaset-code-push.svg?style=flat-square)](https://npmjs.org/package/@yz1311/teaset-code-push "View this project on npm")


## 原由

由于react-native-code-push虽然提供了[对话框](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/react-native#code-try-39)的方式，但是在两端的样式不一，并且无法定制化,所以产生了该库

## 功能

* 支持动态设置`每次热更新`是否显示对话框(需要修改热更新语句)
* 包大小、更新内容自定义、下载进度条显示
* 支持是否强制更新
* 完全自定义更新对话框
* 完全typescript支持

## 开始
- [安装](#安装)
- [基础用法](#基础用法)
- [进阶用法](#进阶用法)
- [属性](#属性)
- [截图](#截图)

## 安装

该库是配合[react-native-code-push](https://github.com/microsoft/react-native-code-push)使用的

```
$ npm i @yz1311/teaset-code-push@0.3.0-beta3 --save
```

另外,需要安装

[react-native-webview](https://github.com/react-native-community/react-native-webview): 用于展示更新对话框的内容

## 基础用法

> 1.在根组件中设置`checkFrequency` 为 `MANUAL`
```javascript
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL};

export default codePush(codePushOptions)(Root);
```

> 2.将组件包裹住app.js

```javascript
import CodePushHandler from '@yz1311/teaset-code-push';

// Decorator用法; 需要 ES7 支持
@CodePushHandler({isDebugMode: false})

或者

//包裹用法
export default CodePushHandler({isDebugMode: false})(App)
```

## 进阶用法 

### 显示更新对话框

上述的步骤做完后，虽然可以热更新，<font color='red'>但是默认是静默更新</font>，如果需要显示对话框，需要修改热更新的语句(<span style='color:red'>请注意不同操作系统的命令不一样</span>)
windows:(<span style='color:red'>参数名称和值名称`两侧`的`"`改为`\""`</span>),如下:

```shell
code-push release-react test-android android --t 1.0.1 --dev false -d Production --des {\""description\"":\""2019/08/22<br/><br/>1.修复bugs\"",\""isSilent\"":false}
```

linux、mac:(<span style='color:red'>整个--des的外侧需加单引号`'`</span>),如下:
```shell
code-push release-react test-android android --t 1.0.1 --dev false -d Production --des '{"description":"2019/08/22<br/><br/>1.修复bugs","isSilent":false}'
```

---

目前`description`中的内容在app上面是直接通过<WebView/>展示出来的，所以里面支持html代码,譬如换行直接`<br/>`即可

跟普通的命令不同的是，现在将`description`变为一个json字符串，改json中有3个参数

| 属性           |     默认值     |   类型   | 描述   | 
| :---------- | :-------------: | :------: | :---------------------------------------------------------------------------------------------------------- |
|description||string|热更新的描述，跟以前的--des后面的内容一致,该部分的值是放在WebView中展示的，所以可以直接为html代码|
|isSilent|true|boolean|是否静默更新，默认为true，如果--des后面的json字符串解析失败或者isSilent字段不设值或者为true，都将会静默更新，<span style='color:red'>只有设置isSilent:true才会显示更新对话框</span>|

### 更改默认对话框部分属性(譬如顶部的图片)
在app的入口处，修改defaultProps即可,支持的属性查看[index.d.ts]('./index.d.ts')

```
import {UpdateView} from '@yz1311/teaset-code-push';
...
UpdateView.defaultProps.btnText = '立马更新';
```
### 完全自定义对话框

重写CodePushHandler的updateView方法即可,该方法会传递props参数,支持的属性查看[index.d.ts]('./index.d.ts')
```
@CodePushHandler({isDebugMode: false,updateView:(props)=><MyCustomComponent />})
```

### 根据网络状态来控制是否下载包

譬如只有在wifi状态下才下载安装包

```
import {CodePushHandler} from '@yz1311/teaset-code-push';
import NetInfo from '@react-native-community/netinfo';

...

@CodePushHandler({
    isDebugMode: false,
    willDownload:(packageInfo)=>{
        let info = await NetInfo.getConnectionInfo();
        return info.type === 'wifi';
    }})
```

## 属性

### CodePushHandler options

| 属性           |     默认值     |   类型   | 描述   | 
| :---------- | :-------------: | :------: | :---------------------------------------------------------------------------------------------------------- |
|checkFrequency|ON_APP_RESUME|ennum|检查频率,默认为resume时更新|
|isDebugMode|false|boolean|是否为调试模式|
|willDownload|无|(packageInfo: myRemotePackage)=>boolean|将要下载事件，返回值，true代表继续更新，false终止更新，默认为true<br/>譬如可以根据网络状态来控制是否更新|
|newestAlertInfo|已是最新版本|string|当前是最新版本的提示信息|
|~~successAlertInfo~~|~~安装成功，点击[确定]后App将自动重启，重启后即更新成功！~~|~~string~~|~~下载安装成功后的提示信息~~|
|updateView|无|(props)=>Element|替换默认的更新对话框,必须实现IUpdateViewProps相关属性|
|successbtnText|立即重启APP|string|下载安装成功后，按钮的文字|
|successDelay|5|number|//下载成功后，延迟重启的时间(单位:s)|

successDelay分为三种情况

> 1.为null或者undefined，则不会自动重启,必须用户点击按钮才会重启

> 2.<=0,则安装完成后立即重启
 
> 3.>0，则在successbtnText的文字后面追加倒计时,倒计时中途用户可以点击重启，倒计时结束会自动重启


## 截图

![](https://tva1.sinaimg.cn/large/006tNbRwgy1gap08fpgzzj30bi0l2dhk.jpg)

![](https://tva1.sinaimg.cn/large/006tNbRwgy1g9smkc6uw4j30c00lxdit.jpg)