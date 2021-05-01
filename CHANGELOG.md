# [0.3.5]() (2021-05-01)
# [0.3.4]() (2021-05-01)
* 修复`btnTextStyle`属性
* 优化ts定义

# [0.3.3]() (2021-04-21)
* 修复`btnContainerStyle`属性

# [0.3.2]() (2020-09-22)
* 对更新错误的情况增加部分处理

# [0.3.1]() (2020-09-18)
~~* 对更新错误的情况增加部分处理~~

# [0.3.0]() (2020-08-18)
# Bracking Change
* 0.3.0版本相比0.2.x版本行为模式有重大变更，请参照下面beta版本的日志

## Bug Fixed

* `successbtnText`字段改为`successBtnText`
* 完善文档

# [0.3.0-beta3]() (2020-07-31)
# Bracking Change
* 屏蔽successAlertInfo属性，取消成功后的弹窗显示,改为直接在按钮上进行重启操作,解决[#5](https://github.com/yz1311/teaset-code-push/issues/5)
* 按钮重启操作根据successDeplay的值三种情况
  > 1.为null或者undefined，则不会自动重启,必须用户点击按钮才会重启
  
  > 2.<=0,则安装完成后立即重启
  
  > 3.>0，则在successBtnText的文字后面追加倒计时,倒计时中途用户可以点击重启，倒计时结束会自动重启
* 完善isDebugMode下的日志显示
* 开始下载后,添加`准备下载...`的文字提示，更加友好(因为准备下载需要一段时间)
  


# [0.3.0-beta1]() (2020-01-08)
# Bracking Change
* 移除onlyDownloadWhenWifi属性，移除`@react-native-community/netinfo`组件依赖

## Feature
* 添加`willDownload`事件，可以通过该事件控制是否开始下载包



# [0.2.2]() (2019-12-11)

## Bug Fixed

* 修复iOS更新完成后，界面卡死的bug([#4](https://github.com/yz1311/teaset-code-push/issues/4))
* 修复isDebugMode影响范围
* 对话框默认为圆角(borderRadius=6),modalBorderRadius属性可以设置