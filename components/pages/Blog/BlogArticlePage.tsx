'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import DocSection from '@/components/layout/PageShell/DocSection';
import PageShell from '@/components/layout/PageShell/PageShell';
import EnquiryButton from '@/components/ui/EnquiryButton/EnquiryButton';
import EnquiryPanel from '@/components/ui/EnquiryPanel/EnquiryPanel';
import { ARTICLE_SECTIONS, groupBlogBlocks, type BlogPost } from './blogContent';

interface BlogArticlePageProps {
  post: BlogPost;
  nextPost: BlogPost | null;
}

export default function BlogArticlePage({ post, nextPost }: BlogArticlePageProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const bodyGroups = groupBlogBlocks(post.body);

  return (
    <>
      <PageShell
        eyebrow={`Field journal / ${post.category}`}
        title={[post.title]}
        lead={post.excerpt}
        sections={ARTICLE_SECTIONS}
        titleScale="article"
      >
        <DocSection meta={{ ...ARTICLE_SECTIONS[0], number: post.index }} wide>
          <div className="blog-article-meta">
            <span>{post.category}</span>
            <time dateTime={post.publishedOn}>{post.publishedOn.replaceAll('-', ' / ')}</time>
          </div>

          <div className="doc-prose blog-article-body">
            {bodyGroups.map((group, index) => {
              const style = { '--reveal-index': Math.min(index, 5) } as CSSProperties;

              if (group.kind === 'list') {
                return (
                  <ul key={`${post.slug}-list-${index}`} className="blog-article-list" style={style}>
                    {group.items.map((item, itemIndex) => (
                      <li key={`${post.slug}-${index}-${itemIndex}`}>{item}</li>
                    ))}
                  </ul>
                );
              }

              const { block } = group;
              if (block.kind === 'HEADING_2') {
                return <h2 key={`${post.slug}-${index}`} className="font-display blog-article-heading" style={style}>{block.body}</h2>;
              }
              if (block.kind === 'HEADING_3') {
                return <h3 key={`${post.slug}-${index}`} className="font-display blog-article-subheading" style={style}>{block.body}</h3>;
              }

              return (
                <p key={`${post.slug}-${index}`} className="doc-paragraph" style={style}>
                  {block.body}
                </p>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className="doc-close" data-reveal>
            <h2 className="font-display doc-close-title">Ready to build something with us?</h2>
            <p className="doc-close-lead">
              Whether you need custom software, engineering architecture, or high-performance systems, let&apos;s talk.
            </p>
            <div className="doc-close-actions">
              <EnquiryButton label="Start your project" onClick={() => setIsEnquiryOpen(true)} tone="hot" />
            </div>
          </div>

          <nav className="blog-article-navigation" aria-label="Article navigation">
            <Link href="/blog" className="doc-close-link">{'\u2190'} Return to the archive</Link>
            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`} className="blog-article-next">
                <span>Next signal</span>
                <span className="font-display">{nextPost.title}</span>
              </Link>
            )}
          </nav>
        </DocSection>
      </PageShell>

      <EnquiryPanel
        open={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        eyebrow="Start a project — Voidix"
        title={post.title}
        prefill={{
          subject: post.title,
          brief: `Hello Voidix, I read "${post.title}" and would like to discuss a project: `,
        }}
      />
    </>
  );
}
