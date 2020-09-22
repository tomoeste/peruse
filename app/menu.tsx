import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
} from 'electron';
import { openLogFileDialog } from './features/logReader/logReader';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Peruse',
      submenu: [
        {
          label: 'About Peruse',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Hide Peruse',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuFile: DarwinMenuItemConstructorOptions = {
      label: '&File',
      submenu: [
        {
          label: '&Open file...',
          accelerator: 'Command+O',
          click: () => {
            openLogFileDialog(this.mainWindow);
          },
        },
        /*           {
            label: 'Open Recent',
            role: 'recentdocuments',
            submenu: [
              {
                label: 'Clear Recent',
                role: 'clearrecentdocuments',
              },
            ],
          }, */
        {
          type: 'separator',
        },
        {
          label: '&Exit',
          accelerator: 'Command+W',
          click: () => {
            this.mainWindow.close();
          },
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: '&Reload',
          accelerator: 'R',
          click: () => {
            this.mainWindow.webContents.executeJavaScript(`document
            .querySelector('body').dispatchEvent(
            new CustomEvent('reloadLogFile')
          );`);
          },
        },
        {
          label: '&Follow file',
          accelerator: 'F',
          click: () => {
            this.mainWindow.webContents.executeJavaScript(`document
            .querySelector('body').dispatchEvent(
            new CustomEvent('toggleFollowFile')
          );`);
          },
        },
        {
          type: 'separator',
        },
        {
          label: '&Reload window',
          accelerator: 'W',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: '&Reload',
          accelerator: 'R',
          click: () => {
            this.mainWindow.webContents.executeJavaScript(`document
            .querySelector('body').dispatchEvent(
            new CustomEvent('reloadLogFile')
          );`);
          },
        },
        {
          label: '&Follow file',
          accelerator: 'F',
          click: () => {
            this.mainWindow.webContents.executeJavaScript(`document
            .querySelector('body').dispatchEvent(
            new CustomEvent('toggleFollowFile')
          );`);
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: '&Help',
      submenu: [
        {
          label: '&Learn More',
          click() {
            shell.openExternal('https://github.com/tomoeste/peruse#readme');
          },
        },
        {
          label: '&Documentation',
          click() {
            shell.openExternal('https://tom-oeste.gitbook.io/peruse');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuFile, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open file...',
            accelerator: 'Ctrl+O',
            click: () => {
              openLogFileDialog(this.mainWindow);
            },
          },
          {
            label: 'Open Recent',
            role: 'recentdocuments',
            submenu: [
              {
                label: 'Clear Recent',
                role: 'clearrecentdocuments',
              },
            ],
          },
          {
            type: 'separator',
          },
          {
            label: '&Exit',
            accelerator: 'Ctrl+Q',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'R',
                  click: () => {
                    this.mainWindow.webContents.executeJavaScript(`document
                    .querySelector('body').dispatchEvent(
                    new CustomEvent('reloadLogFile')
                  );`);
                  },
                },
                {
                  label: '&Follow file',
                  accelerator: 'F',
                  click: () => {
                    this.mainWindow.webContents.executeJavaScript(`document
                    .querySelector('body').dispatchEvent(
                    new CustomEvent('toggleFollowFile')
                  );`);
                  },
                },
                {
                  type: 'separator',
                },
                {
                  label: '&Reload window',
                  accelerator: 'W',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: '&Reload',
                  accelerator: 'R',
                  click: () => {
                    this.mainWindow.webContents.executeJavaScript(`document
                  .querySelector('body').dispatchEvent(
                  new CustomEvent('reloadLogFile')
                );`);
                  },
                },
                {
                  label: '&Follow file',
                  accelerator: 'F',
                  click: () => {
                    this.mainWindow.webContents.executeJavaScript(`document
                  .querySelector('body').dispatchEvent(
                  new CustomEvent('toggleFollowFile')
                );`);
                  },
                },
              ],
      },
      {
        label: '&Help',
        submenu: [
          {
            label: '&Learn More',
            click() {
              shell.openExternal('https://github.com/tomoeste/peruse#readme');
            },
          },
          {
            label: '&Documentation',
            click() {
              shell.openExternal('https://tom-oeste.gitbook.io/peruse');
            },
          },
          {
            type: 'separator',
          },
          {
            label: '&About',
            click: () => {
              dialog.showMessageBox(this.mainWindow, {
                title: 'Peruse',
                type: 'info',
                message: 'Peruse',
                detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron.toString()}\nChrome: ${process.versions.chrome.toString()}\nNode.js: ${process.versions.node.toString()}`,
                buttons: [],
              });
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
