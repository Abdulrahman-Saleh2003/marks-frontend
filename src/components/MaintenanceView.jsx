import React from 'react';
import {
  Wrench,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Home,
  CheckCircle2,
  FileText,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export default function MaintenanceView({ type = 'past_exams', setActiveTab }) {
  const configs = {
    past_exams: {
      title: 'قسم الدورات الامتحانية',
      category: 'بنك الأسئلة والدورات',
      description: 'أرشيف الأسئلة الامتحانية والدورات الفصلية السابقة لكافة السنوات والمقررات في كلية الهندسة المعلوماتية.',
      icon: FileText,
      color: '#ef4444',
      items: [
        'أسئلة امتحانات الفصول الأولى والثانية لجميع السنوات',
        'دورات تكميلية واستدراكية محلولة',
        'تصنيف ذكي حسب المادة والسنة والأستاذ'
      ]
    },
    grading_keys: {
      title: 'قسم سلالم التصحيح',
      category: 'السلالم الرسمية والحلول النموذجية',
      description: 'سلالم التصحيح الصادرة عن الكلية والحلول النموذجية المعتمدة للامتحانات النظرية والعملية.',
      icon: CheckCircle2,
      color: '#06b6d4',
      items: [
        'سلالم تصحيح امتحانات السنوات الخمس الرسمية',
        'توزيع الدرجات التفصيلي لكل سؤال',
        'ملاحظات الأساتذة والمعيدين وتنبيهات الأخطاء الشائعة'
      ]
    },
    summaries: {
      title: 'قسم ملخص فهم المحاضرات',
      category: 'الملخصات والشروحات الذكية',
      description: 'ملخصات مكثفة، كبسولات مراجعة سريعة، وشروحات مبسطة لفهم المنهاج والمفاهيم الصعبة.',
      icon: Sparkles,
      color: '#8b5cf6',
      items: [
        'ملخصات شاملة مركزة قبل الامتحان',
        'مخططات مفاهيمية وجداول مقارنة للمواد البرمجية والرياضية',
        'أسئلة تدريبية واختبارات ذاتية لقياس الفهم'
      ]
    }
  };

  const config = configs[type] || configs.past_exams;
  const Icon = config.icon;

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      
      {/* Hero Maintenance Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e293b 100%)',
          color: '#ffffff',
          padding: '36px 28px',
          borderRadius: '24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 20px 35px -10px rgba(30, 27, 75, 0.45)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background glow */}
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: `${config.color}20`,
            filter: 'blur(80px)',
            borderRadius: '50%',
            top: '-50px',
            right: '-50px',
            pointerEvents: 'none'
          }}
        />

        {/* Section Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', zIndex: 1 }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Icon size={14} color={config.color} />
            <span>{config.category}</span>
          </span>
          <span
            style={{
              background: '#f59e0b',
              color: '#78350f',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: 900,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Clock size={13} />
            <span>قيد التطوير</span>
          </span>
        </div>

        {/* Main Title */}
        <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', zIndex: 1 }}>
          {config.title}
        </h1>

        <p style={{ fontSize: '14px', color: '#c7d2fe', maxWidth: '600px', lineHeight: 1.7, marginBottom: '24px', zIndex: 1 }}>
          {config.description}
        </p>

        {/* Animated Maintenance Status Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px dashed rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            padding: '24px 28px',
            maxWidth: '560px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1,
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
              animation: 'floatAnim 3s ease-in-out infinite'
            }}
          >
            <Wrench size={32} />
          </div>

          <div style={{ fontSize: '22px', fontWeight: 900, color: '#fef08a', marginTop: '6px' }}>
            🛠️ جاري الصيانة والتجهيز
          </div>

          <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
            قريباً سوف ينتهي التطوير وتتوفر كافة الملفات
          </div>

          <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.6, margin: '4px 0 0' }}>
            يجري العمل حالياً على أرشفة وتدقيق الملفات من قِبل الفريق، وربطها بنظام التخزين السحابي لتسهيل التصفح والتحميل المباشر.
          </p>

          {/* Progress Indicator */}
          <div style={{ width: '100%', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 700 }}>
              <span>نسبة إنجاز الأرشفة والتدقيق</span>
              <span>85% مكتمل</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '85%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                  borderRadius: '10px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px', zIndex: 1 }}>
          <button
            onClick={() => setActiveTab('lectures')}
            className="btn"
            style={{
              background: '#ffffff',
              color: '#1e1b4b',
              fontWeight: 800,
              padding: '11px 22px',
              fontSize: '13px'
            }}
          >
            <BookOpen size={16} />
            <span>تصفح قسم المحاضرات المتوفرة الآن</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="btn btn-secondary"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontWeight: 700,
              padding: '11px 20px',
              fontSize: '13px'
            }}
          >
            <Home size={16} />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#4f46e5" />
          <span>ماذا سيتضمن هذا القسم فور تدشينه؟</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {config.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                background: '#f8fafc',
                borderRadius: '14px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '12px',
                  flexShrink: 0
                }}
              >
                {idx + 1}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', lineHeight: 1.5 }}>
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
