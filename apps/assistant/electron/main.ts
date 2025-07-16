// electron/main.ts
import { app, BrowserWindow } from 'electron'
import path from 'node:path'

const createWindow = () => {
  const win = new BrowserWindow({
    resizable: false,
    width: 1600,
    height: 1200,
    title: 'AI Assistant'
  })

  const VITE_DEV_SERVER = process.env.VITE_DEV_SERVER_URL

  if (VITE_DEV_SERVER) {
    win.loadURL(VITE_DEV_SERVER)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
