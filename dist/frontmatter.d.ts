export interface FrontmatterResult {
  frontmatter: Record<string, string | string[]>
  body: string
}

export default function frontmatter(options: { content: string }): FrontmatterResult
