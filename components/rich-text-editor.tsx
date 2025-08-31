"use client"

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-96 border rounded-md bg-gray-50 animate-pulse" />
})

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<any>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (editorRef.current && content) {
      const currentContent = editorRef.current.getInstance().getMarkdown()
      if (content !== currentContent) {
        editorRef.current.getInstance().setMarkdown(content)
      }
    }
  }, [content])

  const handleChange = () => {
    if (editorRef.current) {
      const markdown = editorRef.current.getInstance().getMarkdown()
      onChange(markdown)
    }
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        ref={editorRef}
        initialValue={content || ''}
        previewStyle="vertical"
        height="400px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        onChange={handleChange}
        theme={theme === 'dark' ? 'dark' : 'light'}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock']
        ]}
      />
    </div>
  )
}