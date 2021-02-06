# 合成大北邮

使用`Vue.js 3`和`Matter.js`从零开始实现的合成大西瓜游戏，带有重力感应新玩法

## 玩法变动
 - 稳定碰撞才会触发合并，增加不确定性
 - 支持重力感应，可以甩手机体验刺激玩法
 - 合成到最后一种图之后不会立刻停止，而是允许用户继续刷分、冲榜
 - 普通大西瓜游戏共有11种图，本项目有12种，多出的一种作为“彩蛋”——当合成到第11种时，就会判定为游戏通关。此行为可以在`Play.vue`中修改
 - 带有一个排行榜页面，可自己附加后端实现排行榜

## 改图方式
 1. Clone本项目
 2. 修改`src/config.js`，替换导入的图片、每种图的大小和分数。图片数量可以任意增减。

## 注意事项
 - 由于使用`assetLoader`在webpack loader中加入了图片预加载功能，导入的图片将在`vue-router`的`beforeResolve` Hook中被预加载，图片的原始宽高也是从预加载数据获取。因此，若需修改为使用未经webpack打包的图片地址，请自行处理预加载问题，如在`beforeResolve`之前使用`assetLoader.push(url)`将图片加入预加载列表
