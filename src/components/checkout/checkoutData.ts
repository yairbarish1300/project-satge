import { makePlaceholderImage } from '../../utils/placeholderImage';

export interface FormField {
  label: string;
  type: string;
  placeholder?: string;
  fullWidth?: boolean;
  icon?: string;
}

export interface FormSection {
  icon: string;
  title: string;
  fields: FormField[];
}

export const FORM_SECTIONS: FormSection[] = [
  {
    icon: 'calendar_today',
    title: 'מועד השכרה',
    fields: [
      { label: 'מתאריך', type: 'date' },
      { label: 'עד תאריך', type: 'date' },
    ],
  },
  {
    icon: 'person',
    title: 'פרטים אישיים',
    fields: [
      { label: 'שם מלא', type: 'text', placeholder: 'ישראל ישראלי' },
      { label: 'מספר טלפון', type: 'tel', placeholder: '050-0000000' },
      { label: 'אימייל', type: 'email', placeholder: 'example@stage.com', fullWidth: true },
      { label: 'כתובת למשלוח', type: 'text', placeholder: 'רחוב, עיר, מיקוד', fullWidth: true },
    ],
  },
  {
    icon: 'payments',
    title: 'אמצעי תשלום',
    fields: [
      { label: 'מספר כרטיס', type: 'text', placeholder: '**** **** **** ****', fullWidth: true, icon: 'credit_card' },
      { label: 'תוקף', type: 'text', placeholder: 'MM/YY' },
      { label: 'CVV', type: 'text', placeholder: '123' },
    ],
  },
];

export const COMMITMENTS = [
  'תמיכה טכנית 24/7 לכל אורך האירוע',
  'ציוד מתוחזק ובדיקת תקינות לפני כל השכרה',
  'ביטוח מלא על כלל המערכות',
];

export const PRODUCT = {
  title: 'L-Acoustics K2 System',
  subtitle: 'מערכת סאונד מקצועית',
  image: makePlaceholderImage('L-Acoustics K2', { accent: '#4be277', secondary: '#adc6ff' }),
  pricePerDay: 4500,
  breakdown: [
    { label: 'השכרה (3 ימים)', value: 13500 },
    { label: 'הובלה והקמה', value: 1200 },
    { label: 'מע"מ (17%)', value: 2499 },
  ],
  total: 17199,
};
