# מדריך: הקמת מסד הנתונים (MongoDB) לפרויקט STAGE

המערכת שומרת את כל שמות המשתמש והסיסמאות (מוצפנות) של העובדים
והמנהלים במסד נתונים אחד ב-MongoDB, באוסף (collection) בשם `users`.
המדריך הזה מסביר איך להקים את מסד הנתונים ולחבר אותו לפרויקט —
יש שתי אפשרויות, תבחרו אחת מהן.

---

## אפשרות א' (מומלץ למתחילים): MongoDB Atlas — ענן, בחינם

לא צריך להתקין כלום על המחשב.

1. גשו ל-https://www.mongodb.com/cloud/atlas/register והירשמו (אפשר עם חשבון Google).
2. בעת יצירת הפרויקט הראשון, בחרו **M0 Free** (זהו טיר חינמי, מספיק לפרויקט הזה).
3. תבחרו ספק ענן ואזור (ברירת המחדל בסדר גמור), ולחצו **Create**.
4. **יצירת משתמש למסד הנתונים** (Database Access):
   - בתפריט הצד: `Security` → `Database Access` → `Add New Database User`.
   - בחרו שם משתמש וסיסמה (אלה פרטי החיבור למסד עצמו — לא קשור לעובדים באפליקציה).
   - הרשאה: `Read and write to any database`.
5. **פתיחת גישת רשת** (Network Access):
   - בתפריט הצד: `Security` → `Network Access` → `Add IP Address`.
   - לפיתוח מקומי הכי פשוט ללחוץ `Allow Access from Anywhere` (0.0.0.0/0).
6. **קבלת מחרוזת החיבור (Connection String):**
   - `Database` → `Connect` → `Drivers`.
   - העתיקו את המחרוזת שמופיעה, בערך כך:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - החליפו את `<username>` ו-`<password>` בפרטים שיצרתם בשלב 4.
   - הוסיפו שם למסד הנתונים לפני ה-`?` (Mongo ייצור אותו אוטומטית בפעם הראשונה שנשמור נתונים), למשל:
     ```
     mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/stage-web-project?retryWrites=true&w=majority
     ```

זו המחרוזת שתכניסו ל-`MONGODB_URI` (ראו "הגדרת הפרויקט" למטה).

---

## אפשרות ב': MongoDB מותקן מקומית על המחשב

1. הורידו את **MongoDB Community Server** מכאן: https://www.mongodb.com/try/download/community
   (בחרו Windows, ותאשרו התקנה כ-Service — ברירת המחדל בהתקנה).
2. מומלץ להתקין גם את **MongoDB Compass** (ממשק גרפי לצפייה בנתונים) — האינסטלר של Community Server מציע זאת אוטומטית.
3. אחרי ההתקנה, השירות `MongoDB` רץ ברקע (Windows Service) ומאזין כברירת מחדל בכתובת:
   ```
   mongodb://127.0.0.1:27017
   ```
4. אין צורך ליצור את מסד הנתונים מראש — הוא ייווצר אוטומטית ברגע שהאפליקציה תשמור בו את המשתמש הראשון. מספיק להוסיף שם למסד בסוף המחרוזת:
   ```
   mongodb://127.0.0.1:27017/stage-web-project
   ```

---

## הגדרת הפרויקט (משותף לשתי האפשרויות)

1. בשורש הפרויקט יש קובץ לדוגמה בשם `.env.example`. העתיקו אותו לקובץ חדש בשם `.env` (אותה תיקייה):

   ```bash
   cp .env.example .env
   ```

2. פתחו את `.env` ומלאו:

   ```
   MONGODB_URI=<המחרוזת שקיבלתם באפשרות א' או ב'>
   JWT_SECRET=<מחרוזת אקראית וארוכה, המצאה שלכם>
   PORT=5050
   ```

   ה-`JWT_SECRET` הוא מפתח סודי שהשרת משתמש בו כדי לחתום על "טוקן ההתחברות" של המשתמשים (כדי לזהות שהם מחוברים בלי לשלוח סיסמה בכל בקשה). כל מחרוזת אקראית וארוכה מתאימה — למשל 40 תווים אקראיים.

   **חשוב:** קובץ ה-`.env` לא נשמר ב-git (הוא ב-`.gitignore`) — כל מי שמריץ את הפרויקט צריך ליצור לעצמו קובץ כזה.

3. התקינו את החבילות (אם עוד לא):

   ```bash
   npm install
   ```

4. הריצו את שרת ה-API (מתחבר ל-MongoDB):

   ```bash
   npm run server
   ```

   אם הכל תקין תראו בקונסולה:
   ```
   Connected to MongoDB (stage-web-project)
   Server running on http://localhost:5050
   ```

   אם רואים שגיאת חיבור — בדקו שהמחרוזת ב-`MONGODB_URI` נכונה (סיסמה/שם משתמש/גישת רשת ב-Atlas).

5. בטרמינל נפרד הריצו את צד הלקוח (React):

   ```bash
   npm run dev
   ```

   או, כדי להריץ את שניהם יחד בפקודה אחת:

   ```bash
   npm run dev:all
   ```

6. גשו לכתובת `http://localhost:4178/register` ותירשמו כמשתמש ראשון. סמנו את התיבה **"הרשמה בתור מנהל"** כדי שהמשתמש הראשון שלכם יהיה מנהל (כדי שיהיה למישהו גישה לדף "ניהול עובדים").

---

## איך רואים את הנתונים שנשמרו?

- **Atlas:** בממשק האתר → `Database` → `Browse Collections` → מסד `stage-web-project` → אוסף `users`.
- **מקומי:** פתחו את **MongoDB Compass**, התחברו ל-`mongodb://127.0.0.1:27017`, ואז מסד `stage-web-project` → אוסף `users`.

בכל מקרה תראו מסמך לכל עובד עם `fullName`, `username`, `role` (`employee`/`manager`), ו-`passwordHash` — **הסיסמה עצמה אף פעם לא נשמרת בטקסט גלוי**, רק גיבוב (hash) חד-כיווני שלה שנוצר עם bcrypt.

---

## מבנה הקוד הרלוונטי

- `server/db.js` — התחברות ל-MongoDB.
- `server/models/User.js` — הגדרת מבנה מסמך המשתמש (schema).
- `server/routes/auth.js` — הרשמה (`POST /api/auth/register`) והתחברות (`POST /api/auth/login`).
- `server/routes/employees.js` — רשימת עובדים והסרת עובד, זמין רק למנהלים (`GET` / `DELETE /api/employees/:id`).
- `src/pages/RegisterPage.tsx` — דף הרישום בצד הלקוח.
- `src/pages/EmployeesPage.tsx` — דף "ניהול עובדים", מוצג בתפריט הצד רק למי שנרשם כמנהל.
- `src/context/AuthContext.tsx` — ניהול מצב ההתחברות בצד הלקוח.

## הערת אבטחה

כרגע כל אחד יכול לסמן את עצמו כ"מנהל" בזמן ההרשמה — זה תואם את מה שביקשתם,
אבל לפני שהאתר עולה לשימוש אמיתי מול לקוחות מומלץ להגביל את זה (לדוגמה: קוד
הזמנה סודי שרק מנהלים קיימים מפיצים, או אישור ידני של הרשמות מנהל).
