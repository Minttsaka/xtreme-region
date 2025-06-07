import { Editor } from '@tiptap/react'
import { CheckSquare, Code, Video } from 'lucide-react'
import React from 'react'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered,Image, Table, Plus, Minus, Trash,ArrowUp, ArrowDown, Columns, AlignCenterVerticalIcon as ColumnVerticalAlign, RectangleHorizontalIcon as RowHorizontal, Merge, Split, Paintbrush } from 'lucide-react'
interface MenuBarProps {
  editor: Editor
  addImage: () => void
  addIframe: () => void
}

const MenuButton: React.FC<{ 
    onClick: () => void, 
    disabled?: boolean, 
    isActive?: boolean,
    icon: React.ReactNode,
    tooltip: string
  }> = ({ onClick, disabled = false, isActive = false, icon, tooltip }) => (
    <button
      onClick={() => onClick()}
      disabled={disabled}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={tooltip}
    >
      {icon}
    </button>
  )

export default function MenuBar({ editor, addImage, addIframe }: MenuBarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<Bold className="w-4 h-4" />}
        tooltip="Bold"
      />
      <MenuButton
        onClick={addImage}
        icon={<Image className="w-4 h-4" />}
        tooltip="Insert image"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<Italic className="w-4 h-4" />}
        tooltip="Italic"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        icon={<Heading1 className="w-4 h-4" />}
        tooltip="Heading 1"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<Heading2 className="w-4 h-4" />}
        tooltip="Heading 2"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<List className="w-4 h-4" />}
        tooltip="Bullet List"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<ListOrdered className="w-4 h-4" />}
        tooltip="Ordered List"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        icon={<Code className="w-4 h-4" />}
        tooltip="Code Block"
      />
      <MenuButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        icon={<Table className="w-4 h-4" />}
        tooltip="Insert table"
      />
      <MenuButton
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}
        icon={<Plus className="w-4 h-4" />}
        tooltip="Add column before"
      />
      <MenuButton
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
        icon={<Plus className="w-4 h-4" />}
        tooltip="Add column after"
      />
      <MenuButton
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
        icon={<Minus className="w-4 h-4" />}
        tooltip="Delete column"
      />
      <MenuButton
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!editor.can().addRowBefore()}
        icon={<ArrowUp className="w-4 h-4" />}
        tooltip="Add row before"
      />
      <MenuButton
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
        icon={<ArrowDown className="w-4 h-4" />}
        tooltip="Add row after"
      />
      <MenuButton
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
        icon={<Trash className="w-4 h-4" />}
        tooltip="Delete row"
      />
      <MenuButton
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
        icon={<Trash className="w-4 h-4" />}
        tooltip="Delete table"
      />
      <MenuButton
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor.can().mergeCells()}
        icon={<Merge className="w-4 h-4" />}
        tooltip="Merge cells"
      />
      <MenuButton
        onClick={() => editor.chain().focus().splitCell().run()}
        disabled={!editor.can().splitCell()}
        icon={<Split className="w-4 h-4" />}
        tooltip="Split cell"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
        disabled={!editor.can().toggleHeaderColumn()}
        icon={<ColumnVerticalAlign className="w-4 h-4" />}
        tooltip="Toggle header column"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        disabled={!editor.can().toggleHeaderRow()}
        icon={<RowHorizontal className="w-4 h-4" />}
        tooltip="Toggle header row"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        disabled={!editor.can().toggleHeaderCell()}
        icon={<Columns className="w-4 h-4" />}
        tooltip="Toggle header cell"
      />
      <MenuButton
        onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()}
        disabled={!editor.can().setCellAttribute('backgroundColor', '#FAF594')}
        icon={<Paintbrush className="w-4 h-4" />}
        tooltip="Set cell background color"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        icon={<CheckSquare className="w-4 h-4" />}
        tooltip="Task List"
      />
      <MenuButton
        onClick={addIframe}
        icon={<Video className="w-4 h-4" />}
        tooltip="Add Iframe"
      />
    </div>
  )
}

