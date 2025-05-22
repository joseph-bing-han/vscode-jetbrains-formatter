import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

/**
 * 插件激活时的入口函数
 */
export function activate(context: vscode.ExtensionContext) {
    const formatDocumentCommand = vscode.commands.registerCommand('jetbrainsFormatter.formatDocument', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        const document = editor.document;
        await formatFile(document.uri.fsPath);
    });

    const formatDirectoryCommand = vscode.commands.registerCommand('jetbrainsFormatter.formatDirectory', async (uri: vscode.Uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('No directory selected');
            return;
        }
        await formatDirectory(uri.fsPath);
    });

    const documentFormattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
        { scheme: 'file' },
        {
            provideDocumentFormattingEdits: async (document) => {
                await formatFile(document.uri.fsPath);
                try {
                    const config = vscode.workspace.getConfiguration('jetbrainsFormatter');
                    const charset = config.get<string>('charset', 'utf-8');
                    const content = fs.readFileSync(document.uri.fsPath, { encoding: charset as BufferEncoding });

                    const fullRange = new vscode.Range(
                        document.lineAt(0).range.start,
                        document.lineAt(document.lineCount - 1).range.end
                    );
                    return [vscode.TextEdit.replace(fullRange, content)];
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to refresh file: ${error}`);
                    return [];
                }
            }
        }
    );

    const formatOnSaveWatcher = vscode.workspace.onWillSaveTextDocument(async (event) => {
        const config = vscode.workspace.getConfiguration('jetbrainsFormatter');
        const formatOnSave = config.get<boolean>('formatOnSave', false);
        if (formatOnSave) {
            try {
                await formatFile(event.document.uri.fsPath);
            } catch (error) {
                console.error('Error formatting on save:', error);
            }
        }
    });

    context.subscriptions.push(
        formatDocumentCommand,
        formatDirectoryCommand,
        documentFormattingProvider,
        formatOnSaveWatcher
    );
}

function sanitizePath(inputPath: string): string {
    if (!inputPath) return '';
    let cleanPath = inputPath.trim();
    cleanPath = getPlatformSpecificPath(cleanPath);
    return cleanPath;
}

async function fileExists(filePath: string): Promise<boolean> {
    try {
        const normalizedPath = path.normalize(filePath);
        await fs.promises.access(normalizedPath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function formatFile(filePath: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('jetbrainsFormatter');
    let formatShPath = config.get<string>('formatShPath', '');
    formatShPath = sanitizePath(formatShPath);

    if (!formatShPath) {
        vscode.window.showErrorMessage('JetBrains formatter path not set. Please configure "jetbrainsFormatter.formatShPath" in settings');
        return;
    }
    if (!await fileExists(formatShPath)) {
        vscode.window.showErrorMessage(`Formatter path does not exist: ${formatShPath}`);
        return;
    }

    const args = buildCommandArgs(config, [filePath]);
    try {
        await executeFormatCommand(formatShPath, args);
        // vscode.window.showInformationMessage(`File formatted: ${path.basename(filePath)}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Formatting failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function formatDirectory(dirPath: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('jetbrainsFormatter');
    let formatShPath = config.get<string>('formatShPath', '');
    formatShPath = sanitizePath(formatShPath);

    if (!formatShPath) {
        vscode.window.showErrorMessage('JetBrains formatter path not set. Please configure "jetbrainsFormatter.formatShPath" in settings');
        return;
    }
    if (!await fileExists(formatShPath)) {
        vscode.window.showErrorMessage(`Formatter path does not exist: ${formatShPath}`);
        return;
    }

    const args = buildCommandArgs(config, [dirPath]);
    try {
        await executeFormatCommand(formatShPath, args);
        vscode.window.showInformationMessage(`Directory formatted: ${path.basename(dirPath)}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Formatting failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function getPlatformSpecificPath(basePath: string): string {
    if (!basePath) return '';
    const platform = os.platform();
    if (path.extname(basePath) !== '') {
        return basePath;
    }
    return platform === 'win32' ? `${basePath}.bat` : `${basePath}.sh`;
}

function buildCommandArgs(config: vscode.WorkspaceConfiguration, paths: string[]): string[] {
    const args: string[] = [];
    if (config.get<boolean>('allowDefaults', true)) {
        args.push('-allowDefaults');
    }
    if (config.get<boolean>('recursive', true)) {
        args.push('-r');
    }
    const mask = config.get<string>('mask', '*');
    if (mask) {
        args.push('-m', mask);
    }
    const settings = sanitizePath(config.get<string>('settings', ''));
    if (settings) {
        args.push('-s', settings);
    }
    const charset = config.get<string>('charset', 'utf-8');
    if (charset) {
        args.push('-charset', charset);
    }
    args.push(...paths);
    return args;
}

/**
 * 执行格式化命令（统一使用 spawn 处理）
 */
function executeFormatCommand(formatShPath: string, args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            fs.chmodSync(formatShPath, '755');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to set formatter permissions: ${error instanceof Error ? error.message : String(error)}`);
        }

        const options: cp.SpawnOptions = {
            shell: false,
            stdio: 'pipe'
        };

        console.info(`Executing command: ${formatShPath} ${args.join(' ')}`);
        const childProcess = cp.spawn(formatShPath, args, options);

        let stdoutData = '';
        let stderrData = '';

        if (childProcess.stdout) {
            childProcess.stdout.on('data', (data: Buffer) => {
                stdoutData += data.toString();
                console.info(`stdout: ${data}`);
            });
        }

        if (childProcess.stderr) {
            childProcess.stderr.on('data', (data: Buffer) => {
                stderrData += data.toString();
                console.info(`stderr: ${data}`);
            });
        }

        childProcess.on('close', (code: number | null) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`Command exited with code ${code}. ${stderrData}`);
            }
        });

        childProcess.on('error', (error: Error) => {
            vscode.window.showErrorMessage(`Execution error: ${error.message}`);
            reject(`Command execution failed: ${error.message}`);
        });
    });
}

export function deactivate() { }