import type { Frontmatter } from './frontmatter_parser.ts';
export type { Frontmatter };
export interface FrontmatterResult {
    frontmatter: Frontmatter;
    body: string;
}
export default function frontmatter({ content }: {
    content: string;
}): FrontmatterResult;
//# sourceMappingURL=frontmatter.d.ts.map