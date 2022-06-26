import { Vue,createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'  //国家化
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import Initsqlite3db from './data/Initsqlite3db'

const app = createApp(App)

//注册ElementUI图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


//ElementUI组件国际化配置为中文
app.use(ElementPlus, {
    locale: zhCn,
})

app.mount('#app')
