import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'  //国家化
import App from './App.vue'
import * as echarts from 'echarts'
import Initsqlite3db from './data/Initsqlite3db'  //判断数据库文件是否存在，没有则创建数据库并创建表
import log from 'electron-log'  //引入记录日志的模块

Initsqlite3db.InitDb()  //初始化数据库文件


const app = createApp(App)
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$log = log

//ElementUI组件国际化配置为中文
app.use(ElementPlus, {
    locale: zhCn,
})

app.mount('#app')

