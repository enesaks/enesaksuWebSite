import React from 'react';
import { EXPERIENCE } from '../../data/constants';

const AboutTab: React.FC = () => {
  return (
    <div>
      <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">cat about.txt</span></div>
      <pre className="ascii-art">{`  ███████╗███╗   ██╗███████╗███████╗
  ██╔════╝████╗  ██║██╔════╝██╔════╝
  █████╗  ██╔██╗ ██║█████╗  ███████╗
  ██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║
  ███████╗██║ ╚████║███████╗███████║
  ╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝`}</pre>
      <div>
        {([['name','Enes Aksu'],['role',null],['education','Computer Engineer'],['location','Istanbul, TR'],['status','● available for opportunities'],['focus','Linux · Docker · CI/CD · AWS · Cloud']] as [string,string|null][]).map(([k,v]) => (
          <div key={k} className="info-row">
            <span className="info-key">{k}</span>
            {k==='role'
              ? <span className="info-val">Junior DevOps Engineer <span className="blink">█</span></span>
              : <span className="info-val" style={k==='status'?{color:'var(--green)'}:{}}>{v}</span>
            }
          </div>
        ))}
      </div>
      <div className="exp-section-title">// EXPERIENCE</div>
      {EXPERIENCE.map((exp, i) => (
        <div key={i} className="exp-item">
          <div className="exp-left">{exp.period}</div>
          <div>
            <div className="exp-company">
              {exp.company}
              {exp.badge && <span className="exp-badge" style={{ color:exp.badgeColor, borderColor:exp.badgeColor }}>{exp.badge}</span>}
            </div>
            <div className="exp-role">{exp.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutTab;
