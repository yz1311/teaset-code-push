
# [0.3.0]() (2020-01-08)
# Bracking Change
* 移除onlyDownloadWhenWifi属性，移除`@react-native-community/netinfo`组件依赖

## Feature
* 添加`willDownload`事件，可以通过该事件控制是否开始下载包



# [0.2.2]() (2019-12-11)

## Bug Fixed

* 修复iOS更新完成后，界面卡死的bug([#4](https://github.com/yz1311/teaset-code-push/issues/4))
* 修复isDebugMode影响范围
* 对话框默认为圆角(borderRadius=6),modalBorderRadius属性可以设置