# สรุปงาน inongtravel - วันที่ 26 ก.ค. 2026

## งานที่แก้ไขแล้ว (5 ข้อ)

### 1. Password-protect tools/ pages ✅
- ไฟล์: tools/set-admin.html, check-firestore.html, upload-tours.html, reset-tours.html
- รหัสผ่าน: `inong2024`
- ใช้ sessionStorage เก็บสถานะ login (ปิดแท็บแล้วต้องใส่ใหม่)

### 2. Firestore Security Rules ✅
- ไฟล์ใหม่: `firestore.rules`, `firestore.indexes.json`
- อัพเดท: `firebase.json` เพิ่ม firestore config
- กฎ:
  - tours: อ่านได้ทุกคน, เขียนไม่ได้
  - users: เขียนได้เฉพาะตัวเอง, admin อ่านได้หมด
  - bookings: สร้างได้เฉพาะตัวเอง, admin จัดการได้หมด
  - promos: อ่านได้ทุกคน, เขียนไม่ได้

### 3. Service Worker Registration ✅
- ไฟล์: assets/js/app.js, auth.html
- เพิ่ม `navigator.serviceWorker.register('/sw.js')` ท้ายไฟล์
- ตอนนี้ PWA cache จะทำงานจริง

### 4. Floating Contact Button (LINE/WhatsApp) ✅
- ไฟล์: assets/js/app.js, auth.html
- ปุ่มลอยมุมขวาล่าง: LINE สีเขียว + WhatsApp สีเขียว
- ซ่อนในหน้า admin และ tools
- แก้ไขเบอร์ WhatsApp: `https://wa.me/66812345678` (เปลี่ยนเป็นเบอร์จริง)
- แก้ LINE: `https://line.me/R/ti/p/@inongtravel` (เปลี่ยนเป็น LINE ID จริง)

### 5. Slip Upload บันทึกจริง ✅
- ไฟล์: booking.html, assets/js/admin.js
- เพิ่มตัวแปร `slipData` เก็บ base64 ของสลิป
- จำกัดขนาดไฟล์ไม่เกิน 2MB
- บันทึกลง Firestore field `slipImage`
- Admin ดูสลิปได้ใน booking detail modal

## งานที่แก้ก่อนหน้า
- แก้ปุ่มธีม (toggleTheme ถูกเรียก 2 ครั้ง)
- เปลี่ยน &#3645; → ฿ ทุกจุด

## สิ่งที่ต้องทำต่อ (Quick Win)
1. เปลี่ยนเบอร์ WhatsApp/LINE ให้เป็นข้อมูลจริง
2. Deploy firestore.rules ด้วย `firebase deploy --only firestore:rules`
3. ทดสอบเข้า tools/ ว่าต้องใส่รหัสผ่าน
4. ทดสอบจองทัวร์ + อัพโหลดสลิป
5. ทดสอบปุ่ม LINE/WhatsApp ว่าลิงก์ถูกต้อง
