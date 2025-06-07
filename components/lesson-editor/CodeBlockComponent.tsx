"use client"

import { NodeViewContent, type NodeViewProps, NodeViewWrapper } from "@tiptap/react"

export default function CodeBlockComponent({ node, updateAttributes, extension }: NodeViewProps) {
  // Get the language with a fallback to empty string or 'auto'
  const language = node.attrs.language || "auto"

  // Safely access lowlight options
  const lowlight = extension?.options?.lowlight
  const availableLanguages = lowlight?.listLanguages?.() || []

  return (
    <NodeViewWrapper className="code-block relative">
      <select
        contentEditable={false}
        defaultValue={language}
        onChange={(event) => updateAttributes({ language: event.target.value })}
        className="absolute right-2 top-2 bg-white dark:bg-gray-800 border rounded-md px-2 py-1 text-sm z-10"
      >
        <option value="auto">auto</option>
        <option disabled>—</option>
        {availableLanguages.map((lang: string, index: number) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <pre className="!mt-0 relative">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}
