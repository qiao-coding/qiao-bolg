import { Input } from "@/components/ui/shadcnComponents/forms/input";
import React from "react";
import { Save, Minimize, Maximize, Download, Upload } from "lucide-react";
import { EditorMode } from "../type";
import ToolbarButton from "./ToolbarButton";

interface ToolbarAction {
  icon: React.ReactNode;
  title: string;
  action: () => void;
}

interface ModeButton {
  id: EditorMode;
  icon: React.ReactNode;
  label: string;
  title: string;
}

interface ShowToolbarProps {
  onSave: () => void;
  onFileDownload: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toolbarActions: ToolbarAction[];
  modeButtons: ModeButton[];
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  theme: "light" | "dark";
}

export function ShowToolbar({
  onSave,
  onFileDownload,
  onFileUpload,
  toolbarActions,
  modeButtons,
  editorMode,
  setEditorMode,
  isFullscreen,
  toggleFullscreen,
  theme,
}: ShowToolbarProps) {

  return (
    <div className={`flex flex-wrap items-center gap-1 p-3 border-b 
      ${theme === 'dark'
      ? 'border-gray-700 '
      : 'border-gray-200 '
      }
      `}>
      {/* 文件操作 */}
      <div className="flex items-center gap-1 mr-2 pr-2 border-r border-gray-300 dark:border-gray-600">
        <ToolbarButton
          icon={<Save size={16} />}
          title="保存"
          onClick={onSave}
          theme={theme}
        />
        <button
          onClick={() => document.getElementById('file-upload')?.click()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="导入文件"
          aria-label="导入文件"
        >
          <Upload size={16} />
        </button>

        <ToolbarButton
          icon={<Download size={16} />}
          title="导出文件 (Markdown格式)"
          onClick={onFileDownload}
          theme={theme}
        />
        <Input
          id="file-upload"
          type="file"
          accept=".md,.markdown,.txt,
          .js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.go,
          .rb,.php,.swift,.kt,.rs,.scala,.html,.css,.json,
          .xml,.yaml,.yml"
          className="hidden"
          onChange={onFileUpload}
        />
      </div>

      {/* 编辑工具 */}
      <div className="flex flex-wrap items-center gap-1">
        {toolbarActions.map((item, index) => (
          <React.Fragment key={item.title}>
            {index > 0 && index % 3 === 0 && (
              <div
                className={`w-px h-5 mx-1 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
              />
            )}
            <ToolbarButton
              icon={item.icon}
              title={item.title}
              onClick={item.action}
              theme={theme}
            />
          </React.Fragment>
        ))}
      </div>

      {/* 右侧工具 */}
      <div className="flex items-center gap-1 ml-auto">

        {/* 模式切换 */}
        <div className={`flex items-center rounded overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
          {modeButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setEditorMode(button.id)}
              className={`flex items-center gap-1 px-3 py-2 transition-colors ${editorMode === button.id
                ? theme === 'dark'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 text-gray-800'
                : theme === 'dark'
                  ? 'hover:bg-gray-600'
                  : 'hover:bg-gray-200'
                }`}
              title={button.title}
              aria-label={button.title}
            >
              {button.icon}
              <span className="text-sm hidden sm:inline">{button.label}</span>
            </button>
          ))}
        </div>

        {/* 全屏按钮 */}
        <ToolbarButton
          icon={isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          title={isFullscreen ? '退出全屏' : '全屏'}
          onClick={toggleFullscreen}
          theme={theme}
        />
      </div>
    </div>
  )
}