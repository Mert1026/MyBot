import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { i18n } = useTranslation();
  const year = new Date().getFullYear();
  const isBg = i18n.language === 'bg';

  return (
    <footer style={{
      background: '#020617',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '3rem 2rem 2rem',
      color: '#94a3b8',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ maxWidth: '400px' }}>
            <h4 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1.1rem' }}>MyBot Robotics</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              {isBg
                ? 'Всички цени са в евро (EUR). Доставчик на услугите е МайБот Роботикс ЕООД, регистрирана в Търговски регистър с ЕИК 208240686.'
                : 'All prices are in Euro (EUR). Service provider: MyBot Robotics EOOD, registered in the Commercial Register under UIC 208240686.'}
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1rem' }}>{isBg ? 'Правни' : 'Legal'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="/terms" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2196F3'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >{isBg ? 'Общи условия' : 'Terms & Conditions'}</a>
              <a href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2196F3'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >{isBg ? 'Декларация за поверителност' : 'Privacy Policy'}</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1rem' }}>{isBg ? 'Последвайте ни' : 'Follow Us'}</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://www.facebook.com/MyBot.Robotics" target="_blank" rel="noopener noreferrer"
                style={{ color: '#94a3b8', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2196F3'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >Facebook</a>
              <a href="https://www.instagram.com/mybot_robotics/" target="_blank" rel="noopener noreferrer"
                style={{ color: '#94a3b8', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2196F3'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >Instagram</a>
              <a href="https://www.tiktok.com/@mybot_robotics" target="_blank" rel="noopener noreferrer"
                style={{ color: '#94a3b8', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2196F3'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >TikTok</a>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem' }}>
            {isBg
              ? 'LEGO®, LEGO® Education са регистрирани марки на LEGO® Group. МайБот Роботикс ЕООД не е спонсорирана от LEGO® Group.'
              : 'LEGO®, LEGO® Education are registered trademarks of LEGO® Group. MyBot Robotics is not sponsored by LEGO® Group.'}
          </p>
          <p style={{ fontSize: '0.8rem' }}>
            MyBot Robotics © {year}. {isBg ? 'Всички права запазени.' : 'All rights reserved.'}
          </p>
        </div>

        {/* Made by */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Made by{' '}
            <a
              href="https://www.instagram.com/mert__10.e/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#42a5f5'}
              onMouseLeave={e => e.target.style.color = '#2196F3'}
            >
              Mert Elsenev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
