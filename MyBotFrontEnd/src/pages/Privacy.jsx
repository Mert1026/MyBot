import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './Home.css';

const Privacy = () => {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="home-wrapper" style={{ paddingTop: '40px' }}>
      <section style={{ padding: '80px 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>Декларация за <span>Поверителност</span></h1>
        
        <div style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <h3 style={{ color: '#fff', marginTop: '2rem', marginBottom: '0.5rem' }}>1. Администратор на лични данни</h3>
          <p>Администратор на личните данни е МайБот Роботикс ЕООД (ЕИК 208240686). За въпроси относно обработката на лични данни можете да се свържете с нас на телефон +359 898 424 031.</p>

          <h3 style={{ color: '#fff', marginTop: '2rem', marginBottom: '0.5rem' }}>2. Какви данни събираме</h3>
          <p>Събираме следните категории лични данни: имена на родител/настойник и деца, имейл адрес, телефонен номер, възраст на детето и предпочитан град за обучение.</p>

          <h3 style={{ color: '#fff', marginTop: '2rem', marginBottom: '0.5rem' }}>3. Цел на обработката</h3>
          <p>Личните данни се обработват за целите на: записване и управление на участието в курсове, комуникация с родители/настойници, издаване на фактури и счетоводна отчетност.</p>

          <h3 style={{ color: '#fff', marginTop: '2rem', marginBottom: '0.5rem' }}>4. Правно основание</h3>
          <p>Обработката на лични данни се основава на съгласието на субекта (чл. 6, ал. 1, буква а от GDPR) и на изпълнението на договор (чл. 6, ал. 1, буква б от GDPR).</p>

          <h3 style={{ color: '#fff', marginTop: '2rem', marginBottom: '0.5rem' }}>5. Срок на съхранение</h3>
          <p>Личните данни се съхраняват за периода на активното участие в курсовете и до 5 години след неговото прекратяване за счетоводни цели.</p>

          <h3 style={{ color: '#fff', marginTop: '2rem', marginBottom: '0.5rem' }}>6. Права на субектите</h3>
          <p>Имате право на достъп, коригиране, изтриване, ограничаване на обработката и преносимост на данните. За упражняване на тези права, свържете се с нас по имейл или телефон.</p>

          <h3 style={{ color: '#fff', marginTop: '2rem', marginBottom: '0.5rem' }}>7. Бисквитки</h3>
          <p>Уебсайтът използва бисквитки за подобряване на потребителското изживяване и за запазване на езикови предпочитания.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="show-more-btn" onClick={() => navigate('/')}>← Назад</button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Privacy;
