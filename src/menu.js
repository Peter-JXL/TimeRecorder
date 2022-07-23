const { Menu } = require('electron')

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
            label:'打开控制台',
            accelerator:`F12`,
            click:()=>{
              this.win.webContents.openDevTools()
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
