import type { CSSProperties } from 'react';
import DocSection from '@/components/layout/PageShell/DocSection';
import type { DocSectionMeta } from '@/components/layout/PageShell/docSections';
import { displayHostname } from '@/lib/displayHostname';
import { isSafeExternalUrl } from '@/lib/isSafeExternalUrl';
import type { PublishedTopProject } from '@/lib/cms/publishedContent';
import { TOP_PROJECTS_SECTION_META } from './aboutContent';

interface AboutTopProjectsProps {
  projects: readonly PublishedTopProject[];
  meta?: DocSectionMeta;
}

/**
 * Section 06 — Top performing projects.
 *
 * Curated list of featured studio projects managed via the CMS.
 * An empty list is a designed state: the section is dropped completely from the DOM and orbit rail.
 */
export default function AboutTopProjects({
  projects,
  meta = TOP_PROJECTS_SECTION_META,
}: AboutTopProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <DocSection meta={meta} wide>
      <ol className="doc-top-projects">
        {projects.map((project, index) => {
          const hasUrl =
            typeof project.url === 'string' &&
            project.url.trim().length > 0 &&
            isSafeExternalUrl(project.url);

          return (
            <li
              key={project.index || project.name}
              className="doc-top-project"
              style={{ '--reveal-index': index } as CSSProperties}
            >
              <span className="font-display doc-top-project-index" aria-hidden="true">
                {project.index}
              </span>
              <div className="doc-top-project-content">
                <div className="doc-top-project-header">
                  <h3 className="font-display doc-top-project-name">{project.name}</h3>
                  {hasUrl && (
                    <a
                      href={project.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="works-detail-link doc-link doc-top-project-link"
                      data-journey={`About: open ${project.name} link`}
                    >
                      <span className="works-detail-link-host">
                        {displayHostname(project.url!)}
                      </span>
                      <svg
                        className="works-detail-link-glyph"
                        width="9"
                        height="9"
                        viewBox="0 0 9 9"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.2 6.8L6.8 2.2M3.4 2.2h3.4v3.4"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  )}
                </div>
                <p className="doc-top-project-desc">{project.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </DocSection>
  );
}
