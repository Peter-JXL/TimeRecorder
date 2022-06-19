const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      chainWebpackMainProcess: (config) => {
        config.output.filename('background.js');
      },
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.peterjxl.TimeRecorder',
        productName: 'TimeRecorder',
        copyright: 'Copyright © 2022',
        win: {
          icon: './TimeRecorder.ico',
          target: "portable"
        },
        extraResources: {
          from: './TimeRecorder.db',
          to: './'
        }
      }
    },
  }
})
