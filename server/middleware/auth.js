import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'נדרשת התחברות' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ message: 'ההתחברות פגה או לא תקפה, יש להתחבר מחדש' });
  }
}

export function requireManager(req, res, next) {
  if (req.userRole !== 'manager') {
    return res.status(403).json({ message: 'הפעולה מותרת למנהלים בלבד' });
  }
  next();
}
