'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Download, ExternalLink } from 'lucide-react';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
  config: TextPageConfig;
  content: string;
  embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
  return (
    <motion.div
      initial={embedded ? false : { opacity: 0, y: 10 }}
      animate={embedded ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={embedded ? '' : 'max-w-3xl mx-auto px-6 py-12'}
    >
      {!embedded && (
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            {config.title}
          </h1>

          {config.description && (
            <p className="text-zinc-600 dark:text-zinc-400">
              {config.description}
            </p>
          )}
        </div>
      )}

      {config.pdf && (
        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap gap-3">
            <a
              href={config.pdf}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              <Download className="h-4 w-4" />
              {config.download_label || 'Download CV'}
            </a>

            <a
              href={config.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <ExternalLink className="h-4 w-4" />
              {config.pdf_label || 'Open PDF'}
            </a>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <iframe
              src={config.pdf}
              title={config.pdf_label || 'CV PDF'}
              className="h-[80vh] w-full"
            />
          </div>
        </div>
      )}

      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-serif font-bold mt-8 mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-serif font-bold mt-8 mb-4">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="leading-7 text-zinc-700 dark:text-zinc-300 mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-zinc-700 dark:text-zinc-300">{children}</li>
            ),
            a: ({ ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              />
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-zinc-700 dark:text-zinc-300">{children}</em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}