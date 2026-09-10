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

// Rental dates + quantity have their own dedicated UI (with a live
// availability check) in CheckoutForm — this only covers the personal
// details needed to place the reservation. There's no payment step: this
// is a reservation request, not a checkout with real billing.
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
