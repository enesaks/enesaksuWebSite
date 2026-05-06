import React from 'react';

const ContactTab: React.FC = () => {
  return (
    <div>
      <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">cat contact.json | jq .</span></div>
      {[
        { icon:'[medium]',    color:'#e8e8e8', href:'https://medium.com/@enesaks',           label:'medium.com/@enesaks' },
        { icon:'[linkedin]',  color:'#0077b5', href:'https://www.linkedin.com/in/enesaks',   label:'linkedin.com/in/enesaks' },
        { icon:'[gmail]',     color:'#d14836', href:'mailto:enesaksu3429@gmail.com',         label:'enesaksu3429@gmail.com' },
        { icon:'[instagram]', color:'#e4405f', href:'https://www.instagram.com/enes.aks29',  label:'@enes.aks29' },
      ].map((c, i) => (
        <div key={i} className="contact-line">
          <span className="contact-icon" style={{ color:c.color }}>{c.icon}</span>
          <a className="contact-link" href={c.href} target={c.href.startsWith('mailto')?undefined:'_blank'} rel="noreferrer">{c.label}</a>
        </div>
      ))}
    </div>
  );
};

export default ContactTab;
