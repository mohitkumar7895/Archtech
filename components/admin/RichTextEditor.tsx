"use client";

import React from "react";
import { Bold, Italic, Heading2, Heading3, List, Link as LinkIcon, Code } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write rich architectural content or HTML...",
  rows = 10,
}: RichTextEditorProps) {
  const insertSnippet = (before: string, after = "") => {
    onChange(`${value}${value.endsWith("\n") || !value ? "" : "\n"}${before}${after}`);
  };

  return (
    <div className="rounded-xl border border-slate-300 overflow-hidden bg-white dark:bg-slate-900 dark:border-slate-700">
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs">
        <button
          type="button"
          onClick={() => insertSnippet("<h2>Section Heading</h2>")}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-[#D6B36A]"
          title="Insert H2 Heading"
        >
          <Heading2 className="w-3.5 h-3.5" /> H2
        </button>
        <button
          type="button"
          onClick={() => insertSnippet("<h3>Subheading</h3>")}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-[#D6B36A]"
          title="Insert H3 Heading"
        >
          <Heading3 className="w-3.5 h-3.5" /> H3
        </button>
        <button
          type="button"
          onClick={() => insertSnippet("<strong>Bold Text</strong>")}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-[#D6B36A]"
          title="Insert Bold"
        >
          <Bold className="w-3.5 h-3.5" /> Bold
        </button>
        <button
          type="button"
          onClick={() => insertSnippet("<em>Italic Text</em>")}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-[#D6B36A]"
          title="Insert Italic"
        >
          <Italic className="w-3.5 h-3.5" /> Italic
        </button>
        <button
          type="button"
          onClick={() =>
            insertSnippet("<ul>\n  <li>Key architectural point 1</li>\n  <li>Key architectural point 2</li>\n</ul>")
          }
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-[#D6B36A]"
          title="Insert Bullet List"
        >
          <List className="w-3.5 h-3.5" /> List
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('<p>Paragraph text here...</p>')}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-[#D6B36A]"
          title="Insert Paragraph"
        >
          <Code className="w-3.5 h-3.5" /> Paragraph
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('<a href="/contact">Schedule a Consultation</a>')}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-[#D6B36A]"
          title="Insert Internal Link"
        >
          <LinkIcon className="w-3.5 h-3.5" /> Link
        </button>
      </div>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 text-sm font-mono bg-white dark:bg-slate-900 text-[#172033] dark:text-slate-100 focus:outline-none"
      />
    </div>
  );
}
