import React, { useState, useEffect } from 'react';
import { ARTICLES as FALLBACK_ARTICLES } from '../../data/constants';

interface WritingsTabProps {
  openLink: (url: string) => void;
}

interface Article {
  date: string;
  title: string;
  desc: string;
  tags: string[];
  url: string;
}

const WritingsTab: React.FC<WritingsTabProps> = ({ openLink }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@enesaks');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        if (data.status === 'ok' && data.items) {
          const parsedArticles: Article[] = data.items.map((item: any) => {
            // Basit HTML etiketlerini ve resimleri açıklama kısmından temizleme
            const cleanContent = item.content.replace(/<[^>]*>?/gm, '');
            const shortDesc = cleanContent.length > 120 ? cleanContent.substring(0, 120) + '...' : cleanContent;
            
            // Tarihi formatlama (örn: "2024-09-22 00:00:00" -> "SEP 22, 2024")
            const dateObj = new Date(item.pubDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
            
            return {
              date: formattedDate,
              title: item.title,
              desc: shortDesc,
              tags: item.categories || [],
              url: item.link
            };
          });
          setArticles(parsedArticles);
        } else {
          throw new Error('Invalid Data');
        }
      } catch (err) {
        console.error("Medium API Hatası:", err);
        setError(true);
        setArticles(FALLBACK_ARTICLES);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div>
      <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">curl -s https://medium.com/feed/@enesaks | jq .items</span></div>
      
      {loading && <div style={{ color: 'var(--amber)', marginBottom: '10px' }}>[ Fetching from Medium API... ]</div>}
      
      {error && <div style={{ color: 'var(--red)', marginBottom: '10px' }}>[ WARN ] API failed. Using fallback data.</div>}

      {!loading && articles.map((a, i) => (
        <div key={i} className="article-card" onClick={() => openLink(a.url)}>
          <div className="article-date">{a.date}</div>
          <div className="article-title">{a.title}</div>
          <div className="article-desc">{a.desc}</div>
          <div>{a.tags.map(t => <span key={t} className="article-tag">{t}</span>)}</div>
        </div>
      ))}
      
      <div className="medium-footer">
        <span style={{ color:'var(--green-dark)' }}>$ </span>
        <a href="https://medium.com/@enesaks" target="_blank" rel="noreferrer">→ tüm yazılar için medium.com/@enesaks</a>
      </div>
    </div>
  );
};

export default WritingsTab;
