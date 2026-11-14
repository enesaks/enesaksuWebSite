import React, { useState, useEffect } from 'react';
import { PROJECTS as FALLBACK_PROJECTS } from '../../data/constants';

interface Project {
  title: string;
  desc: string;
  tags: string[];
  url: string;
  status: string;
  stars?: number;
  updated?: string;
}

const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/enesaks/repos?sort=updated&direction=desc&per_page=100');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const parsedProjects: Project[] = data.map((repo: any) => ({
            title: repo.name,
            desc: repo.description || 'Açıklama bulunmuyor.',
            tags: repo.topics && repo.topics.length > 0 ? repo.topics.map((t: string) => t.toUpperCase()) : [repo.language?.toUpperCase() || 'CODE'],
            url: repo.html_url,
            status: repo.archived ? 'archived' : 'live',
            stars: repo.stargazers_count || 0,
            updated: repo.pushed_at
              ? new Date(repo.pushed_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })
              : undefined
          }));
          setProjects(parsedProjects);
        } else {
          throw new Error('Invalid Data');
        }
      } catch (err) {
        console.error("GitHub API Hatası:", err);
        setError(true);
        setProjects(FALLBACK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">gh repo list enesaks --sort updated</span></div>
      
      {loading && <div className="status-line">[ Fetching from GitHub API... ]</div>}

      {error && <div className="status-line err">[ WARN ] API failed. Using fallback data.</div>}

      <div className="card-grid">
        {!loading && projects.map((p, i) => (
          <div key={i} className="project-card">
            <div className="proj-head">
              <div className="proj-title"><a href={p.url} target="_blank" rel="noreferrer">{p.title}</a></div>
              <span className="proj-status" style={{ color:p.status==='live'?'var(--green)':'var(--amber)' }}>
                {p.status==='live'?'● PUBLIC':(p.status==='archived' ? 'ARCHIVED' : '◉ WIP')}
              </span>
            </div>
            <div className="proj-desc">{p.desc}</div>
            <div className="proj-tags">{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            {(p.stars || p.updated) && (
              <div className="proj-meta">
                {!!p.stars && <span>★ {p.stars}</span>}
                {p.updated && <span>güncellendi: {p.updated}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
