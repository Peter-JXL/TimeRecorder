# TimeRecorder

本软件用于给用户手工记录时间，并提供统计和查询等功能，目前已满足基本使用。







## 参与开发

Project setup：npm install

Compiles and hot-reloads for development：  npm run serve

Compiles and minifies for production：npm run build

Lints and fixes files：npm run lint

Customize configuration：See [Configuration Reference](https://cli.vuejs.org/config/).



## 代码基本结构

从界面上，基本上是一个Tabs组件，其中分了4个标签，每个标签一个.vue文件



```
src
├── App.vue					首页，引入了TRTabs.vue
├── assets
│   └── logo.png        
├── background.js       	Electron的配置类
├── components
│   ├── TRRecord.vue  		第1个标签页
│   ├── TRDayAnalyze.vue  	第2个标签页
│   ├── TRLabels.vue  		第3个标签页
│   ├── TRDaysAnalyze.vue  	第4个标签页
│   ├── TRMenu.vue			菜单组件，开发中
│   └── TRTabs.vue     		总体标签页
├── data
│   ├── DbUtils.js      	操作数据库的工具类
│   ├── Initsqlite3db.js  	初始化数据库的工具类
│   ├── testDbUtils.js   	测试方法
│   └── testMomentJS.js  	测试方法
├── main.js					脚手架的配置类
└── utils
    ├── bus.js   			总线，用于消息通信
    └── update.js  			自动更新，开发中
```

