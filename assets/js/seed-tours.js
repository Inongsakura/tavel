/* inongtravel - Setup: เพิ่มข้อมูลทัวร์ลง Firebase Firestore */
/* วิธีใช้: 
   1. เปิดเว็บ inongtravel ในเบราว์เซอร์
   2. กด F12 เปิด Developer Tools
   3. ไปที่แท็บ Console
   4. paste โค้ดนี้แล้วกด Enter
*/

// ข้อมูลทัวร์ 10 รายการ
const TOUR_PACKAGES = [
  {
    id: 'ket1',
    code: '#ket1',
    name: 'เกาะลันตา ทรายสีทอง',
    country: 'ประเทศไทย',
    type: 'beach',
    price: 2900,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80',
    description: 'เกาะลันตา หาดทรายขาว น้ำทะเลใส ดำน้ำดูปะการัง',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mui1',
    code: '#mui1',
    name: 'เกาะสมุย รีแล็กซ์',
    country: 'ประเทศไทย',
    type: 'beach',
    price: 9900,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=800&q=80',
    description: 'เกาะสวรรค์กลางอ่าวไทย หาดทรายขาว น้ำทะเลใส',
    createdAt: new Date().toISOString()
  },
  {
    id: 'lak1',
    code: '#lak1',
    name: 'เขาหลัก ธรรมชาติ',
    country: 'ประเทศไทย',
    type: 'mountain',
    price: 8500,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    description: 'ธรรมชาติบริสุทธิ์ ภูเขา น้ำตก ป่าชายเลน',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yai1',
    code: '#yai1',
    name: 'เขาใหญ่ แคมป์ปิ้ง',
    country: 'ประเทศไทย',
    type: 'mountain',
    price: 5900,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    description: 'อุทยานแห่งชาติเขาใหญ่ สัตว์ป่า น้ำตก แคมป์ไฟ',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bkk1',
    code: '#bkk1',
    name: 'กรุงเทพฯ วัฒนธรรม',
    country: 'ประเทศไทย',
    type: 'city',
    price: 6900,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    description: 'วัดพระแก้ว วัดโพธิ์ เกาะรัตนโกสินทร์ เยาวราช',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cm1',
    code: '#cm1',
    name: 'เชียงใหม่ ล้านนา',
    country: 'ประเทศไทย',
    type: 'city',
    price: 8900,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
    description: 'ดอยสุเทพ ถนนคนเดิน ปางช้าง ดอยอินทนนท์',
    createdAt: new Date().toISOString()
  },
  {
    id: 'uri1',
    code: '#uri1',
    name: 'อุตรดิตถ์ สุโขทัย',
    country: 'ประเทศไทย',
    type: 'city',
    price: 4500,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80',
    description: 'อดีตเมืองหลวง สุโขทัย อุตรดิตถ์ ประวัติศาสตร์',
    createdAt: new Date().toISOString()
  },
  {
    id: 'lpe1',
    code: '#lpe1',
    name: 'เกาะหลีเป๊ะ ดำน้ำ',
    country: 'ประเทศไทย',
    type: 'adventure',
    price: 15900,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    description: 'เกาะสวรรค์ปลายแดน น้ำทะเลใส ปะการังสวย',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ves1',
    code: '#ves1',
    name: 'มัลดีฟส์ พาราไดซ์',
    country: 'มัลดีฟส์',
    type: 'beach',
    price: 38900,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    description: 'วิลล่ากลางน้ำ ดำน้ำดูปะการัง ล่องเรือชมพระอาทิตย์ตก',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ali1',
    code: '#ali1',
    name: 'บาหลี สวรรค์',
    country: 'อินโดนีเซีย',
    type: 'beach',
    price: 22900,
    seats: 3,
    status: 'พร้อม',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'วัดโบราณ นาข้าวขั้นบันได ชายหาดสวย',
    createdAt: new Date().toISOString()
  }
];

// ฟังก์ชันอัพโหลดขึ้น Firestore
async function uploadTourPackages() {
  console.log('🔄 กำลังอัพโหลดข้อมูลทัวร์ 10 รายการ...');
  let success = 0;
  let failed = 0;
  
  for (const pkg of TOUR_PACKAGES) {
    try {
      await db.collection('tour_packages').doc(pkg.id).set({
        code: pkg.code,
        name: pkg.name,
        country: pkg.country,
        type: pkg.type,
        price: pkg.price,
        seats: pkg.seats,
        status: pkg.status,
        image: pkg.image,
        description: pkg.description,
        createdAt: pkg.createdAt,
        updatedAt: pkg.createdAt
      });
      success++;
      console.log(`✓ ${pkg.code} - ${pkg.name}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${pkg.code} - ${pkg.name}: ${e.message}`);
    }
  }
  
  console.log('');
  console.log('========================================');
  console.log(`✅ อัพโหลดเสร็จสิ้น: ${success}/${TOUR_PACKAGES.length} รายการ`);
  if (failed > 0) {
    console.log(`❌ ล้มเหลว: ${failed} รายการ`);
  }
  console.log('========================================');
  console.log('');
  console.log('เปิด Firebase Console เพื่อดูข้อมูล:');
  console.log('https://console.firebase.google.com/project/inong-56c0f/firestore');
}

// รันอัพโหลด
uploadTourPackages();
