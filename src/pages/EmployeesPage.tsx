import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import { AdminFooter } from '../components/PageFooters';
import { API_BASE, authHeader, useAuth, type AuthUser } from '../context/AuthContext';
import './EmployeesPage.css';

type Employee = Pick<AuthUser, 'id' | 'fullName' | 'username' | 'role' | 'createdAt'>;

export default function EmployeesPage() {
  const { token, user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/employees`, { headers: authHeader(token) });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? 'טעינת רשימת העובדים נכשלה');
      }
      const data = await res.json();
      setEmployees(data.employees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'טעינת רשימת העובדים נכשלה');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleRemove = async (employee: Employee) => {
    const confirmed = window.confirm(`להסיר את ${employee.fullName} מהמערכת?`);
    if (!confirmed) return;

    setRemovingId(employee.id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/employees/${employee.id}`, {
        method: 'DELETE',
        headers: authHeader(token),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message ?? 'הסרת העובד נכשלה');
      }
      setEmployees((prev) => prev.filter((e) => e.id !== employee.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'הסרת העובד נכשלה');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="admin-shell">
      <AdminSidebar active="employees" />

      <main className="admin-main">
        <div className="admin-content">
          <AdminPageHeader title="ניהול עובדים" description="צפייה ברשימת כל העובדים והמנהלים במערכת, והסרת עובדים במידת הצורך." />

          {error && <p className="admin-error">{error}</p>}

          <div className="orders-table-card">
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>שם מלא</th>
                    <th>שם משתמש</th>
                    <th className="ta-center">תפקיד</th>
                    <th className="ta-right">הצטרף בתאריך</th>
                    <th className="ta-center">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="ta-center admin-empty-row">טוען עובדים...</td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="ta-center admin-empty-row">אין עדיין עובדים רשומים</td>
                    </tr>
                  ) : (
                    employees.map((employee) => {
                      const isSelf = employee.id === user?.id;
                      return (
                        <tr key={employee.id} className="orders-row">
                          <td>
                            <p className="orders-id-title">{employee.fullName}</p>
                            {isSelf && <p className="orders-id-sub">(המשתמש המחובר)</p>}
                          </td>
                          <td>
                            <p className="orders-company">{employee.username}</p>
                          </td>
                          <td className="ta-center">
                            <span className={`orders-status ${employee.role === 'manager' ? 'approved' : 'pending'}`}>
                              {employee.role === 'manager' ? 'מנהל' : 'עובד'}
                            </span>
                          </td>
                          <td className="ta-right">
                            <span className="orders-date-pill">
                              {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString('he-IL') : '—'}
                            </span>
                          </td>
                          <td className="ta-center">
                            <button
                              type="button"
                              className="inv-remove-btn"
                              disabled={isSelf || removingId === employee.id}
                              onClick={() => handleRemove(employee)}
                            >
                              {removingId === employee.id ? 'מסיר...' : 'הסר עובד'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
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
