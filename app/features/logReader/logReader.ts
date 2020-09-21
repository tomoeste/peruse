import { app, dialog, OpenDialogOptions, BrowserWindow } from 'electron';
import * as settings from 'electron-settings';

export interface Line {
  lineNumber: number;
  logLine: string;
}

export const openLogFileDialog = (window: BrowserWindow) => {
  const options: OpenDialogOptions = {
    title: 'Open a log file',
    buttonLabel: 'Open log',
    filters: [{ name: 'All Files', extensions: ['*'] }],
    properties: ['openFile'],
  };

  dialog
    .showOpenDialog(window, options)
    .then((result) => {
      const re = /\\/gi;
      const filePath = result.filePaths[0]?.replace(re, '\\');
      if (result.filePaths.length > 0) {
        app.addRecentDocument(filePath); // Verify this works
        settings.set('openFilePath', filePath);
        window.webContents.executeJavaScript(`document
              .querySelector('body').dispatchEvent(
              new CustomEvent('logFilePath', {
                detail: '${filePath}',
              })
            );`);
      }
      return filePath;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
};

export const readLog = (logPath: string) => {
  return logPath;
};
