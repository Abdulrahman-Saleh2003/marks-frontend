import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  Send,
  Sparkles,
  GraduationCap,
  Brain,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Heart,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

export default function ContactView({ showToast }) {
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('bug');
  const [customNote, setCustomNote] = useState('');

  const phoneDisplay = '+963 938 135 338';
  const rawPhone = '963938135338';
  const emailAddress = 'eng.abdulrahman.saleh2003@gmail.com';
  const githubUrl = 'https://github.com/Abdulrahman-Saleh2003';

  const topics = [
    {
      id: 'bug',
      label: '🐛 إبلاغ عن مشكلة برمجية',
      defaultMsg: 'مرحباً مهندس عبد الرحمن، لاحظت مشكلة برمجية في المنصة وأود توضيحها:'
    },
    {
      id: 'suggestion',
      label: '💡 اقتراح أو تعديل جديد',
      defaultMsg: 'مرحباً مهندس عبد الرحمن، لدي اقتراح تطويري رائع لتحسين المنصة:'
    },
    {
      id: 'files',
      label: '📄 إضافة ملفات مواد / محاضرات',
      defaultMsg: 'مرحباً مهندس عبد الرحمن، أود تزويدكم بملفات/دورات إضافية لإدراجها في المنصة:'
    },
    {
      id: 'feedback',
      label: '⭐ نقد بنّاء ورأي عام',
      defaultMsg: 'مرحباً مهندس عبد الرحمن، أود تقديم ملاحظاتي ورأيي البنّاء حول الموقع:'
    }
  ];

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('0938135338');
    setCopied(true);
    if (showToast) showToast('تم نسخ رقم الهاتف (0938135338) إلى الحافظة بنجاح!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const currentTopic = topics.find((t) => t.id === selectedTopic) || topics[0];

  const buildWhatsAppUrl = () => {
    const fullText = customNote.trim()
      ? `${currentTopic.defaultMsg}\n\n${customNote}`
      : `${currentTopic.defaultMsg}\n(بانتظار التفاصيل...)`;
    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(fullText)}`;
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Hero Profile Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)',
          color: '#ffffff',
          padding: '36px 28px',
          borderRadius: '24px',
          boxShadow: '0 20px 35px -10px rgba(30, 27, 75, 0.45)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            background: 'rgba(16, 185, 129, 0.18)',
            filter: 'blur(70px)',
            borderRadius: '50%',
            top: '-50px',
            left: '-50px',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                border: '3px solid rgba(255, 255, 255, 0.2)',
                flexShrink: 0
              }}
            >
              <GraduationCap size={44} />
            </div>

            {/* Developer Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    fontSize: '11.5px',
                    fontWeight: 900,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Sparkles size={12} /> مطور ومؤسس المنصة
                </span>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.14)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  جامعة دمشق - ITE
                </span>
              </div>

              <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '6px' }}>
                م. عبد الرحمن قاسم صالح
              </h1>

              <div style={{ fontSize: '14.5px', color: '#a7f3d0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Brain size={18} color="#34d399" />
                <span>مهندس معلوماتية — اختصاص الذكاء الصنعي ومعالجة اللغات الطبيعية (AI & NLP)</span>
              </div>

              <p style={{ fontSize: '13px', color: '#cbd5e1', maxWidth: '620px', lineHeight: 1.6, marginTop: '8px' }}>
                خرّيج كلية الهندسة المعلوماتية في جامعة دمشق. تم بناء هذه المنصة الشاملة بحرص واهتمام لخدمة الزملاء الطلاب في أتمتة النتائج وتنظيم المحاضرات وتقديم تجربة أكاديمية متقدمة.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Code2 size={24} color="#34d399" />
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>التطوير والتقنيات</div>
                <div style={{ fontSize: '13px', fontWeight: 800 }}>Full-Stack & AI Systems</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <ThumbsUp size={24} color="#60a5fa" />
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>سياسة التحديث</div>
                <div style={{ fontSize: '13px', fontWeight: 800 }}>نقبل النقد البنّاء والمقترحات</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feedback & WhatsApp Card */}
      <div
        className="card"
        style={{
          padding: '28px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MessageCircle size={22} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                تواصل معنا مباشرة عبر واتساب
              </h2>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.7, maxWidth: '650px' }}>
              إذا لاحظت <strong>أي مشاكل تقنية</strong> أو <strong>نقصاً في علامات أي مقرر</strong>، أو إذا كان لديك <strong>أي اقتراح أو تعديل لتطوير المنصة</strong>، فنحن نرحب دوماً بالتواصل والنقد البنّاء. صوتك ورأيك يساهمان في تحسين البوابة لجميع الطلاب!
            </p>
          </div>

          {/* Quick Copy Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCopyPhone}
              className="btn btn-secondary"
              style={{
                fontSize: '12.5px',
                padding: '9px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              title="نسخ الرقم إلى الحافظة"
            >
              {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
              <span style={{ fontWeight: 800 }}>{copied ? 'تم نسخ الرقم!' : `نسخ الرقم: 0938135338`}</span>
            </button>
          </div>
        </div>

        {/* Message Topic Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
            اختر نوع الرسالة أو الملاحظة لتجهيزها تلقائياً:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
            {topics.map((t) => {
              const isSelected = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #16a34a' : '1.5px solid #e2e8f0',
                    background: isSelected ? '#f0fdf4' : '#f8fafc',
                    color: isSelected ? '#166534' : '#334155',
                    fontSize: '13px',
                    fontWeight: isSelected ? 800 : 700,
                    cursor: 'pointer',
                    textAlign: 'right',
                    fontFamily: 'var(--font-arabic)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Custom Note Input */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '8px' }}>
            أضف تفاصيل رسالتك أو ملاحظتك (اختياري):
          </label>
          <textarea
            rows={3}
            placeholder="اكتب هنا تفاصيل المشكلة، أو الميزة التي ترغب بإضافتها، أو أي استفسار لديك..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="input-field"
            style={{
              width: '100%',
              resize: 'vertical',
              fontSize: '13px',
              fontFamily: 'var(--font-arabic)',
              lineHeight: 1.6
            }}
          />
        </div>

        {/* Action Button: Open WhatsApp directly */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12.5px' }}>
            <Phone size={16} color="#16a34a" />
            <span style={{ fontWeight: 700 }}>رقم الواتساب المباشر:</span>
            <strong style={{ color: '#0f172a', direction: 'ltr' }}>{phoneDisplay}</strong>
          </div>

          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#ffffff',
              padding: '13px 26px',
              borderRadius: '14px',
              fontSize: '14.5px',
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(22, 163, 74, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none'
            }}
          >
            <MessageCircle size={20} />
            <span>مراسلتي مباشرة على الواتساب</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Alternative Contact Channels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Email Card */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#e0e7ff',
              color: '#4338ca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Mail size={22} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>البريد الإلكتروني المباشر</div>
            <a
              href={`mailto:${emailAddress}`}
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#4338ca',
                textDecoration: 'none',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {emailAddress}
            </a>
          </div>
        </div>

        {/* GitHub Repository Card */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#f1f5f9',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Code2 size={22} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>المستودع والمشاريع البرمجية</div>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#0f172a',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>GitHub / Abdulrahman-Saleh</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
