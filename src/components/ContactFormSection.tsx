import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Locale, UI_TEXT } from '../data/i18n';
import { soundFX } from '../utils/sound';

interface ContactFormSectionProps {
  locale: Locale;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  locale,
}) => {
  const t = UI_TEXT[locale].contact;

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    soundFX.playFanfare();
    setSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <div className="lg:col-span-5">
        <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-3 editorial-callout-line">
          CHAPTER 05B // CONTACT
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.18] min-h-[1.2em]">
          {locale === 'ja'
            ? 'お問い合わせ'
            : locale === 'zh'
            ? '联系'
            : 'Contact'}
        </h2>
        <p className="mt-5 text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E] leading-relaxed min-h-[4.8rem]">
          {locale === 'ja'
            ? '/* 機能展示位置注釈：連絡先案内テキスト・SNSリンク・メールアドレス等を配置する左カラム説明枠です。右側は実際に送信動作確認が可能なフォーム枠です。 */'
            : locale === 'zh'
            ? '公开联系方式请见 GitHub 个人主页。右侧表单用于预览填写内容。'
            : '/* Functional Slot Annotation: Left column houses contact instructions and social/email links; right column is an interactive inquiry form component. */'}
        </p>
      </div>

      <div className="lg:col-span-7 p-7 sm:p-10 card-3d-console">
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-9 h-9 text-[#C84B31] dark:text-[#E57052] mx-auto" />
            <h3 className="font-editorial text-2xl font-semibold">{t.successTitle}</h3>
            <p className="text-xs sm:text-sm font-mono text-[#555B61] dark:text-[#B0A89E]">
              {t.successDesc}
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              className="mt-3 px-6 py-2.5 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer"
            >
              OK
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono tracking-wider text-[#555B61] dark:text-[#B0A89E] mb-2">
                  01 / {t.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full h-11 px-4 text-sm font-mono bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] focus:outline-none focus:border-[#181A1C] dark:focus:border-[#F2EFE9]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider text-[#555B61] dark:text-[#B0A89E] mb-2">
                  02 / {t.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full h-11 px-4 text-sm font-mono bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] focus:outline-none focus:border-[#181A1C] dark:focus:border-[#F2EFE9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider text-[#555B61] dark:text-[#B0A89E] mb-2">
                03 / {t.messageLabel}
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
                className="w-full px-4 py-3 text-sm font-mono bg-[#F7F6F2] dark:bg-[#131210] border border-[#E2E0D8] dark:border-[#2E2924] focus:outline-none focus:border-[#181A1C] dark:focus:border-[#F2EFE9]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-11 min-w-[176px] px-7 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>{t.submitBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
