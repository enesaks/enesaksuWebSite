import React from 'react';
import { EXPERIENCE, FOCUS, formatPeriod } from '../../data/constants';

const AboutTab: React.FC = () => {
  return (
    <div>
      <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">cat about.txt</span></div>

      <div className="hero">
        <pre className="ascii-art" aria-hidden="true">{`███████╗███╗   ██╗███████╗███████╗
██╔════╝████╗  ██║██╔════╝██╔════╝
█████╗  ██╔██╗ ██║█████╗  ███████╗
██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║
███████╗██║ ╚████║███████╗███████║
╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝`}</pre>
        <div className="hero-text">
          <h1>Enes Aksu</h1>
          <div className="hero-role">Junior DevOps Engineer <span className="blink">█</span></div>
          <div className="hero-status"><span className="status-dot" /> available for opportunities</div>
        </div>
      </div>

      <div className="info-grid">
        <span className="info-key">education</span><span className="info-val">Computer Engineer</span>
        <span className="info-key">location</span><span className="info-val">Istanbul, TR</span>
        <span className="info-key">focus</span>
        <span className="info-val chips">{FOCUS.map(f => <span key={f} className="tag">{f}</span>)}</span>
      </div>

      <div className="section-title">// EXPERIENCE</div>
      <div className="exp-list">
        {EXPERIENCE.map((exp, i) => (
          <div key={i} className={`exp-item${exp.end ? '' : ' current'}`}>
            <div className="exp-company">
              {exp.company}
              {exp.badge && <span className="exp-badge" style={{ color:exp.badgeColor, borderColor:exp.badgeColor }}>{exp.badge}</span>}
            </div>
            <div className="exp-role">{exp.role}</div>
            <div className="exp-period">{formatPeriod(exp.start, exp.end)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTab;
