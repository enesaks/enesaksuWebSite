import React, { useState, useEffect } from 'react';
import { PROJECTS as FALLBACK_PROJECTS } from '../../data/constants';

interface Project {
  title: string;
  desc: string;
  tags: string[];
  url: string;
  status: string;
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
            status: repo.archived ? 'archived' : 'live'
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
      
      {loading && <div style={{ color: 'var(--amber)', marginBottom: '10px' }}>[ Fetching from GitHub API... ]</div>}
      
      {error && <div style={{ color: 'var(--red)', marginBottom: '10px' }}>[ WARN ] API failed. Using fallback data.</div>}

      {!loading && projects.map((p, i) => (
        <div key={i} className="project-card">
          <span className="proj-corner-l">[</span>
          <span className="proj-corner-r">]</span>
          <span className="proj-status" style={{ color:p.status==='live'?'var(--green)':'var(--amber)' }}>
            {p.status==='live'?'● PUBLIC':(p.status==='archived' ? 'ARCHIVED' : '◉ WIP')}
          </span>
          <div className="proj-title"><a href={p.url} target="_blank" rel="noreferrer">{p.title}</a></div>
          <div className="proj-desc">{p.desc}</div>
          <div className="proj-tags">{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsTab;
