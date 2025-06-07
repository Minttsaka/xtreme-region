import DOMPurify from 'dompurify'
import { MarkdownRenderer } from './markdown-render'

interface SlideContentProps {
  content: string
  type: 'text' | 'html' | 'markdown'
}

export function SlideContent({ content, type }: SlideContentProps) {
  if (type === 'html') {
    const sanitizedContent = DOMPurify.sanitize(content, {
            ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'video',
        'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: ['onerror', 'onclick', 'onload', 'style','href', 'src', 'alt', 'title', 'class'],
      ADD_URI_SAFE_ATTR: ['href', 'src'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    })

    return (
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    )
  }

  if (type === 'markdown') {
    return <MarkdownRenderer content={content} className="prose prose-lg max-w-none" />
  }

  // Plain text
  return <p className="text-lg leading-relaxed">{content}</p>
}