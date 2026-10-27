import { useMemo } from 'react'
import { getAllTags, slugifyTag } from '../../lib/tags'
import type { Project } from '../../lib/project_data'

export type ProjectListProps = {
  projects?: Project[]
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('es-PE', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      })
    }
  } catch {
  }
  return dateStr
}

export function ProjectItem({ project }: { project: Project }) {
  return (
    <article className="group">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="overflow-hidden rounded-lg border border-border/60 bg-card/60 sm:w-56 shrink-0">
          <img
            src={project.image}
            alt={`Vista previa de ${project.title}`}
            loading="lazy"
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors text-balance">
              <a href={project.href} className="hover:text-primary">
                {project.title}
              </a>
            </h3>
            <time
              dateTime={project.date}
              className="text-xs sm:text-sm text-muted-foreground shrink-0 whitespace-nowrap pt-0.5"
            >
              {formatDisplayDate(project.date)}
            </time>
          </div>

          <p className="mt-2 mb-3 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
            {project.excerpt}
          </p>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${slugifyTag(tag)}`}
                  className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <span className="text-accent/70">#</span>
                  <span>{tag}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function ProjectList({ projects = [] }: ProjectListProps) {
  const allTags = useMemo(() => getAllTags(projects), [projects])

  return (
    <div className="max-w-3xl mx-auto">
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <a
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-accent/40 hover:text-accent hover:bg-card"
            >
              <span className="text-accent/70 font-mono">#</span>
              <span className="font-medium text-foreground/90 group-hover:text-accent">{tag.name}</span>
              <span className="text-muted-foreground/60 text-[11px] font-mono ml-0.5">{tag.count}</span>
            </a>
          ))}
        </div>
      )}

      <div className="border-b border-border/100" />

      {projects.length === 0 ? (
        <div className="text-center text-muted-foreground py-12" aria-live="polite" role="status">
          No hay proyectos disponibles.
        </div>
      ) : (
        <div className="mt-10 space-y-10 sm:space-y-12">
          {projects.map((project) => (
            <ProjectItem key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
