const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 680,

    //minWidth:490,
    minWidth:700,
    minHeight:775,

    webPreferences: {
      nodeIntegration: true,
      //devTools: false,
    }
  })

  //win.removeMenu()
  win.loadFile("index.html")
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})