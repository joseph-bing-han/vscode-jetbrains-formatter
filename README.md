# VSCode JetBrains Formatter

[English](#english) | [中文](#中文)

<a id="english"></a>
## English

This VSCode extension provides an interface to format code files using JetBrains IDE's command-line formatting tool.

### Features

- Format single files using JetBrains formatting tool
- Format entire directories (including recursive processing of subdirectories)
- Support for VS Code formatting shortcuts (Shift+Alt+F / right-click menu Format Document)
- Right-click on a directory in the file explorer to format the entire directory
- Format on save support
- Default support for PHP file formatting

### Requirements

- JetBrains IDE installed (such as PhpStorm, IntelliJ IDEA, etc.)
- Knowledge of the location of the format.sh script in JetBrains IDE

> **Note:** To learn more about the command-line formatter tool and how to find its full path, please visit the [JetBrains official documentation](https://www.jetbrains.com/help/idea/command-line-formatter.html). This documentation also explains how to export code style settings that can be used with this extension.

### Extension Settings

This extension provides the following settings:

* `jetbrainsFormatter.formatShPath`: **Full absolute path** to JetBrains format.sh script
* `jetbrainsFormatter.allowDefaults`: Use the default code style settings when the code style is not defined for a file or a group of files (default: true)
* `jetbrainsFormatter.recursive`: Process specified directories recursively (default: true)
* `jetbrainsFormatter.mask`: Comma-separated list of file masks that define the files to be processed (default: *)
* `jetbrainsFormatter.settings`: **Full absolute path** to the code style settings file (default: empty)
* `jetbrainsFormatter.charset`: Charset for reading and writing source files (default: utf-8)
* `jetbrainsFormatter.formatOnSave`: Automatically format files when saving (default: false)

### How to Use

1. After installing the extension, open VS Code settings and configure `jetbrainsFormatter.formatShPath` to point to the format.sh script in JetBrains IDE.
   - For Mac, typically at `/Applications/PhpStorm.app/Contents/bin/format.sh` (PhpStorm example)
   - For Linux, typically in the `bin` folder of the JetBrains IDE installation directory
   - For Windows, it might be `C:\Program Files\JetBrains\PhpStorm\bin\format.bat` (PhpStorm example)

2. Configure other options such as file masks to process, whether to process recursively, etc.

3. Usage:
   - After opening a file in the editor, use Shift+Alt+F or right-click menu "Format Document with JetBrains IDE"
   - Right-click on a directory in the file explorer, select "Format Directory with JetBrains IDE"
   - Enable "Format on Save" in settings to automatically format files when saving

### Notes

- Make sure to save file changes before formatting
- Formatting will directly modify files, so ensure important files are backed up
- Formatting large directories may take some time
- Ensure that JetBrains IDE is not running during formatting, as the command-line formatting tool doesn't work when IDE is running

---

<a id="中文"></a>
## 中文

这个VSCode扩展提供了一个接口，用于使用JetBrains IDE的命令行格式化工具来格式化代码文件。

### 功能

- 使用JetBrains的格式化工具格式化单个文件
- 格式化整个目录（包括递归处理子目录）
- 支持VS Code的格式化快捷键（Shift+Alt+F / 右键菜单格式化文档）
- 在文件资源管理器中右键单击目录可以格式化整个目录
- 保存时自动格式化支持
- 默认支持PHP文件格式化

### 要求

- 安装了JetBrains IDE（如PhpStorm, IntelliJ IDEA等）
- 知道JetBrains IDE中format.sh脚本的位置

> **注意：** 要了解更多关于命令行格式化工具及如何找到其完整路径，请访问[JetBrains官方文档](https://www.jetbrains.com/help/idea/command-line-formatter.html)。该文档还解释了如何导出可与此扩展一起使用的代码样式设置。

### 扩展设置

此扩展提供以下设置：

* `jetbrainsFormatter.formatShPath`: JetBrains format.sh脚本的**完整绝对路径**
* `jetbrainsFormatter.allowDefaults`: 当文件或文件组未定义代码样式时使用默认代码样式设置（默认: true）
* `jetbrainsFormatter.recursive`: 递归处理指定目录（默认: true）
* `jetbrainsFormatter.mask`: 定义要处理的文件的掩码列表，用逗号分隔（默认: *）
* `jetbrainsFormatter.settings`: 代码样式设置文件的**完整绝对路径**（默认为空）
* `jetbrainsFormatter.charset`: 读取和写入源文件的字符集（默认: utf-8）
* `jetbrainsFormatter.formatOnSave`: 保存时自动格式化文件（默认: false）

### 如何使用

1. 安装扩展后，打开VS Code设置并配置`jetbrainsFormatter.formatShPath`指向JetBrains IDE中的format.sh脚本。
   - 对于Mac，通常在`/Applications/PhpStorm.app/Contents/bin/format.sh`（PhpStorm示例）
   - 对于Linux，通常在JetBrains IDE安装目录的`bin`文件夹中
   - 对于Windows，可能是`C:\Program Files\JetBrains\PhpStorm\bin\format.bat`（PhpStorm示例）

2. 配置其他选项，如需要处理的文件掩码、是否递归处理等。

3. 使用方法：
   - 在编辑器中打开文件后，使用Shift+Alt+F或右键菜单中的"Format Document with JetBrains IDE"
   - 在文件资源管理器中右键单击目录，选择"Format Directory with JetBrains IDE"
   - 在设置中启用"Format on Save"以在保存时自动格式化文件

### 注意事项

- 格式化前请确保已保存文件变更
- 格式化过程中会直接修改文件，请确保重要文件有备份
- 格式化大型目录可能需要一些时间
- 确保JetBrains IDE没有正在运行，因为命令行格式化工具在IDE运行时不会工作 