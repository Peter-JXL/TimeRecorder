'use strict'

import { app, protocol, BrowserWindow,  Menu, globalShortcut  } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import autoUpdater from './utils/update'



const path = require('path')
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer' 取消导入
const isDevelopment = process.env.NODE_ENV !== 'production'

let win  //接受主窗口变量

//菜单相关  因为想要绑定快捷键F12打开控制台，需要用到win变量
var template = [
  {
      label:'文件',
      submenu:[
          {label:'打开程序目录'},
          {label:'关闭'}
      ]
  },
  {
      label:'主题',
      submenu:[
          {label:'明亮主题'},
          {label:'暗色主题'}
      ]
  },
  {
    label:'帮助',
    submenu:[
        {
          label:'打开/关闭控制台',
          accelerator:`F12`,
          click:()=>{
            win.webContents.toggleDevTools()
          }
        },
        {label:'鸣谢'},
        {label:'更新日志'},
        {label:'隐私条款'},
        {label:'网站'},
        {label:'反馈'},
        {label:'检查更新'},
        {label:'关于'},
    ]
  }
]
var m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)



// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
    win = new BrowserWindow({
    title:'TimeRecorder, 记录你的时间',
    width: 1200,
    height: 700,
    center: true,
    resizable: false,
    icon: path.join(__dirname, '../public/TimeRecorder.ico'),
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true, //process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false //!process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  globalShortcut.unregisterAll()  //程序退出时取消注册所有快捷键
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  /* if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }*/
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates()
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
