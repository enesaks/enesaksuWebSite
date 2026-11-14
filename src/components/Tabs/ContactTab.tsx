import React from 'react';

const CONTACTS = [
  { icon:'[github]',    color:'var(--green)', href:'https://github.com/enesaks',            label:'github.com/enesaks' },
  { icon:'[linkedin]',  color:'#4aa3df',      href:'https://www.linkedin.com/in/enesaks',   label:'linkedin.com/in/enesaks' },
  { icon:'[medium]',    color:'var(--white)', href:'https://medium.com/@enesaks',           label:'medium.com/@enesaks' },
  { icon:'[gmail]',     color:'#ff7b6b',      href:'mailto:enesaksu3429@gmail.com',         label:'enesaksu3429@gmail.com' },
  { icon:'[instagram]', color:'#f06292',      href:'https://www.instagram.com/enes.aks29',  label:'@enes.aks29' },
];

const ContactTab: React.FC = () => {
  return (
    <div>
      <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">cat contact.json | jq .</span></div>
      <div className="contact-list">
        {CONTACTS.map(c => (
          <a key={c.icon} className="contact-link" href={c.href} target={c.href.startsWith('mailto')?undefined:'_blank'} rel="noreferrer">
            <span className="contact-icon" style={{ color:c.color }}>{c.icon}</span>
            <span className="contact-label">{c.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactTab;
