import { useCallback, useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import { AdminFooter } from '../components/PageFooters';
import { API_BASE, authHeader, useAuth } from '../context/AuthContext';
import './InquiriesPage.css';

type InquiryStatus = 'new' | 'handled';

interface Inquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  reason: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.message === 'string' ? data.message : fallback;
  } catch {
    return fallback;
  }
}

export default function InquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inquiries`, { headers: authHeader(token) });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'טעינת הפניות נכשלה'));
      const data = await res.json();
      setInquiries(data.inquiries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'טעינת הפניות נכשלה');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const toggleStatus = async (inquiry: Inquiry) => {
    const nextStatus: InquiryStatus = inquiry.status === 'new' ? 'handled' : 'new';
    setBusyId(inquiry.id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inquiries/${inquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(token) },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'עדכון הפנייה נכשל'));
      const data = await res.json();
      setInquiries((prev) => prev.map((i) => (i.id === inquiry.id ? data.inquiry : i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'עדכון הפנייה נכשל');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (inquiry: Inquiry) => {
    const confirmed = window.confirm(`למחוק את הפנייה של ${inquiry.fullName}?`);
    if (!confirmed) return;

    setBusyId(inquiry.id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inquiries/${inquiry.id}`, {
        method: 'DELETE',
        headers: authHeader(token),
      });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'מחיקת הפנייה נכשלה'));
      setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'מחיקת הפנייה נכשלה');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-shell">
      <AdminSidebar active="inquiries" />

      <main className="admin-main">
        <div className="admin-content">
          <AdminPageHeader title="פניות שהתקבלו" description="פניות שהתקבלו מדף יצירת הקשר באתר." />

          {error && <p className="admin-error">{error}</p>}

          <div className="orders-table-card">
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>שם מלא</th>
                    <th>טלפון</th>
                    <th>אימייל</th>
                    <th>סיבת פנייה</th>
                    <th>הודעה</th>
                    <th className="ta-center">סטטוס</th>
                    <th className="ta-right">תאריך</th>
                    <th className="ta-center">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="ta-center admin-loading-row">טוען פניות...</td>
                    </tr>
                  ) : inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="ta-center admin-empty-row">אין עדיין פניות במערכת</td>
                    </tr>
                  ) : (
                    inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="orders-row">
                        <td><p className="orders-id-title">{inquiry.fullName}</p></td>
                        <td><p className="orders-company">{inquiry.phone}</p></td>
                        <td><p className="orders-company">{inquiry.email || '—'}</p></td>
                        <td><span className="orders-date-pill">{inquiry.reason || '—'}</span></td>
                        <td><p className="inquiry-message">{inquiry.message || '—'}</p></td>
                        <td className="ta-center">
                          <span className={`orders-status ${inquiry.status === 'handled' ? 'approved' : 'pending'}`}>
                            {inquiry.status === 'handled' ? 'טופל' : 'חדש'}
                          </span>
                        </td>
                        <td className="ta-right">
                          <span className="orders-date-pill">{new Date(inquiry.createdAt).toLocaleDateString('he-IL')}</span>
                        </td>
                        <td className="ta-center">
                          <div className="inv-actions">
                            <button type="button" className="inv-edit-btn" disabled={busyId === inquiry.id} onClick={() => toggleStatus(inquiry)}>
                              {inquiry.status === 'handled' ? 'סמן כחדש' : 'סמן כטופל'}
                            </button>
                            <button type="button" className="inv-remove-btn" disabled={busyId === inquiry.id} onClick={() => handleDelete(inquiry)}>
                              {busyId === inquiry.id ? '...' : 'מחק'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <AdminFooter copyright="© 2024 STAGE Event Production Services | Management Console" />
        </div>
      </main>
    </div>
  );
}
