"use client"

import { Color } from '@tiptap/extension-color'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text-style'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight } from 'lowlight'
import React, { useState } from 'react'
import MenuBar from './MenuBar'
import CodeBlockComponent from './CodeBlockComponent'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import IframeExtension from './IframeExtension'
import { MediaUploadModal } from './MediaUploadModal'
import { AIChatToggle } from './AIChatToggle'

// Create a lowlight instance
const lowlight = createLowlight()

// Register languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

// const CustomDocument = Document.extend({
//   content: 'heading block*',
// })

const CustomTaskItem = TaskItem.extend({
  content: 'inline*',
})


const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-background-color'),
        renderHTML: attributes => {
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
    }
  },
})


interface RichTextEditorProps {
  content: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  title : string
}

export default function RichTextEditor({
  content,
  onChange,
  title
}: RichTextEditorProps) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Image,
      Dropcursor,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false,
      }),
      CodeBlockLowlight
        .extend({
          addNodeView() {
            return ReactNodeViewRenderer(CodeBlockComponent)
          },
        })
        .configure({ lowlight }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      TaskList,
      CustomTaskItem.configure({
        nested: true,
      }),
      IframeExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const handleMediaSelect = (url: string, type: 'image' | 'video') => {
    if (!editor) return

    if (type === 'image') {
      editor.chain().focus().setImage({ src: url }).run()
    } else {
      editor.chain().focus().setIframe({ src: url }).run()
    }
  }


  const openMediaModal = (type: 'image' | 'video') => {
    setMediaType(type)
    setIsMediaModalOpen(true)
  }


  if (!editor) {
    return null
  }

  return (
    <div className="rounded-lg  bg-gray-50 dark:bg-gray-900">
      <MenuBar editor={editor} addImage={() => openMediaModal('image')} 
        addIframe={() => openMediaModal('video')} />
      <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />
      <MediaUploadModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onMediaSelect={handleMediaSelect}
        type={mediaType}
      />
      <AIChatToggle editor={editor} title={title} content={content} />
    </div>
  )
}

