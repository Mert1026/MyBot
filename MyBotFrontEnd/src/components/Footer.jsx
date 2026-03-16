import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { i18n } = useTranslation();
  const year = new Date().getFullYear();
  const isBg = i18n.language === 'bg';

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #FFF9E6 0%, #F0F8FF 50%, #FFF0F5 100%)',
      borderTop: '4px solid var(--color-secondary)',
      padding: '3rem 2rem 2rem',
      color: '#636e72',
      fontFamily: "'Baloo 2', cursive, sans-serif"
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ maxWidth: '400px' }}>
            <h4 style={{ color: '#2d3436', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>MyBot Robotics</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#636e72' }}>
              {isBg
                ? 'Всички цени са в евро (EUR). Доставчик на услугите е МайБот Роботикс ЕООД, регистрирана в Търговски регистър с ЕИК 208240686.'
                : 'All prices are in Euro (EUR). Service provider: MyBot Robotics EOOD, registered in the Commercial Register under UIC 208240686.'}
            </p>
          </div>

          <div>
            <h4 style={{ color: '#2d3436', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 700 }}>{isBg ? 'Правни' : 'Legal'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="/terms" style={{ color: '#4D96FF', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-secondary)'}
                onMouseLeave={e => e.target.style.color = '#4D96FF'}
              >{isBg ? 'Общи условия' : 'Terms & Conditions'}</a>
              <a href="/privacy" style={{ color: '#4D96FF', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-secondary)'}
                onMouseLeave={e => e.target.style.color = '#4D96FF'}
              >{isBg ? 'Декларация за поверителност' : 'Privacy Policy'}</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#2d3436', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 700 }}>{isBg ? 'Последвайте ни' : 'Follow Us'}</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://www.facebook.com/MyBot.Robotics" target="_blank" rel="noopener noreferrer"
                style={{ color: '#4D96FF', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-secondary)'}
                onMouseLeave={e => e.target.style.color = '#4D96FF'}
              >Facebook</a>
              <a href="https://www.instagram.com/mybot_robotics/" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--color-secondary)', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#FF8FD8'}
                onMouseLeave={e => e.target.style.color = 'var(--color-secondary)'}
              >Instagram</a>
              <a href="https://www.tiktok.com/@mybot_robotics" target="_blank" rel="noopener noreferrer"
                style={{ color: '#6BCB77', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#FFD93D'}
                onMouseLeave={e => e.target.style.color = '#6BCB77'}
              >TikTok</a>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div style={{ borderTop: '2px dashed #e0e0e0', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {isBg
              ? 'LEGO®, LEGO® Education са регистрирани марки на LEGO® Group. МайБот Роботикс ЕООД не е спонсорирана от LEGO® Group.'
              : 'LEGO®, LEGO® Education are registered trademarks of LEGO® Group. MyBot Robotics is not sponsored by LEGO® Group.'}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            MyBot Robotics © {year}. {isBg ? 'Всички права запазени.' : 'All rights reserved.'}
          </p>
        </div>

        {/* Made by */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #e0e0e0' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Made by{' '}
            <a
              href="https://www.instagram.com/mert__10.e/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#4D96FF'}
              onMouseLeave={e => e.target.style.color = 'var(--color-secondary)'}
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
