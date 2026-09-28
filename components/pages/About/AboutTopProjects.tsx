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
 * Features an orbital telemetry header (tabular ordinal + interactive link badge),
 * display typography, and responsive cards in an animated showcase grid.
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
              {/* Celestial orbital background geometry */}
              <div className="doc-top-project-orbit" aria-hidden="true">
                <div className="doc-top-project-orbit-glow" />
                <div className="doc-top-project-orbit-ring" />
                <div className="doc-top-project-orbit-ring doc-top-project-orbit-ring--inner" />
                <div className="doc-top-project-orbit-beacon" />
              </div>

              {/* HUD corner precision brackets */}
              <span className="doc-top-project-corner doc-top-project-corner--tl" aria-hidden="true" />
              <span className="doc-top-project-corner doc-top-project-corner--br" aria-hidden="true" />

              {/* Top Telemetry bar */}
              <div className="doc-top-project-bar">
                <div className="doc-top-project-meta">
                  <span className="font-display doc-top-project-index" aria-hidden="true">
                    {project.index}
                  </span>
                  <span
                    className={`doc-top-project-status ${
                      hasUrl ? 'doc-top-project-status--live' : 'doc-top-project-status--nda'
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`doc-top-project-pulse ${
                        hasUrl ? 'doc-top-project-pulse--live' : 'doc-top-project-pulse--nda'
                      }`}
                    />
                    <span className="doc-top-project-status-label">
                      {hasUrl ? 'Live' : 'Proprietary'}
                    </span>
                  </span>
                </div>

                {hasUrl ? (
                  <a
                    href={project.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="works-detail-link doc-link doc-top-project-link"
                    data-journey={`About: open ${project.name} link`}
                    aria-label={`Open ${project.name} at ${displayHostname(project.url!)}`}
                  >
                    <span className="works-detail-link-host">
                      {displayHostname(project.url!)}
                    </span>
                    <svg
                      className="works-detail-link-glyph"
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 7.5L7.5 2.5M3.8 2.5h3.7v3.7"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <span className="doc-top-project-badge-quiet" aria-hidden="true">
                    Internal system · NDA
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="doc-top-project-content">
                <h3 className="font-display doc-top-project-name">{project.name}</h3>
                <p className="doc-top-project-desc">{project.description}</p>
              </div>

              {/* Bottom HUD Telemetry Line */}
              <div className="doc-top-project-footer" aria-hidden="true">
                <span className="doc-top-project-system-id">STATION // 0{index + 1}</span>
                <div className="doc-top-project-wire" />
              </div>
            </li>
          );
        })}
      </ol>
    </DocSection>
  );
}
