import * as React from "react";
import type { ChatItem } from "@/hooks/useChannel";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib";
import { MemoizedReactMarkdown } from "./reactMarkdown";
import CodeBlock from "./codeblock";

interface Props {
  data: ChatItem;
}

const Content: React.FC<Props> = ({ data }) => {
  return (
    <MemoizedReactMarkdown
      className="prose !max-w-[85ch] dark:prose-invert"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <CodeBlock
              key={Math.random()}
              language={match[1]}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <table className="border-collapse border border-black py-1 px-3 dark:border-white">
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th
              className={cn(
                "border border-black bg-gray-500 text-white py-1 px-3 break-words",
                "dark:bg-gray-700 dark:border-white/70"
              )}
            >
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-black py-1 px-3 break-words dark:border-white/70">
              {children}
            </td>
          );
        },
      }}
    >
      {data.content}
    </MemoizedReactMarkdown>
  );
};

export default Content;
