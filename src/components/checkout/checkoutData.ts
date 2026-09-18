export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export interface FormSection {
  icon: string;
  title: string;
  fields: FormField[];
}

// Personal details needed to place an order request. There's no payment
// step and no date/quantity selection: this is a simple order request —
// pricing and scheduling are handled by staff after the fact.
export const FORM_SECTIONS: FormSection[] = [
  {
    icon: 'person',
    title: 'פרטים אישיים',
    fields: [
      { name: 'fullName', label: 'שם מלא', type: 'text', placeholder: 'ישראל ישראלי' },
      { name: 'phone', label: 'מספר טלפון', type: 'tel', placeholder: '050-0000000' },
      { name: 'email', label: 'אימייל', type: 'email', placeholder: 'example@stage.com', fullWidth: true },
      { name: 'address', label: 'כתובת למשלוח', type: 'text', placeholder: 'רחוב, עיר, מיקוד', fullWidth: true },
    ],
  },
];

export const COMMITMENTS = [
  'תמיכה טכנית 24/7 לכל אורך האירוע',
  'ציוד מתוחזק ובדיקת תקינות לפני כל השכרה',
  'ביטוח מלא על כלל המערכות',
];
