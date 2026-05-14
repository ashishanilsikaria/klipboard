'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  language: string
  code: string
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const [highlighted, setHighlighted] = useState('')

  useEffect(() => {
    let cancelled = false
    import('highlight.js/lib/core').then(async (hljs) => {
      try {
        const lang = await import(`highlight.js/lib/languages/${language}`)
        hljs.default.registerLanguage(language, lang.default)
      } catch {
        // fallback
      }
      if (!cancelled) {
        try {
          const result = hljs.default.highlight(code, { language, ignoreIllegals: true })
          setHighlighted(result.value)
        } catch {
          setHighlighted(code)
        }
      }
    })
    return () => { cancelled = true }
  }, [code, language])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [code])

  return (
    <div className="relative group rounded-xl overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600/80 border border-slate-600/50 opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Copy code"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
      </button>
      <pre className="bg-slate-900/80 border border-slate-700/30 rounded-xl p-4 overflow-x-auto text-sm">
        <code
          ref={codeRef}
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={highlighted ? { __html: highlighted } : undefined}
        >
          {!highlighted ? code : undefined}
        </code>
      </pre>
    </div>
  )
}
