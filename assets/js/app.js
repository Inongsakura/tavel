/* inongtravel - Frontend JS */
// Initialize Firebase
const firebaseConfig={apiKey:"AIzaSyAayCwC0UTVyISsKrNDNYdzGnQeFHpawAc",authDomain:"inong-56c0f.firebaseapp.com",projectId:"inong-56c0f",storageBucket:"inong-56c0f.firebasestorage.app",messagingSenderId:"838153924370",appId:"1:838153924370:web:7a133b12866b6671f84dcb"};

// Initialize Firebase - wait for SDK to load
function initFirebase(){
  if(typeof firebase!=='undefined' && typeof firebase.initializeApp==='function'){
    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
    return true;
  }
  return false;
}

// Try to initialize immediately, or wait
let db=null;
let auth=null;

function initFirestore(){
  if(initFirebase()){
    db=firebase.firestore();
    auth=firebase.auth();
    console.log('Firebase initialized successfully');
    return true;
  }
  return false;
}

// Try initialization
if(!initFirestore()){
  // If Firebase not loaded yet, wait and retry
  const checkFirebase=setInterval(()=>{
    if(initFirestore()){
      clearInterval(checkFirebase);
      // Trigger any pending operations
      document.dispatchEvent(new Event('firebase-ready'));
    }
  },100);
  // Stop checking after 5 seconds
  setTimeout(()=>clearInterval(checkFirebase),5000);
}

/* ===== LOADING UTILITIES ===== */
function showLoading(container, message='กำลังโหลด...'){
  if(!container) return;
  container.innerHTML=`<div class="loading-spinner"><div class="spinner"></div><div class="loading-text">${message}</div></div>`;
}

function showSkeleton(container, count=6){
  if(!container) return;
  let html='';
  for(let i=0;i<count;i++){
    html+=`<div class="skeleton skeleton-card"></div>`;
  }
  container.innerHTML=html;
}

function hideLoading(container){
  if(!container) return;
  const spinner=container.querySelector('.loading-spinner');
  if(spinner) spinner.remove();
}

function showButtonLoading(btn, loadingText='กำลังดำเนินการ...'){
  if(!btn) return;
  btn.dataset.originalHtml=btn.innerHTML;
  btn.innerHTML=`<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
  btn.disabled=true;
}

function hideButtonLoading(btn){
  if(!btn) return;
  if(btn.dataset.originalHtml){
    btn.innerHTML=btn.dataset.originalHtml;
    btn.disabled=false;
  }
}

/* ===== IMAGE ERROR HANDLING ===== */
const DEFAULT_IMAGES = {
  tour: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#1a1a2e" width="400" height="300"/><text fill="#666" x="200" y="140" text-anchor="middle" font-size="14">ไม่มีรูปภาพ</text><text fill="#444" x="200" y="165" text-anchor="middle" font-size="12">No Image Available</text></svg>'),
  hero: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect fill="#0b0b0f" width="1600" height="900"/><text fill="#333" x="800" y="450" text-anchor="middle" font-size="24">INONGTRAVEL</text></svg>'),
  avatar: 'https://ui-avatars.com/api/?name=U&background=c9a96e&color=fff&size=80',
  tourCard: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a2e"/><stop offset="100%" style="stop-color:#0f3460"/></linearGradient></defs><rect fill="url(#g)" width="400" height="300"/><circle cx="200" cy="120" r="40" fill="none" stroke="#c9a96e" stroke-width="2" opacity="0.3"/><text fill="#c9a96e" x="200" y="125" text-anchor="middle" font-size="24">✈</text><text fill="#666" x="200" y="180" text-anchor="middle" font-size="12">รอรูปภาพ</text></svg>')
};

function handleImageError(img, type='tour') {
  if(img.dataset.errorHandled) return;
  img.dataset.errorHandled = 'true';
  img.classList.add('error');

  const fallback = DEFAULT_IMAGES[type] || DEFAULT_IMAGES.tour;

  if(type === 'avatar') {
    // For avatars, use ui-avatars
    const name = img.alt || 'U';
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c9a96e&color=fff&size=80`;
  } else {
    img.src = fallback;
  }
}

function setupImageErrorHandling() {
  // Handle all images on page
  document.querySelectorAll('img').forEach(img => {
    if(img.dataset.errorHandled) return;

    img.addEventListener('load', function() {
      this.classList.remove('loading');
      this.classList.add('loaded');
    });

    img.addEventListener('error', function() {
      let type = 'tour';
      if(this.closest('.hero')) type = 'hero';
      else if(this.closest('.user-avatar') || this.classList.contains('user-avatar')) type = 'avatar';
      else if(this.closest('.tour-card-img')) type = 'tourCard';
      handleImageError(this, type);
    });
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', setupImageErrorHandling);

// MutationObserver to handle dynamically added images
const imageObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if(node.nodeType === 1) {
        if(node.tagName === 'IMG') {
          setupImageErrorHandling();
        }
        node.querySelectorAll?.('img')?.forEach(img => {
          setupImageErrorHandling();
        });
      }
    });
  });
});

imageObserver.observe(document.body, { childList: true, subtree: true });

/* ===== 20+ TOURS (with packages, excludes, itinerary) ===== */
const TOURS=[
{id:'phuket1',name:'ภูเก็ต พาราไดซ์',country:'ประเทศไทย',type:'beach',price:12900,nights:4,rating:4.9,reviews:89,badge:'hot',desc:'สัมผัสหาดทรายขาวน้ำทะเลใส ดำน้ำดูปะการัง เที่ยวเกาะพีพี',images:['https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:12900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรมริมหาด 3 คืน','อาหารเช้าทุกวัน','ทัวร์เกาะพีพี Full Day','ดำน้ำตื้น 2 ครั้ง'],itinerary:[{day:'วันที่ 1',title:'เดินทางถึงภูเก็ต',desc:'รับที่สนามบิน รถตู้ร่วม เช็คอินโรงแรม 3 ดาว เย็นอิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'ทัวร์เกาะพีพี (เรือร่วม)',desc:'08:00 รถมารับ สปีดโบ๊ทร่วมสู่เกาะพีพี ดำน้ำอ่าวมาหยา อาหารกลางวันบุฟเฟ่ต์บนเรือ',meals:'อาหารกลางวัน: บุฟเฟ่ต์บนเรือ'},{day:'วันที่ 3',title:'อิสระ',desc:'พักผ่อนตามอิสระ หรือซื้อทัวร์เสริม',meals:'อาหารเช้า: โรงแรม'},{day:'วันที่ 4',title:'กลับ',desc:'เช็คเอาท์ ส่งสนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:18900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรมริมหาด 4 ดาว 3 คืน','อาหาร 3 มื้อทุกวัน','ทัวร์เกาะพีพี Speedboat','ดำน้ำตื้น 2 ครั้ง','ล่องเรือ sunset'],itinerary:[{day:'วันที่ 1',title:'เดินทางถึงภูเก็ต',desc:'รับที่สนามบิน รถตู้ส่วนตัว เช็คอินโรงแรม 4 ดาว ocean view บ่ายเล่นสระ เย็น dinner ริมหาด',meals:'อาหารเย็น: ซีฟู้ดริมหาด'},{day:'วันที่ 2',title:'ทัวร์เกาะพีพี (Speedboat)',desc:'07:30 รถมารับ Speedboat ส่วนตัว เกาะพีพี อ่าวมาหยา ดำน้ำ อาหารกลางวันซีฟู้ดบนเรือ',meals:'อาหารกลางวัน: ซีฟู้ดบน Speedboat'},{day:'วันที่ 3',title:'ดำน้ำ & Sunset Cruise',desc:'เช้าดำน้ำเกาะรายา บ่ายพักผ่อน 16:00 Sunset Cruise ล่องเรือชมพระอาทิตย์ตก',meals:'อาหารเย็น: dinner บนเรือ sunset'},{day:'วันที่ 4',title:'กลับ',desc:'เช็คเอาท์ ซื้อของฝาก ส่งสนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:25900,desc:'โรงแรม 5 ดาว อาหารครบ บริการ VIP',includes:['โรงแรมริมหาด 5 ดาว 3 คืน','อาหารครบทุกมื้อ','Private Speedboat','ดำน้ำลึก + ตื้น','ล่องเรือ sunset Private','สปา 1 ชม.','รถรับส่งสนามบิน'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'รถ Limousine รับ VIP เช็อินโรงแรม 5 ดาว pool villa Welcome fruit basket เย็น Fine dining ริมทะเล private',meals:'อาหารเย็น: Fine dining Private'},{day:'วันที่ 2',title:'Private Boat Tour',desc:'08:00 Private Speedboat ส่วนตัว เกาะพีพี อ่าวมาหยา ดำน้ำลึก + ตื้น Private Guide อาหารกลางวันบนเรือ',meals:'อาหารกลางวัน: Private Lunch on boat'},{day:'วันที่ 3',title:'Spa & Private Sunset',desc:'09:00 อาหารเช้า floating breakfast 10:00 Spa 1 ชม. บ่ายพักผ่อน pool villa 16:00 Private Sunset Yacht',meals:'อาหารเย็น: Private dinner บน Yacht'},{day:'วันที่ 4',title:'VIP Farewell',desc:'เช็คเอาท์ Late checkout 14:00 รถ Limousine ส่งสนามบิน',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน','ประกันเดินทาง','ค่าใช้จ่ายส่วนตัว'],itinerary:[{day:'วันที่ 1',title:'เดินทางถึงภูเก็ต',desc:'รับที่สนามบิน เช็คอินโรงแรมริมหาดกะตะ วิวทะเล เย็นซีฟู้ดบาร์บีคิวริมหาด',meals:'อาหารเย็น: ซีฟู้ดบาร์บีคิว'},{day:'วันที่ 2',title:'ทัวร์เกาะพีพี',desc:'สปีดโบ๊ทสู่เกาะพีพี ดำน้ำอ่าวมาหยา อาหารกลางวันบนเกาะ เล่นน้ำหาด',meals:'อาหารกลางวัน: บุฟเฟ่ต์ซีฟู้ดบนเรือ'},{day:'วันที่ 3',title:'ดำน้ำ & ล่องเรือ',desc:'เช้าดำน้ำเกาะรายา ชมฝูงปลา บ่ายล่องเรืออ่าวพังงา เกาะเจมส์บอนด์',meals:'อาหารกลางวัน: ข้าวมันไก่ภูเก็ต'},{day:'วันที่ 4',title:'เที่ยวเมือง & กลับ',desc:'เช้าเมืองเก่าภูเก็ต ตึกชิโน-โปรตุกีส บ่ายซื้อของฝาก ส่งสนามบิน',meals:'อาหารเช้า: ติ่มซำ'}]},
{id:'samui1',name:'เกาะสมุย รีแล็กซ์',country:'ประเทศไทย',type:'beach',price:9900,nights:3,rating:4.8,reviews:67,badge:'',desc:'เกาะสวรรค์กลางอ่าวไทย หาดทรายขาว น้ำทะเลใส',images:['https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=800&q=80','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80','https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:9900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรมบูทีค 2 คืน','อาหารเช้า','ทัวร์ 4 เกาะ']},{tier:'deluxe',name:'แพ็กเกจหรู',price:14900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรมบูทีค 4 ดาว 2 คืน','อาหาร 3 มื้อ','ทัวร์ 4 เกาะ Speedboat','นวดไทย 1 ชม.']},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:21900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาวริมหาด 2 คืน','อาหารครบทุกมื้อ','Private Boat Tour 4 เกาะ','สปา 2 ชม.','Private dinner ริมทะเล']}],excludes:['ตั๋วเครื่องบิน','ค่าใช้จ่ายส่วนตัว'],itinerary:[{day:'วันที่ 1',title:'ถึงสมุย',desc:'เรือเฟอร์รี่ เช็คอินโรงแรม บ่ายเล่นน้ำหาดเฉวง เย็นชมพระอาทิตย์ตก',meals:'อาหารเย็น: ร้านอาหารริมหาด'},{day:'วันที่ 2',title:'ทัวร์ 4 เกาะ',desc:'ออกเรือ 09:00 เกาะมัดสุม ดำน้ำ เกาะหินงาม เกาะวัวตาหลับ',meals:'อาหารกลางวัน: บนเรือ'},{day:'วันที่ 3',title:'เที่ยวรอบเกาะ & กลับ',desc:'เช้านวดไทยสปา บ่ายวัดพระใหญ่ น้ำตกหน้าเมือง เรือกลับ',meals:'อาหารเช้า: 早餐'}]},
{id:'khaolak1',name:'เขาหลัก ธรรมชาติ',country:'ประเทศไทย',type:'mountain',price:8500,nights:3,rating:4.7,reviews:45,badge:'new',desc:'ธรรมชาติบริสุทธิ์ ภูเขา น้ำตก ป่าชายเลน',images:['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:8500,desc:'รีสอร์ท 3 ดาว อาหารเช้า',includes:['รีสอร์ทหรู 2 คืน','อาหารเช้า','ล่องแก่ง']},{tier:'deluxe',name:'แพ็กเกจหรู',price:12900,desc:'รีสอร์ท 4 ดาว อาหาร 3 มื้อ',includes:['รีสอร์ท 4 ดาว 2 คืน','อาหาร 3 มื้อ','ล่องแก่ง 3 ชม.','พายคายัคป่าชายเลน']},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:18900,desc:'รีสอร์ท 5 ดาว อาหารครบ VIP',includes:['รีสอร์ท 5 ดาว 2 คืน','อาหารครบทุกมื้อ','Private Tour ล่องแก่ง','พายคายัคป่าชายเลน','สปา 1 ชม.','รถรับส่ง']}],excludes:['ค่าเดินทาง','ค่าใช้จ่ายส่วนตัว'],itinerary:[{day:'วันที่ 1',title:'ถึงเขาหลัก',desc:'ขับรถจากภูเก็ต 1.5 ชม. เช็คอินรีสอร์ท บ่ายเดินป่า nature trail',meals:'อาหารเย็น: บาร์บีคิวริมสระ'},{day:'วันที่ 2',title:'ล่องแก่ง & น้ำตก',desc:'เช้าล่องแก่งแม่น้ำพังงา 3 ชม. บ่ายน้ำตกวังช้าง',meals:'อาหารกลางวัน: ข้าวซอย'},{day:'วันที่ 3',title:'ป่าชายเลน & กลับ',desc:'เช้าล่องเรือป่าชายเลน ชมนก ลิง ปู บ่ายกลับ',meals:'อาหารเช้า: ไข่กระทะ'}]},
{id:'khaoyai1',name:'เขาใหญ่ แคมป์ปิ้ง',country:'ประเทศไทย',type:'mountain',price:5900,nights:2,rating:4.6,reviews:52,badge:'',desc:'อุทยานแห่งชาติเขาใหญ่ สัตว์ป่า น้ำตก แคมป์ปิ้ง',images:['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80','https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80','https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:5900,desc:'แคมป์ปกติ อาหาร 3 มื้อ',includes:['แคมป์ 1 คืน','อาหาร 3 มื้อ','เดินป่า 2 กม.']},{tier:'deluxe',name:'แพ็กเกจหรู',price:8900,desc:'แคมป์หรู อาหารครบ',includes:['แคมป์หรู 1 คืน','อาหาร 3 มื้อ Premium','เดินป่า 2 กม.','แคมป์ไฟ & ดูดาว']},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:14900,desc:' Luxury Camp ส่วนตัว',includes:['Luxury Camp ส่วนตัว 1 คืน','อาหารครบทุกมื้อ Private','เดินป่า Private Guide','แคมป์ไฟ & ดูดาว','สปา 1 ชม.','รถรับส่ง กทม.']}],excludes:['ค่าเดินทาง'],itinerary:[{day:'วันที่ 1',title:'ถึงเขาใหญ่ & เดินป่า',desc:'09:00 ถึงอุทยาน เช็คอินแคมป์ 10:30 เดินป่า 2 กม. เย็นแคมป์ไฟ ดูดาว',meals:'อาหารเย็น: หมูกระทะแคมป์ไฟ'},{day:'วันที่ 2',title:'ดูสัตว์ & กลับ',desc:'05:30 ตื่นดูสัตว์ป่า ชมช้าง กวาง เก้ง บ่ายจุดชมวิว กลับ กทม.',meals:'อาหารเช้า: ข้าวต้ม'}]},
{id:'bkk1',name:'กรุงเทพฯ วัฒนธรรม',country:'ประเทศไทย',type:'city',price:6900,nights:3,rating:4.7,reviews:78,badge:'popular',desc:'วัดพระแก้ว วัดโพธิ์ เกาะรัตนโกสินทร์ เยาวราช',images:['https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80','https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80','https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:6900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 2 คืน','อาหารเช้า','ทัวร์วัดพระแก้ว']},{tier:'deluxe',name:'แพ็กเกจหรู',price:12900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรม 4 ดาว 2 คืน','อาหาร 3 มื้อ','ทัวร์วัดพระแก้ว Full Day','ล่องเรือเจ้าพระยา']},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:22900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 2 คืน','อาหารครบทุกมื้อ Private','Private Tour วัดพระแก้ว','Private Dinner Cruise','สปา 1 ชม.','รถรับส่ง']}],excludes:['ตั๋วเครื่องบิน','ค่าใช้จ่ายส่วนตัว'],itinerary:[{day:'วันที่ 1',title:'เกาะรัตนโกสินทร์',desc:'ทัวร์วัดพระแก้ว วัดโพธิ์ บ่ายสนามหลวง เย็น dinner rooftop',meals:'อาหารเย็น: อาหารไทย fine dining'},{day:'วันที่ 2',title:'ตลาดน้ำ & ล่องเรือ',desc:'ทัวร์ตลาดน้ำอโยธยา บ่ายล่องเรือเจ้าพระยา sunset dinner cruise',meals:'อาหารกลางวัน: ก๋วยเตี๋ยวเรือ'},{day:'วันที่ 3',title:'เยาวราช & กลับ',desc:'เช้าเที่ยวเยาวราช ไหว้พระวัดไตรมิตร บ่ายช้อปปิ้ง ตอนเย็นกลับ',meals:'อาหารเช้า: ติ่มซำ'}]},
{id:'chiangmai1',name:'เชียงใหม่ ล้านนา',country:'ประเทศไทย',type:'city',price:8900,nights:4,rating:4.8,reviews:92,badge:'hot',desc:'ดอยสุเทพ ถนนคนเดิน ปางช้าง ดอยอินทนนท์',images:['https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80','https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:8900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรมบูทีค 3 คืน','อาหารเช้า 4 มื้อ','ทัวร์ดอยสุเทพ'],itinerary:[{day:'วันที่ 1',title:'ถึงเชียงใหม่',desc:'สนามบิน รถตู้ร่วม เช็อินโรงแรม 3 ดาว ถนนคนเดิน dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'ดอยสุเทพ (รถร่วม)',desc:'07:00 รถบัสมารับ ขึ้นดอยสุเทพ วัดพระธาตุ วิวเมือง',meals:'อาหารกลางวัน: ข้าวซอย'},{day:'วันที่ 3',title:'อิสระ',desc:'พักผ่อนตามอิสระ หรือซื้อทัวร์เสริม',meals:'อาหารเช้า: โรงแรม'},{day:'วันที่ 4',title:'กลับ',desc:'เช็คเอาท์ ซื้อของฝาก สนามบิน',meals:'อาหารเช้า: โจ๊ก'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:15900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรมบูทีค 4 ดาว 3 คืน','อาหาร 3 มื้อทุกวัน','ทัวร์ดอยสุเทพ Private','ปางช้าง 1 ชม.','ทำอาหารเหนือ'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'สนามบิน รถตู้ส่วนตัว เช็อินโรงแรม 4 ดาว dinner ข้าวซอยลุงปั้น',meals:'อาหารเย็น: ข้าวซอย + ไส้อั่ว'},{day:'วันที่ 2',title:'ดอยสุเทพ & ปางช้าง',desc:'Private Guide ขึ้นดอยสุเทพ ปางช้าง ขี่ช้าง 1 ชม. บ่ายทำอาหารเหนือ',meals:'อาหารกลางวัน: แกงฮังเล + น้ำพริกอ่อง'},{day:'วันที่ 3',title:'ดอยอินทนนท์',desc:'Private Car ขึ้นดอยอินทนนท์ น้ำตกแม่ยะ night safari',meals:'อาหารกลางวัน: ร้านอาหารบนดอย'},{day:'วันที่ 4',title:'คาเฟ่ & กลับ',desc:'เช้าคาเฟ่ Ristr8to บ่ายซื้อของฝาก สนามบิน',meals:'อาหารเช้า: โจ๊ก'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:28900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 3 คืน','อาหารครบทุกมื้อ Private','Private Guide + Car ทุกวัน','ปางช้าง Private','ทำอาหารเหนือ Private','Spa 2 ชม.'],itinerary:[{day:'วันที่ 1',title:'Luxury Welcome',desc:'สนามบิน Private Limousine เช็อินโรงแรม 5 ดาว suite welcome dinner Fine dining',meals:'อาหารเย็น: Fine dining Northern Thai'},{day:'วันที่ 2',title:'Private Culture',desc:'Private Guide + Driver ดอยสุเทพ ปางช้าง Private ทำอาหารเหนือ private class',meals:'อาหารกลางวัน: ทำเอง private'},{day:'วันที่ 3',title:'Doi Inthanon VIP',desc:'Private Car ดอยอินทนนท์ น้ำตก จุดชมวิว exclusive spa 2 ชม.',meals:'อาหารกลางวัน: Private lunch on mountain'},{day:'วันที่ 4',title:'Farewell',desc:'Late checkout คาเฟ่ ซื้อของฝาก Private transfer สนามบิน',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'kanchanaburi1',name:'กาญจนบุรี สายัณห์',country:'ประเทศไทย',type:'adventure',price:4500,nights:2,rating:4.5,reviews:38,badge:'',desc:'สะพานข้ามแม่น้ำแคว ทางรถไฟสายมรณะ น้ำตกเอราวัณ',images:['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:4500,desc:'รีสอร์ท 3 ดาว อาหาร 3 มื้อ',includes:['รีสอร์ท 3 ดาว 1 คืน','อาหาร 3 มื้อ','ทัวร์สะพานข้ามแม่น้ำแคว'],itinerary:[{day:'วันที่ 1',title:'สะพานข้ามแม่น้ำแคว',desc:'07:00 รถบัสมารับ กทม. 10:00 สะพานข้ามแม่น้ำแคว ทางรถไฟสายมรณะ บ่ายล่องแพไม้ไผ่',meals:'อาหารกลางวัน: ปลาทอดน้ำปลา'},{day:'วันที่ 2',title:'น้ำตกเอราวัณ & กลับ',desc:'08:00 น้ำตกเอราวัณ 7 ชั้น เล่นน้ำ 12:00 อาหารกลางวัน บ่ายกลับ กทม.',meals:'อาหารเช้า: ไข่กระทะ'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:7900,desc:'รีสอร์ท 4 ดาว อาหารครบ',includes:['รีสอร์ท 4 ดาว 1 คืน','อาหาร 3 มื้อ Premium','ทัวร์สะพานข้ามแม่น้ำแคว','ล่องแพไม้ไผ่ 2 ชม.'],itinerary:[{day:'วันที่ 1',title:'VIP Experience',desc:'07:00 รถตู้ส่วนตัว 10:00 สะพานข้ามแม่น้ำแคว Private guide บ่ายล่องแพ premium dinner ริมแม่น้ำ',meals:'อาหารเย็น: Seafood dinner ริมแม่น้ำ'},{day:'วันที่ 2',title:'น้ำตก & กลับ',desc:'08:00 น้ำตกเอราวัณ Private 12:00 อาหารกลางวัน premium บ่ายกลับ',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:14900,desc:'รีสอร์ท 5 ดาว อาหารครบ VIP',includes:['รีสอร์ท 5 ดาว 1 คืน','อาหารครบทุกมื้อ Private','Private Tour ทุกวัน','Private Boat Rafting','Spa 1 ชม.'],itinerary:[{day:'วันที่ 1',title:'Luxury Experience',desc:'Private Limousine Private guide สะพานข้ามแม่น้ำแคว Private boat rafting sunset dinner ริมแม่น้ำ',meals:'อาหารเย็น: Private dinner ริมแม่น้ำ'},{day:'วันที่ 2',title:'Spa & Farewell',desc:'เช้า Spa 1 ชม. น้ำตกเอราวัณ Private lunch บ่ายกลับ Private transfer',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ค่าเดินทางส่วนตัว'],itinerary:[]},
{id:'lipe1',name:'เกาะหลีเป๊ะ ดำน้ำ',country:'ประเทศไทย',type:'adventure',price:15900,nights:4,rating:4.9,reviews:56,badge:'premium',desc:'เกาะสวรรค์ปลายแดน น้ำทะเลใส ปะการังสวย',images:['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:15900,desc:'รีสอร์ท 3 ดาว อาหาร 3 มื้อ',includes:['รีสอร์ท 3 ดาว 3 คืน','อาหาร 3 มื้อ','ทัวร์ดำน้ำ 1 วัน'],itinerary:[{day:'วันที่ 1',title:'ถึงหลีเป๊ะ',desc:'สปีดโบ๊ทร่วม เช็อินรีสอร์ท บ่าย snorkeling เย็น walking street',meals:'อาหารเย็น: ปิ้งย่างริมหาด'},{day:'วันที่ 2',title:'ทัวร์ดำน้ำ (เรือร่วม)',desc:'เกาะรอก snorkeling จุดเดียว อาหารกลางวันบนเรือ',meals:'อาหารกลางวัน: บนเรือร่วม'},{day:'วันที่ 3',title:'อิสระ',desc:'พักผ่อนชายหาด snorkeling อิสระ sunset dinner',meals:'อาหารเย็น: ซีฟู้ดบาร์บีคิว'},{day:'วันที่ 4',title:'กลับ',desc:'เช็คเอาท์ สปีดโบ๊ทกลับ',meals:'อาหารเช้า: ไข่กระทะ'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:24900,desc:'รีสอร์ท 4 ดาว อาหารครบ',includes:['รีสอร์ท 4 ดาว 3 คืน','อาหาร 3 มื้อทุกวัน','ทัวร์ดำน้ำ 2 วัน','ตกปลาหมึก'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'Speedboat ส่วนตัว เช็อินรีสอร์ท 4 ดาว dinner ซีฟู้ดริมหาด',meals:'อาหารเย็น: Seafood dinner'},{day:'วันที่ 2',title:'ทัวร์ดำน้ำ 2 วัน (วันที่ 1)',desc:'Speedboat ส่วนตัว ดำน้ำเกาะรอก 2 จุด ตกปลาหมึก evening',meals:'อาหารกลางวัน: บนเรือส่วนตัว'},{day:'วันที่ 3',title:'ทัวร์ดำน้ำ (วันที่ 2)',desc:'เช้า snorkeling อ่าวพระอาทิตย์ บ่ายพักผ่อน sunset dinner',meals:'อาหารเย็น: Sunset dinner'},{day:'วันที่ 4',title:'กลับ',desc:'เช็คเอาท์ Speedboat ส่วนตัวกลับ',meals:'อาหารเช้า: floating breakfast'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:38900,desc:'รีสอร์ท 5 ดาว อาหารครบ VIP',includes:['รีสอร์ท 5 ดาว 3 คืน','อาหารครบทุกมื้อ Private','Private Speedboat ทุกวัน','Private Diving Guide','Spa 2 ชม.','Private Dinner'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'Private Speedboat VIP เช็อินรีสอร์ท 5 ดาว suite welcome dinner Private beach',meals:'อาหารเย็น: Private dinner ชายหาด'},{day:'วันที่ 2',title:'Private Diving Day 1',desc:'Private Speedboat + Dive Master ดำน้ำลึก 2 จุด + snorkeling private island lunch',meals:'อาหารกลางวัน: Private lunch on island'},{day:'วันที่ 3',title:'Spa & Sunset',desc:'เช้า Spa 2 ชม. บ่าย snorkeling private sunset dinner yacht',meals:'อาหารเย็น: Private dinner on yacht'},{day:'วันที่ 4',title:'VIP Departure',desc:'Late checkout Private Speedboat ส่งสนามบิน',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ค่าเดินทาง'],itinerary:[]},
{id:'maldives1',name:'มัลดีฟส์ พาราไดซ์',country:'มัลดีฟส์',type:'beach',price:38900,nights:4,rating:5.0,reviews:128,badge:'hot',desc:'วิลล่ากลางน้ำ ดำน้ำดูปะการัง ล่องเรือชมพระอาทิตย์ตก',images:['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80','https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80','https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:38900,desc:'Beach Villa อาหาร 3 มื้อ',includes:['Beach Villa 3 คืน','อาหาร 3 มื้อ','สปีดโบ๊ท','ดำน้ำตื้น'],itinerary:[{day:'วันที่ 1',title:'ถึงมัลดีฟส์',desc:'สปีดโบ๊ทร่วมสู่รีสอร์ท เช็คอิน Beach Villa บ่ายเล่นน้ำ เย็น dinner ริมทะเล',meals:'อาหารเย็น: buffet ริมทะเล'},{day:'วันที่ 2',title:'Snorkeling Tour',desc:'09:00 Snorkeling Tour 3 ชม. (เรือร่วม) บ่ายพักผ่อน เย็น dolphin cruise',meals:'อาหารกลางวัน: buffet'},{day:'วันที่ 3',title:'Island Hopping',desc:'09:00 Island Hopping Tour (เรือร่วม) เที่ยวเกาะท้องถิ่น ซื้อของที่ระลึก',meals:'อาหารกลางวัน: บนเรือ'},{day:'วันที่ 4',title:'กลับ',desc:'เช็คเอาท์ สปีดโบ๊ทสู่สนามบิน',meals:'อาหารเช้า: บุฟเฟ่ต์'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:58900,desc:'Water Villa อาหารครบ',includes:['Water Villa 3 คืน','อาหารครบทุกมื้อ','สปีดโบ๊ท','ดำน้ำตื้น + ลึก','สปาคู่รัก'],itinerary:[{day:'วันที่ 1',title:'Water Villa Welcome',desc:'สปีดโบ๊ทสู่รีสอร์ท เช็คอิน Water Villa floating breakfast เย็น dinner ริมทะเล',meals:'อาหารเย็น: Seafood dinner'},{day:'วันที่ 2',title:'Water Activities',desc:'08:00 Snorkeling + ดำน้ำลึก 2 จุด บ่าย spa คู่รัก 1 ชม. sunset dolphin cruise',meals:'อาหารกลางวัน: buffet'},{day:'วันที่ 3',title:'Private Beach',desc:'เช้า floating breakfast บ่ายพายเรือคายัค sunset dinner บนชายหาดส่วนตัว',meals:'อาหารเย็น: Beach dinner'},{day:'วันที่ 4',title:'กลับ',desc:'เช็คเอาท์ สปีดโบ๊ทสู่สนามบิน',meals:'อาหารเช้า: floating breakfast'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:89900,desc:'Water Villa Private Pool VIP',includes:['Water Villa Private Pool 3 คืน','อาหารครบทุกมื้อ Private','Private Speedboat','ดำน้ำ Private Guide','Spa 2 ชม.','Private Dinner ริมทะเล','Seaplane Transfer'],itinerary:[{day:'วันที่ 1',title:'VIP Arrival',desc:'Seaplane ส่วนตัว สู่รีสอร์ท เช็คอิน Water Villa Private Pool Welcome champagne เย็น Private beach dinner under the stars',meals:'อาหารเย็น: Private dinner'},{day:'วันที่ 2',title:'Private Diving & Spa',desc:'08:00 Private diving + snorkeling กับ guide ส่วนตัว บ่าย Spa treatment 2 ชม. sunset yacht cruise',meals:'อาหารกลางวัน: Private lunch on beach'},{day:'วันที่ 3',title:'Exclusive Experience',desc:'เช้า floating breakfast in private pool บ่าย private island trip BBQ lunch sunset fishing',meals:'อาหารเย็น: Private dinner on sandbank'},{day:'วันที่ 4',title:'VIP Departure',desc:'Late checkout Seaplane ส่วนตัว สู่สนามบิน',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[{day:'วันที่ 1',title:'ถึงมัลดีฟส์',desc:'สปีดโบ๊ทสู่รีสอร์ท เช็คอินวิลล่ากลางน้ำ เย็น dinner ริมทะเล',meals:'อาหารเย็น: fine dining ริมทะเล'},{day:'วันที่ 2',title:'ดำน้ำ & สปา',desc:'เช้า snorkeling 3 ชม. บ่าย spa sunset dolphin cruise',meals:'อาหารกลางวัน: บุฟเฟ่ต์'},{day:'วันที่ 3',title:'เกาะส่วนตัว',desc:'เช้าพายเรือคายัค บ่ายเที่ยวเกาะ เย็น private beach dinner',meals:'อาหารเย็น: private dinner'},{day:'วันที่ 4',title:'กลับ',desc:'เช้า floating breakfast สปีดโบ๊ทสู่สนามบิน',meals:'อาหารเช้า: floating breakfast'}]},
{id:'bali1',name:'บาหลี สวรรค์',country:'อินโดนีเซีย',type:'beach',price:22900,nights:5,rating:4.8,reviews:73,badge:'popular',desc:'วัดโบราณ นาข้าวขั้นบันได ชายหาดสวย',images:['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80','https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80','https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:22900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 4 คืน','อาหารเช้า 5 มื้อ','ทัวร์วัด & นาข้าว'],itinerary:[{day:'วันที่ 1',title:'ถึงบาหลี',desc:'สนามบิน รถร่วมส่ง Ubud เช็อิน dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'วัด & นาข้าว (รถร่วม)',desc:'08:00 รถบัสมารับ วัด Tirta Empul Tegallalang Rice Terrace',meals:'อาหารกลางวัน: บาร์บีคิว'},{day:'วันที่ 3',title:'Tanah Lot (รถร่วม)',desc:'เช้าอิสระ บ่าย Tanah Lot sunset',meals:'อาหารเย็น: อิสระ'},{day:'วันที่ 4',title:'อิสระ',desc:'พักผ่อนตามอิสระ หาด Seminyak',meals:'อาหารเช้า: โรงแรม'},{day:'วันที่ 5',title:'กลับ',desc:'เช็คเอาท์ สนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:38900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรมวิวนาข้าว 4 ดาว 4 คืน','อาหาร 3 มื้อทุกวัน','Private Tour ทุกวัน','Experience ทำบาหลี','Spa 1 ชม.'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'สนามบิน Private transfer Ubud 4 ดาว dinner บาหลี fusion',meals:'อาหารเย็น: บาหลี fusion'},{day:'วันที่ 2',title:'Private Culture',desc:'Private Guide วัด Tirta Empul Tegallalang Rice Terrace Monkey Forest dinner',meals:'อาหารกลางวัน: Fine dining Ubud'},{day:'วันที่ 3',title:'Experience & Sunset',desc:'เช้าทำผ้าบาติก Private class บ่าย Tanah Lot sunset Kecak Dance',meals:'อาหารเย็น: Seafood Jimbaran'},{day:'วันที่ 4',title:'Spa & Beach',desc:'เช้า Spa 1 ชม. บ่ายหาด Seminyak sunset dinner',meals:'อาหารเย็น: Italian restaurant'},{day:'วันที่ 5',title:'กลับ',desc:'Late checkout สนามบิน Private transfer',meals:'อาหารเช้า: floating breakfast'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:62900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 4 คืน','อาหารครบทุกมื้อ Private','Private Guide + Car ทุกวัน','Private Experience ทำบาหลี','Spa 2 ชม.','Private Dinner'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'สนามบิน Private Limousine Ubud 5 ดาว suite Private dinner วิวนาข้าว',meals:'อาหารเย็น: Private dinner วิวนาข้าว'},{day:'วันที่ 2',title:'Private Immersion',desc:'Private Guide + Driver วัด Private rice terrace walk Monkey Forest exclusive dinner',meals:'อาหารกลางวัน: Private lunch rice field'},{day:'วันที่ 3',title:'Exclusive Experience',desc:'เช้า Private cooking class บ่าย Tanah Lot Private sunset yacht dinner',meals:'อาหารเย็น: Private dinner on yacht'},{day:'วันที่ 4',title:'Spa & VIP',desc:'เช้า Spa 2 ชม. บ่าย beach club VIP sunset champagne dinner',meals:'อาหารเย็น: Fine dining beach club'},{day:'วันที่ 5',title:'VIP Departure',desc:'Late checkout Private Limousine สนามบิน',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'swiss1',name:'สวิตเซอร์แลนด์ แอลป์',country:'สวิตเซอร์แลนด์',type:'mountain',price:65900,nights:6,rating:4.9,reviews:96,badge:'hot',desc:'เทือกเขาแอลป์ รถไฟ Golden Pass ล่องเรือทะเลสาบ',images:['https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:65900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 5 คืน','อาหารเช้า 6 มื้อ','ตั๋วรถไฟ 7 วัน','Jungfraujoch'],itinerary:[{day:'วันที่ 1',title:'ถึงซูริค',desc:'รถไฟสู่ Interlaken เช็อิน dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'Jungfraujoch',desc:'รถไฟสู่ Jungfraujoch Top of Europe 3,454 ม.',meals:'อาหารกลางวัน: บนยอดเขา'},{day:'วันที่ 3',title:'อิสระ',desc:'พักผ่อน Interlaken หรือซื้อทัวร์เสริม',meals:'อาหารเช้า: โรงแรม'},{day:'วันที่ 4',title:'Golden Pass',desc:'นั่ง Golden Pass สู่ Montreux',meals:'อาหารกลางวัน: บนรถไฟ'},{day:'วันที่ 5',title:'Lake Lucerne',desc:'ล่องเรือ Lake Lucerne เที่ยว Luzern',meals:'อาหารกลางวัน: ร้านริมทะเลสาบ'},{day:'วันที่ 6',title:'กลับ',desc:'รถไฟสู่ซูริค สนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:98900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรม 4 ดาว 5 คืน','อาหาร 3 มื้อทุกวัน','ตั๋วรถไฟ Golden Pass','Jungfraujoch','Lake Lucerne Cruise'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'รถไฟสู่ Interlaken เช็อิน 4 ดาว วิวเทือกเขา dinner ร้านสวิส',meals:'อาหารเย็น: Swiss fondue'},{day:'วันที่ 2',title:'Jungfraujoch',desc:'รถไฟสู่ Jungfraujoch Snow Fun Park lunch บนยอดเขา',meals:'อาหารกลางวัน: บนยอดเขา'},{day:'วันที่ 3',title:'Golden Pass',desc:'Golden Pass Panoramic Interlaken - Montreux lunch บนรถไฟ',meals:'อาหารกลางวัน: บนรถไฟ Golden Pass'},{day:'วันที่ 4',title:'Lake Lucerne',desc:'ล่องเรือ Lake Lucerne เที่ยว Luzern Swiss Chocolate Workshop',meals:'อาหารกลางวัน: ร้านริมทะเลสาบ'},{day:'วันที่ 5',title:'Grindelwald',desc:'Grindelwald First Cliff Walk น้ำตก Trümmelbach',meals:'อาหารกลางวัน: ร้านบนภูเขา'},{day:'วันที่ 6',title:'กลับ',desc:'breakfast วิวแอลป์ ซื้อของฝาก สนามบิน',meals:'อาหารเช้า: Swiss breakfast'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:158900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 5 คืน','อาหารครบทุกมื้อ Private','First Class Train','Private Guide ทุกวัน','Private Lake Cruise','Spa 2 ชม.'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'รถไฟ First Class สู่ Interlaken เช็อิน 5 ดาว suite Private dinner วิวแอลป์',meals:'อาหารเย็น: Private Swiss dinner'},{day:'วันที่ 2',title:'Jungfraujoch VIP',desc:'Private train สู่ Jungfraujoch VIP lounge private guide lunch exclusive',meals:'อาหารกลางวัน: VIP restaurant top of Europe'},{day:'วันที่ 3',title:'Golden Pass Private',desc:'Private Golden Pass cabin lunch on train Montreux private tour',meals:'อาหารกลางวัน: Private dining on train'},{day:'วันที่ 4',title:'Lake Lucerne Private',desc:'Private yacht Lake Lucerne Private guide Luzern dinner lakeside',meals:'อาหารเย็น: Private dinner lakeside'},{day:'วันที่ 5',title:'Spa & Farewell',desc:'เช้า Spa 2 ชม. บ่าย Grindelwald private dinner farewell',meals:'อาหารเย็น: Private farewell dinner'},{day:'วันที่ 6',title:'VIP Departure',desc:'Late checkout ซื้อ Swiss chocolate Private transfer สนามบิน',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'japan1',name:'ญี่ปุ่น วัฒนธรรม',country:'ญี่ปุ่น',type:'city',price:84900,nights:7,rating:4.9,reviews:156,badge:'hot',desc:'โตเกียว เกียวโต โอซาก้า วัดโบราณ อาหาร Michelin',images:['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80','https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80','https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:84900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 6 คืน','อาหารเช้า 7 มื้อ','JR Pass 7 วัน'],itinerary:[{day:'วันที่ 1',title:'ถึงโตเกียว',desc:'JR Pass เช็อินชินจูกุ dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'โตเกียว (อิสระ)',desc:'Sensoji Asakusa Shibuya Crossing อาหารกลางวัน Michelin',meals:'อาหารกลางวัน: ซูชิ Michelin'},{day:'วันที่ 3',title:'โตเกียว (อิสระ)',desc:'Imperial Palace Ginza dinner อิสระ',meals:'อาหารเช้า: โรงแรม'},{day:'วันที่ 4',title:'เกียวโต',desc:'ชินคันเซ็นสู่เกียวโต วัด Kinkakuji ป่าไผ่',meals:'อาหารกลางวัน: Kaiseki'},{day:'วันที่ 5',title:'เกียวโต',desc:'Fushimi Inari วัด Kiyomizu Gion',meals:'อาหารกลางวัน: Tofu Kyoto'},{day:'วันที่ 6',title:'โอซาก้า',desc:'รถไฟสู่โอซาก้า Osaka Castle Dotonbori',meals:'อาหารกลางวัน: Okonomiyaki'},{day:'วันที่ 7',title:'กลับ',desc:'Dotonbori ซื้อของฝาก Kansai Airport',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:128900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรม 4 ดาว 6 คืน','อาหาร 3 มื้อทุกวัน','JR Pass Green Car','Private Guide ทุกวัน'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'JR Pass Green Car เช็อินชินจูกุ 4 ดาว dinner Michelin',meals:'อาหารเย็น: Michelin Ramen'},{day:'วันที่ 2',title:'Private Tokyo',desc:'Private Guide Sensoji Shibuya Akihabara Ginza dinner',meals:'อาหารกลางวัน: Sushi Michelin'},{day:'วันที่ 3',title:'Private Tokyo',desc:'Imperial Palace TeamLab Skytree dinner',meals:'อาหารเย็น: Yakiniku'},{day:'วันที่ 4',title:'Private Kyoto',desc:'Private Shinkansen วัด Kinkakuji ป่าไผ่ Private Kaiseki',meals:'อาหารกลางวัน: Private Kaiseki'},{day:'วันที่ 5',title:'Private Kyoto',desc:'Fushimi Inari Private Kiyomizu Gion dinner',meals:'อาหารกลางวัน: Tofu Private'},{day:'วันที่ 6',title:'Private Osaka',desc:'Private train Osaka Castle Dotonbori food tour',meals:'อาหารกลางวัน: Okonomiyaki'},{day:'วันที่ 7',title:'กลับ',desc:'Late checkout สนามบิน Private transfer',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:218900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 6 คืน','อาหารครบทุกมื้อ Michelin','First Class Shinkansen','Private Guide + Car ทุกวัน','Tea Ceremony Private','Geisha Dinner'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'First Class Shinkansen 5 ดาว suite Tokyo welcome dinner Michelin 3 ดาว',meals:'อาหารเย็น: Michelin 3 star'},{day:'วันที่ 2',title:'Private Tokyo VIP',desc:'Private guide + car ทุกที่ exclusive access dinner private',meals:'อาหารกลางวัน: Private sushi master'},{day:'วันที่ 3',title:'Private Tokyo VIP',desc:'TeamLab Private session Skytree VIP dinner',meals:'อาหารเย็น: Private kaiseki'},{day:'วันที่ 4',title:'Private Kyoto VIP',desc:'First Class Kyoto Private temple tour tea ceremony private',meals:'อาหารกลางวัน: Private tea ceremony lunch'},{day:'วันที่ 5',title:'Private Kyoto VIP',desc:'Private Fushimi Inari Gion geisha dinner',meals:'อาหารเย็น: Geisha dinner'},{day:'วันที่ 6',title:'Private Osaka VIP',desc:'Private Osaka Castle Dotonbori private food tour',meals:'อาหารกลางวัน: Private street food'},{day:'วันที่ 7',title:'VIP Departure',desc:'Late checkout Private transfer Kansai Airport',meals:'อาหารเช้า: 5 ดาว breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'dubai1',name:'ดูไบ หรูหรา',country:'สหรัฐอาหรับเอมิเรตส์',type:'city',price:42900,nights:4,rating:4.9,reviews:103,badge:'new',desc:'Burj Khalifa Desert Safari ดูไบ เมืองแห่งความหรูหรา',images:['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80','https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80','https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:42900,desc:'โรงแรม 4 ดาว อาหารเช้า',includes:['โรงแรม 4 ดาว 3 คืน','อาหารเช้า 4 มื้อ','ตั๋ว Burj Khalifa'],itinerary:[{day:'วันที่ 1',title:'ถึงดูไบ',desc:'สนามบิน รถร่วมส่ง Palm Jumeirah dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'Burj Khalifa & Mall',desc:'เช้า Dubai Mall บ่าย Burj Khalifa ชั้น 124',meals:'อาหารกลางวัน: ใน Mall'},{day:'วันที่ 3',title:'Desert Safari (รถร่วม)',desc:'บ่าย Desert Safari 4x4 dune bashing BBQ dinner',meals:'อาหารเย็น: Desert BBQ'},{day:'วันที่ 4',title:'Old Dubai & กลับ',desc:'เช้า Gold Souk บ่ายสนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:68900,desc:'โรงแรม 5 ดาว อาหาร 3 มื้อ',includes:['โรงแรม 5 ดาว 3 คืน','อาหาร 3 มื้อทุกวัน','Burj Khalifa At the Top SKY','Private Desert Safari','Marina Cruise'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'สนามบิน Private transfer Palm Jumeirah 5 ดาว dinner ริมทะเล',meals:'อาหารเย็น: Seafood dinner'},{day:'วันที่ 2',title:'Private City Tour',desc:'Private Guide Burj Khalifa SKY Dubai Mall Gold Souk dinner',meals:'อาหารกลางวัน: Arabic cuisine'},{day:'วันที่ 3',title:'Private Desert',desc:'Private Desert Safari 4x4 sunset dinner under stars',meals:'อาหารเย็น: Private desert dinner'},{day:'วันที่ 4',title:'Marina & Farewell',desc:'เช้า Marina Cruise breakfast yacht บ่ายสนามบิน',meals:'อาหารเช้า: Yacht breakfast'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:118900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['Burj Al Arab / Atlantis 3 คืน','อาหารครบทุกมื้อ Michelin','Private Guide + Car ทุกวัน','Burj Khalifa VIP','Private Desert Experience','Yacht Charter'],itinerary:[{day:'วันที่ 1',title:'Ultra Luxury',desc:'Private Limousine Burj Al Arab suite welcome champagne dinner Michelin',meals:'อาหารเย็น: Michelin dinner'},{day:'วันที่ 2',title:'Private VIP Tour',desc:'Private guide Burj Khalifa VIP access Gold Souk private dinner yacht',meals:'อาหารกลางวัน: Private Arabic feast'},{day:'วันที่ 3',title:'Private Desert VIP',desc:'Private luxury desert experience falcon show private dinner dunes',meals:'อาหารเย็น: Private dinner dunes'},{day:'วันที่ 4',title:'VIP Farewell',desc:'Private yacht charter breakfast helicopter transfer airport',meals:'อาหารเช้า: Private yacht breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'nz1',name:'นิวซีแลนด์ ผจญภัย',country:'นิวซีแลนด์',type:'adventure',price:92900,nights:8,rating:4.9,reviews:71,badge:'premium',desc:'Hobbiton Milford Sound Bungy Jump Queenstown',images:['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80','https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:92900,desc:'โรงแรม 3 ดาว เช่ารถ',includes:['โรงแรม 3 ดาว 7 คืน','เช่ารถ 8 วัน','Milford Sound Cruise'],itinerary:[{day:'วันที่ 1',title:'Auckland',desc:'รับรถ Auckland city tour dinner',meals:'อาหารเย็น: ร้าน Auckland'},{day:'วันที่ 2',title:'Hobbiton',desc:'ขับสู่ Hobbiton Movie Set',meals:'อาหารเย็น: ร้าน Matamata'},{day:'วันที่ 3',title:'Rotorua',desc:'Wai-O-Tapu thermal Māori show',meals:'อาหารเย็น: Hāngi dinner'},{day:'วันที่ 4',title:'Taupo',desc:'ล่องเรือ Taupo Huka Falls',meals:'อาหารกลางวัน: บนทางเดิน'},{day:'วันที่ 5',title:'Wellington',desc:'Te Papa Museum Cable Car',meals:'อาหารเย็น: Waterfront'},{day:'วันที่ 6',title:'Ferry สู่เกาะใต้',desc:'Cook Strait Kaikoura ชมปลาวาฬ',meals:'อาหารกลางวัน: Seafood'},{day:'วันที่ 7',title:'Queenstown',desc:'Skyline Gondola + Luge',meals:'อาหารเย็น: Fergburger'},{day:'วันที่ 8',title:'Milford & กลับ',desc:'Milford Sound Cruise สนามบิน',meals:'อาหารกลางวัน: บนเรือ'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:148900,desc:'โรงแรม 4 ดาว อาหารครบ',includes:['โรงแรม 4 ดาว 7 คืน','อาหาร 3 มื้อทุกวัน','เช่ารถ SUV','Milford Sound Cruise','Hobbiton Tour','Bungy Jump'],itinerary:[{day:'วันที่ 1',title:'VIP Auckland',desc:'รับรถ SUV Auckland city tour dinner',meals:'อาหารเย็น: Fine dining Auckland'},{day:'วันที่ 2',title:'Hobbiton VIP',desc:'Private Hobbiton tour Green Dragon dinner',meals:'อาหารเย็น: Hobbiton dinner'},{day:'วันที่ 3',title:'Rotorua VIP',desc:'Wai-O-Tapu Private Māori cultural experience',meals:'อาหารเย็น: Premium Hāngi'},{day:'วันที่ 4',title:'Taupo Adventure',desc:'Bungy Jump Taupo lake cruise Huka Falls',meals:'อาหารกลางวัน: lakeside restaurant'},{day:'วันที่ 5',title:'Wellington',desc:'Te Papa Private tour Cable Car dinner',meals:'อาหารเย็น: Waterfront premium'},{day:'วันที่ 6',title:'Ferry & Kaikoura',desc:'Premium ferry Kaikoura whale watch',meals:'อาหารกลางวัน: Seafood premium'},{day:'วันที่ 7',title:'Queenstown Adventure',desc:'Skyline Gondola + Luge jet boat',meals:'อาหารเย็น: Fine dining Queenstown'},{day:'วันที่ 8',title:'Milford & กลับ',desc:'Milford Sound Cruise luxury สนามบิน',meals:'อาหารกลางวัน: บนเรือ premium'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:248900,desc:'Lodge 5 ดาว อาหารครบ VIP',includes:['Lodge 5 ดาว 7 คืน','อาหารครบทุกมื้อ Private','Private Guide + Car ทุกวัน','Private Helicopter Milford','Private Hobbiton','Bungy Jump VIP','Queenstown Luxury'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'Private transfer Auckland Lodge 5 ดาว private dinner',meals:'อาหารเย็น: Private fine dining'},{day:'วันที่ 2',title:'Hobbiton Private',desc:'Private Hobbiton tour exclusive access private dinner',meals:'อาหารเย็น: Private dinner Hobbiton'},{day:'วันที่ 3',title:'Rotorua VIP',desc:'Private cultural experience helicopter scenic flight',meals:'อาหารเย็น: Private Hāngi experience'},{day:'วันที่ 4',title:'Adventure VIP',desc:'Private Bungy Jet boat helicopter Taupo',meals:'อาหารกลางวัน: Private lakeside'},{day:'วันที่ 5',title:'Wellington Private',desc:'Private tour Te Papa dinner exclusive',meals:'อาหารเย็น: Private Wellington dinner'},{day:'วันที่ 6',title:'Ferry VIP',desc:'Private ferry Kaikoura whale watch private',meals:'อาหารกลางวัน: Private seafood'},{day:'วันที่ 7',title:'Queenstown Luxury',desc:'Private Queenstown helicopter Milford Sound scenic',meals:'อาหารเย็น: Private Queenstown dinner'},{day:'วันที่ 8',title:'Milford Helicopter',desc:'Private helicopter Milford Sound landing return Auckland',meals:'อาหารกลางวัน: Private lunch'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'iceland1',name:'ไอซ์แลนด์ แสงเหนือ',country:'ไอซ์แลนด์',type:'adventure',price:57900,nights:5,rating:4.7,reviews:62,badge:'new',desc:'แสงเหนือ Aurora Blue Lagoon Crystal Ice Cave',images:['https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80','https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800&q=80','https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:57900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 4 คืน','อาหารเช้า 5 มื้อ','Blue Lagoon Standard'],itinerary:[{day:'วันที่ 1',title:'ถึงไอซ์แลนด์',desc:'KEF Airport รถร่วมส่ง Reykjavik dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'Golden Circle (รถร่วม)',desc:'Thingvellir Geysir Gullfoss รถบัสร่วม',meals:'อาหารกลางวัน: ซุปไอซ์แลนด์'},{day:'วันที่ 3',title:'Blue Lagoon',desc:'Blue Lagoon Standard 3 ชม.',meals:'อาหารเย็น: อิสระ'},{day:'วันที่ 4',title:'อิสระ',desc:'เที่ยว Reykjavik อิสระ',meals:'อาหารเช้า: โรงแรม'},{day:'วันที่ 5',title:'กลับ',desc:'สนามบิน KEF',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:89900,desc:'โรงแรม 4 ดาว อาหารครบ',includes:['โรงแรม 4 ดาว 4 คืน','อาหาร 3 มื้อทุกวัน','Blue Lagoon Premium','Crystal Ice Cave Tour','Northern Lights Tour 2 คืน'],itinerary:[{day:'วันที่ 1',title:'VIP Arrival',desc:'สนามบิน Private transfer Reykjavik 4 ดาว dinner ไอซ์แลนด์',meals:'อาหารเย็น: Icelandic cuisine'},{day:'วันที่ 2',title:'Golden Circle Private',desc:'Private guide Golden Circle Thingvellir Geysir Gullfoss',meals:'อาหารกลางวัน: ซุปไอซ์แลนด์'},{day:'วันที่ 3',title:'Ice Cave & Snorkeling',desc:'Super jeep Crystal Ice Cave Silfra snorkeling',meals:'อาหารกลางวัน: lamb soup'},{day:'วันที่ 4',title:'Blue Lagoon & Aurora',desc:'Blue Lagoon Premium evening Northern Lights tour',meals:'อาหารเย็น: Fine dining Reykjavik'},{day:'วันที่ 5',title:'กลับ',desc:'เที่ยว Reykjavik สนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:158900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 4 คืน','อาหารครบทุกมื้อ Michelin','Blue Lagoon Retreat','Private Ice Cave','Private Northern Lights','Private Guide + Car'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'Private transfer 5 ดาว suite welcome dinner Michelin',meals:'อาหารเย็น: Michelin dinner'},{day:'วันที่ 2',title:'Private Golden Circle',desc:'Private guide + car Golden Circle exclusive access',meals:'อาหารกลางวัน: Private Icelandic feast'},{day:'วันที่ 3',title:'Private Ice Adventure',desc:'Private super jeep ice cave private snorkeling Silfra',meals:'อาหารกลางวัน: Private lamb soup'},{day:'วันที่ 4',title:'Blue Lagoon VIP & Aurora',desc:'Blue Lagoon Retreat spa private Northern Lights chase',meals:'อาหารเย็น: Private fine dining'},{day:'วันที่ 5',title:'VIP Departure',desc:'Late checkout Private transfer airport',meals:'อาหารเช้า: Private breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'korea1',name:'เกาหลีใต้ วัฒนธรรม',country:'เกาหลีใต้',type:'city',price:32900,nights:5,rating:4.8,reviews:88,badge:'popular',desc:'โซล ปูซาน เกาะเชจู อาหารเกาหลี K-Pop',images:['https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80','https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80','https://images.unsplash.com/photo-1546870034-8f0b1f99b882?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:32900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 4 คืน','อาหารเช้า 4 มื้อ','ตั๋ว KTX','ทัวร์ DMZ'],itinerary:[{day:'วันที่ 1',title:'ถึงโซล',desc:'สนามบินอินชอน Airport Railroad สู่โซล รถบัสร่วมส่งโรงแรม เมียงดง dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'โซล City Tour (รถร่วม)',desc:'08:30 รถบัสมารับ พระราชวังชางด็อกกุง หมู่บ้านบุกชนฮันอก N Seoul Tower',meals:'อาหารกลางวัน: ไก่ทอดเกาหลี'},{day:'วันที่ 3',title:'DMZ Tour (รถร่วม)',desc:'ทัวร์ DMZ ชายแดน KTX สู่ปูซาน evening อิสระ',meals:'อาหารกลางวัน: บนรถ'},{day:'วันที่ 4',title:'เกาะเชจู (เที่ยวบินในประเทศ)',desc:'บินสู่เชจู ทัวร์รถบัสร่วม น้ำตก หาด จุดชมวิว',meals:'อาหารกลางวัน: หมูดำเชจู'},{day:'วันที่ 5',title:'กลับ',desc:'บินกลับโซล สนามบินอินชอน Duty Free',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:48900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรม 4 ดาว 4 คืน','อาหาร 3 มื้อทุกวัน','ตั๋ว KTX','ทัวร์ DMZ Private','Private Tour ปูซาน'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'สนามบินอินชอน รถตู้ส่วนตัว ส่งโรงแรม 4 ดาว Myeongdong dinner BBQ หมูย่าง',meals:'อาหารเย็น: BBQ หมูย่าง'},{day:'วันที่ 2',title:'Private Culture Tour',desc:'Private Guide พระราชวังชางด็อกกุง หมู่บ้านบุกชน Hanbok experience N Seoul Tower Gwangjang Market',meals:'อาหารกลางวัน: Bibimbap ต้นตำหรับ'},{day:'วันที่ 3',title:'DMZ & ปูซาน (Private)',desc:'Private tour DMZ KTX ส่วนตัวสู่ปูซาน หาดแฮอันแด อาหารทะเลปูซาน',meals:'อาหารเย็น: อาหารทะเลปูซาน'},{day:'วันที่ 4',title:'เชจู Private',desc:'บินสู่เชจู Private car ทัวร์ น้ำตก หาด หมู่บ้านวัฒนธรรม dinner',meals:'อาหารเย็น: หมูดำเชจู'},{day:'วันที่ 5',title:'กลับ',desc:'Late checkout บินกลับโซล Duty Free VIP',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:72900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 4 คืน','อาหารครบทุกมื้อ Private','ตั๋ว KTX ที่นั่ง First Class','Private Tour ทุกวัน','Hanbok Experience','K-Pop Dance Class','Nanta Show VIP'],itinerary:[{day:'วันที่ 1',title:'VIP Arrival',desc:'สนามบิน Private Limousine ส่งโรงแรม 5 ดาว suite welcome fruit เย็น Fine dining Korean royal cuisine',meals:'อาหารเย็น: Korean Royal Cuisine'},{day:'วันที่ 2',title:'Private Culture Immersion',desc:'Private Guide + Driver พระราชวัง Gyeongbokgung Hanbok experience ทำ bibimbap class เย็น Private dining',meals:'อาหารกลางวัน: ทำอาหารเกาหลีเอง'},{day:'วันที่ 3',title:'DMZ & Busan VIP',desc:'Private DMZ tour KTX First Class สู่ปูซาน Private car ทัวร์ปูซาน food tour',meals:'อาหารเย็น: Premium sashimi ปูซาน'},{day:'วันที่ 4',title:'เชจู Luxury',desc:'Private charter flight สู่เชจู Private guide + car ทัวร์ครบทุกจุด dinner luxury',meals:'อาหารเย็น: Jeju black pork premium'},{day:'วันที่ 5',title:'K-Pop & Farewell',desc:'เช้า K-Pop dance class บ่าย Nanta Show VIP สนามบิน Private Limousine',meals:'อาหารเช้า: โรงแรม'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'vietnam1',name:'เวียดนาม สวยๆ',country:'เวียดนาม',type:'city',price:15900,nights:4,rating:4.6,reviews:72,badge:'new',desc:'ฮานอย ฮาลองเบย์ ดานัง ฮอยอัน เมืองมรดกโลก',images:['https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80','https://images.unsplash.com/photo-1557750255-c76072377075?w=800&q=80','https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:15900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 3 คืน','อาหารเช้า 4 มื้อ','ล่องเรือฮาลองเบย์'],itinerary:[{day:'วันที่ 1',title:'ถึงฮานอย',desc:'สนามบิน รถร่วมส่ง Old Quarter dinner street food',meals:'อาหารเย็น: Bun Cha'},{day:'วันที่ 2',title:'ฮาลองเบย์ (เรือร่วม)',desc:'รถบัสร่วม ฮาลองเบย์ Cruise เรือร่วม',meals:'อาหารกลางวัน+เย็น: บนเรือ'},{day:'วันที่ 3',title:'ฮอยอัน',desc:'บินสู่ดานัง รถร่วมฮอยอัน dinner อิสระ',meals:'อาหารเย็น: อิสระ'},{day:'วันที่ 4',title:'กลับ',desc:'สนามบินดานัง บินกลับ',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:28900,desc:'โรงแรม 4 ดาว อาหารครบ',includes:['โรงแรม 4 ดาว 3 คืน','อาหาร 3 มื้อทุกวัน','Private Cruise ฮาลองเบย์','Private Tour ฮอยอัน'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'สนามบิน Private transfer Old Quarter 4 ดาว dinner Bun Cha',meals:'อาหารเย็น: Bun Cha premium'},{day:'วันที่ 2',title:'Private Cruise',desc:'Private Cruise ฮา.loop ถ้ำนางฟ้า private kayaking',meals:'อาหารกลางวัน+เย็น: Private on cruise'},{day:'วันที่ 3',title:'Private Hoi An',desc:'Private guide ฮอยอัน สะพานญี่ปุ่น private cooking class',meals:'อาหารเย็น: Private cooking'},{day:'วันที่ 4',title:'กลับ',desc:'Late checkout สนามบิน Private transfer',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:48900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 3 คืน','อาหารครบทุกมื้อ Private','Private Luxury Cruise','Private Guide ทุกวัน','Private Cooking Class','Spa'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'Private Limousine 5 ดาว suite welcome dinner Fine dining',meals:'อาหารเย็น: Fine dining Hanoi'},{day:'วันที่ 2',title:'Private Luxury Cruise',desc:'Private luxury cruise ฮาลองเบย์ private cabin dinner on deck',meals:'อาหารกลางวัน+เย็น: Private luxury'},{day:'วันที่ 3',title:'Private Hoi An VIP',desc:'Private guide + car ฮอยอัน private cooking spa',meals:'อาหารเย็น: Private dinner Hoi An'},{day:'วันที่ 4',title:'VIP Departure',desc:'Late checkout Private transfer airport',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'singapore1',name:'สิงคโปร์ เมืองสะอาด',country:'สิงคโปร์',type:'city',price:24900,nights:3,rating:4.8,reviews:56,badge:'hot',desc:'Marina Bay Sands Gardens by the Bay Sentosa อาหารมิชลิน',images:['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80','https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80','https://images.unsplash.com/photo-1546622891-02c72c1537b6?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:24900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 2 คืน','อาหารเช้า 2 มื้อ','ตั๋ว MRT 3 วัน','บัตร Gardens by the Bay'],itinerary:[{day:'วันที่ 1',title:'ถึงสิงคโปร์',desc:'สนามบินชางงี MRT สู่โรงแรม Gardens by the Bay light show dinner อิสระ Chinatown',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'Sentosa (รถบัสร่วม)',desc:'รถบัสมารับ เกาะเซ็นโตซ่า Universal Studios (บัตรไม่รวม) หรือเล่นน้ำหาด',meals:'อาหารกลางวัน: ใน Universal'},{day:'วันที่ 3',title:'City Tour & กลับ',desc:'MRT อิสระ Little India Kampong Glam Orchard Road สนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:39900,desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:['โรงแรม 4 ดาว 2 คืน','อาหาร 3 มื้อทุกวัน','ตั๋ว MRT 3 วัน','Universal Studios','ทัวร์ Sentosa Private'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'สนามบิน Private transfer ส่งโรงแรม 4 ดาว Marina Bay dinner ริมน้ำ',meals:'อาหารเย็น: Seafood dinner'},{day:'วันที่ 2',title:'Universal & Sentosa',desc:'Private car ทัวร์ Universal Studios เต็มวัน evening Sentosa beach dinner',meals:'อาหารกลางวัน: ใน Universal'},{day:'วันที่ 3',title:'City Tour Private',desc:'Private guide ทัวร์ Little India Kampong Glam Hawker Centre food tour สนามบิน',meals:'อาหารกลางวัน: Hawker Centre'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:62900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['Marina Bay Sands 2 คืน','อาหารครบทุกมื้อ Private','Private transfer ทุกวัน','Universal Studios VIP','Private City Tour','SkyPark Observation'],itinerary:[{day:'วันที่ 1',title:'Marina Bay Sands VIP',desc:'สนามบิน Private Limousine ส่ง Marina Bay Sands suite welcome champagne เย็น SkyBar dinner วิว 360°',meals:'อาหารเย็น: Fine dining SkyBar'},{day:'วันที่ 2',title:'Universal VIP',desc:'Private car ส่ง Universal Studios VIP access ไม่ต่อคิว evening private dinner Clarke Quay',meals:'อาหารกลางวัน: VIP lounge Universal'},{day:'วันที่ 3',title:'Private Tour & Farewell',desc:'Private guide + car ทัวร์ครบทุกจุด Hawker Centre Michelin food tour สนามบิน Private transfer',meals:'อาหารกลางวัน: Michelin food tour'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'phuket2',name:'ภูเก็ต โรแมนติก',country:'ประเทศไทย',type:'beach',price:18900,nights:5,rating:4.9,reviews:45,badge:'premium',desc:'Honeymoon ภูเก็ต วิลล่าส่วนตัว ดินเนอร์ริมทะเล',images:['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80','https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:18900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 4 คืน','อาหารเช้า 5 มื้อ','ทัวร์เกาะพีพี'],itinerary:[{day:'วันที่ 1',title:'ถึงภูเก็ต',desc:'สนามบิน รถร่วม hotel dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'เกาะพีพี (เรือร่วม)',desc:'Speedboat ร่วม เกาะพีพี snorkeling',meals:'อาหารกลางวัน: บนเรือ'},{day:'วันที่ 3',title:'เมืองเก่า',desc:'เมืองเก่าภูเก็ต ชิโนโปรตุกีส dinner อิสระ',meals:'อาหารเย็น: อิสระ'},{day:'วันที่ 4',title:'อิสระ',desc:'หาด พักผ่อน อิสระ',meals:'อาหารเช้า: โรงแรม'},{day:'วันที่ 5',title:'กลับ',desc:'สนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:32900,desc:'วิลล่า 4 ดาว อาหารครบ',includes:['วิลล่า 4 ดาว 4 คืน','อาหาร 3 มื้อทุกวัน','Private Boat Tour','Spa 1 ชม.'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'Private transfer วิลล่า dinner ริมทะเล',meals:'อาหารเย็น: Seafood dinner'},{day:'วันที่ 2',title:'Private Boat',desc:'Speedboat ส่วนตัว เกาะพีพี private snorkeling sunset',meals:'อาหารกลางวัน: Private on boat'},{day:'วันที่ 3',title:'Spa & Culture',desc:'Spa 1 ชม. เมืองเก่า dinner ริมทะเล',meals:'อาหารเย็น: Fine dining'},{day:'วันที่ 4',title:'Beach Day',desc:'หาดส่วนตัว พายเรือ BBQ',meals:'อาหารเย็น: Seafood BBQ'},{day:'วันที่ 5',title:'กลับ',desc:'Late checkout สนามบิน',meals:'อาหารเช้า: floating breakfast'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:58900,desc:'Pool Villa 5 ดาว อาหารครบ VIP',includes:['Pool Villa 5 ดาว 4 คืน','อาหารครบทุกมื้อ Private','Private Yacht Tour','Spa 2 ชม.','Private Dinner'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'Private Limousine Pool Villa welcome dinner private',meals:'อาหารเย็น: Private dinner villa'},{day:'วันที่ 2',title:'Private Yacht',desc:'Private Yacht เกาะพีพี private snorkeling lunch on deck',meals:'อาหารกลางวัน: Private yacht lunch'},{day:'วันที่ 3',title:'Spa & Culture VIP',desc:'Spa 2 ชม. Private guide เมืองเก่า sunset dinner beach',meals:'อาหารเย็น: Private beach dinner'},{day:'วันที่ 4',title:'Beach VIP',desc:'Private beach day spa sunset yacht dinner',meals:'อาหารเย็น: Private sunset dinner'},{day:'วันที่ 5',title:'VIP Departure',desc:'Late checkout Private Limousine สนามบิน',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'maldives2',name:'มัลดีฟส์ Luxury',country:'มัลดีฟส์',type:'beach',price:68900,nights:6,rating:5.0,reviews:35,badge:'premium',desc:'Resort 5 ดาว Water Villa Private Pool Underwater Restaurant',images:['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:68900,desc:'Water Villa อาหาร 3 มื้อ',includes:['Water Villa 5 คืน','อาหาร 3 มื้อทุกวัน','Snorkeling Equipment'],itinerary:[{day:'วันที่ 1',title:'ถึงมัลดีฟส์',desc:'Seaplane สู่รีสอร์ท เช็อิน Water Villa dinner',meals:'อาหารเย็น: buffet'},{day:'วันที่ 2',title:'Snorkeling',desc:'floating breakfast Snorkeling tour Private pool',meals:'อาหารกลางวัน: Buffet'},{day:'วันที่ 3',title:'Spa',desc:'Couples spa sunset fishing',meals:'อาหารเย็น: buffet'},{day:'วันที่ 4',title:'Island Hopping',desc:'Island trip BBQ lunch Kayaking',meals:'อาหารกลางวัน: Beach BBQ'},{day:'วันที่ 5',title:'Relaxation',desc:'Private pool Sunset cocktails',meals:'อาหารเย็น: Fine dining'},{day:'วันที่ 6',title:'กลับ',desc:'floating breakfast Seaplane สนามบิน',meals:'อาหารเช้า: floating breakfast'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:98900,desc:'Water Villa อาหารครบ Private',includes:['Water Villa 5 คืน','All Inclusive','Private Pool','Couples Spa','Underwater Restaurant'],itinerary:[{day:'วันที่ 1',title:'VIP Arrival',desc:'Seaplane VIP Water Villa Private Pool welcome dinner',meals:'อาหารเย็น: Private dinner'},{day:'วันที่ 2',title:'Water VIP',desc:'floating breakfast Private snorkeling dolphin cruise',meals:'อาหารกลางวัน: Private lunch'},{day:'วันที่ 3',title:'Spa & Underwater',desc:'Couples spa Underwater Restaurant dinner',meals:'อาหารเย็น: Underwater Restaurant'},{day:'วันที่ 4',title:'Private Island',desc:'Private island BBQ sunset dinner beach',meals:'อาหารกลางวัน: Private BBQ'},{day:'วันที่ 5',title:'Luxury Day',desc:'Private pool spa sunset cocktails',meals:'อาหารเย็น: Fine dining'},{day:'วันที่ 6',title:'กลับ',desc:'floating breakfast Seaplane VIP สนามบิน',meals:'อาหารเช้า: floating breakfast'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:168900,desc:'Overwater Suite VIP',includes:['Overwater Suite 5 คืน','Ultra All Inclusive','Private Pool + Jacuzzi','Private Butler','Spa 3 ชม.','Private Dining ทุกวัน','Seaplane VIP'],itinerary:[{day:'วันที่ 1',title:'Ultra Luxury',desc:'VIP Seaplane Overwater Suite butler welcome champagne dinner',meals:'อาหารเย็น: Private fine dining'},{day:'วันที่ 2',title:'Private Water Activities',desc:'Private butler floating breakfast private snorkeling private dolphin',meals:'อาหารกลางวัน: Private beach lunch'},{day:'วันที่ 3',title:'Spa & Dining VIP',desc:'Spa 3 ชม. underwater restaurant private dinner sunset yacht',meals:'อาหารเย็น: Private underwater dinner'},{day:'วันที่ 4',title:'Private Island Exclusive',desc:'Private island exclusive BBQ private dining sandbank',meals:'อาหารกลางวัน: Private sandbank lunch'},{day:'วันที่ 5',title:'Ultimate Luxury',desc:'Private pool jacuzzi spa sunset champagne dinner',meals:'อาหารเย็น: Private fine dining'},{day:'วันที่ 6',title:'VIP Farewell',desc:'Private butler floating breakfast Seaplane VIP departure',meals:'อาหารเช้า: Private floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'taiwan1',name:'ไต้หวัน เที่ยวครบ',country:'ไต้หวัน',type:'city',price:22900,nights:5,rating:4.7,reviews:65,badge:'',desc:'ไทเป จิ่วเฟิ่น หุบเขา太魯閣 อาหาร Street Food',images:['https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=80','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80','https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:22900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 4 คืน','อาหารเช้า 5 มื้อ','ตั๋ว MRT 3 วัน'],itinerary:[{day:'วันที่ 1',title:'ถึงไทเป',desc:'สนามบิน MRT สู่ไทเป dinner night market',meals:'อาหารเย็น: Street Food'},{day:'วันที่ 2',title:'จิ่วเฟิ่น (รถไฟร่วม)',desc:'รถไฟร่วม จิ่วเฟิ่น หมู่บ้านโบราณ',meals:'อาหารกลางวัน: บะหมี่ทะเล'},{day:'วันที่ 3',title:'太魯閣 (รถร่วม)',desc:'รถบัสร่วม หุบเขา太魯閣',meals:'อาหารกลางวัน: อาหารพื้นเมือง'},{day:'วันที่ 4',title:'อิสระ',desc:'ล่องเรือ Sun Moon Lake อิสระ',meals:'อาหารเย็น: อิสระ'},{day:'วันที่ 5',title:'กลับ',desc:'วัดหลงซาน สนามบิน',meals:'อาหารเช้า: โจ๊ก'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:38900,desc:'โรงแรม 4 ดาว อาหารครบ',includes:['โรงแรม 4 ดาว 4 คืน','อาหาร 3 มื้อทุกวัน','Private Tour ทุกวัน'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'Private transfer ไทเป 4 ดาว dinner night market',meals:'อาหารเย็น: Premium street food'},{day:'วันที่ 2',title:'Private Jiufen',desc:'Private guide จิ่วเฟิ่น private tea ceremony',meals:'อาหารกลางวัน: Private seafood'},{day:'วันที่ 3',title:'Private Taroko',desc:'Private car 太魯閣 private guide',meals:'อาหารกลางวัน: Private local food'},{day:'วันที่ 4',title:'Private Sun Moon Lake',desc:'Private car Sun Moon Lake private boat',meals:'อาหารเย็น: Private dinner'},{day:'วันที่ 5',title:'กลับ',desc:'Late checkout Private transfer สนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:62900,desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:['โรงแรม 5 ดาว 4 คืน','อาหารครบทุกมื้อ Private','Private Guide + Car ทุกวัน'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'Private Limousine 5 ดาว suite welcome dinner',meals:'อาหารเย็น: Fine dining Taipei'},{day:'วันที่ 2',title:'Private Jiufen VIP',desc:'Private guide + car จิ่วเฟิ่น exclusive tea experience',meals:'อาหารกลางวัน: Private seafood feast'},{day:'วันที่ 3',title:'Private Taroko VIP',desc:'Private car 太魯閣 private helicopter scenic flight',meals:'อาหารกลางวัน: Private mountain lunch'},{day:'วันที่ 4',title:'Private Sun Moon Lake VIP',desc:'Private car Sun Moon Lake private yacht dinner',meals:'อาหารเย็น: Private lakeside dinner'},{day:'วันที่ 5',title:'VIP Departure',desc:'Late checkout Private Limousine สนามบิน',meals:'อาหารเช้า: โรงแรม'}]}],excludes:['ตั๋วเครื่องบิน'],itinerary:[]},
{id:'australia1',name:'ออสเตรเลีย ผจญภัย',country:'ออสเตรเลีย',type:'adventure',price:78900,nights:7,rating:4.8,reviews:48,badge:'premium',desc:'ซิดนีย์ เมลเบิร์น GREAT OCEAN ROAD',images:['https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80','https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:78900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 6 คืน','อาหารเช้า 7 มื้อ','ตั๋วเครื่องบินในประเทศ'],itinerary:[{day:'วันที่ 1',title:'ถึงซิดนีย์',desc:'สนามบิน dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'ซิดนีย์ (อิสระ)',desc:'Opera House Harbour Bridge Bondi Beach',meals:'อาหารกลางวัน: อิสระ'},{day:'วันที่ 3',title:'บินสู่เมลเบิร์น',desc:'เครื่องบิน Federation Square',meals:'อาหารเย็น: อิสระ'},{day:'วันที่ 4',title:'Great Ocean Road (ทัวร์ร่วม)',desc:'Great Ocean Road Twelve Apostles',meals:'อาหารกลางวัน: fish & chips'},{day:'วันที่ 5',title:'Melbourne (อิสระ)',desc:'Brighton Beach National Gallery',meals:'อาหารเย็น: อิสระ'},{day:'วันที่ 6',title:'Cairns',desc:'บิน Cairns snorkeling',meals:'อาหารกลางวัน: บนเรือ'},{day:'วันที่ 7',title:'กลับ',desc:'บินกลับ',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:128900,desc:'โรงแรม 4 ดาว อาหารครบ',includes:['โรงแรม 4 ดาว 6 คืน','อาหาร 3 มื้อทุกวัน','Private Tour ทุกวัน'],itinerary:[{day:'วันที่ 1',title:'VIP Sydney',desc:'Private transfer Sydney dinner harbourside',meals:'อาหารเย็น: Fine dining Sydney'},{day:'วันที่ 2',title:'Private Sydney',desc:'Private guide Opera House Bondi Taronga Zoo',meals:'อาหารกลางวัน: Private lunch'},{day:'วันที่ 3',title:'Private Melbourne',desc:'Private transfer Melbourne dinner Italian',meals:'อาหารเย็น: Italian Melbourne'},{day:'วันที่ 4',title:'Private Great Ocean Road',desc:'Private car Great Ocean Road Twelve Apostles',meals:'อาหารกลางวัน: Private lunch'},{day:'วันที่ 5',title:'Private Melbourne',desc:'Private guide Melbourne gallery beach dinner',meals:'อาหารเย็น: Fine dining Melbourne'},{day:'วันที่ 6',title:'Private Cairns',desc:'Private transfer Cairns Great Barrier Reef private snorkeling',meals:'อาหารกลางวัน: Private on boat'},{day:'วันที่ 7',title:'กลับ',desc:'Late checkout สนามบิน',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:218900,desc:'Lodge 5 ดาว อาหารครบ VIP',includes:['Lodge 5 ดาว 6 คืน','อาหารครบทุกมื้อ Michelin','Private Guide + Car ทุกวัน','Private Helicopter scenic','VIP Access ทุกที่'],itinerary:[{day:'วันที่ 1',title:'Luxury Sydney',desc:'Private Limousine Sydney Lodge dinner fine dining',meals:'อาหารเย็น: Michelin Sydney'},{day:'วันที่ 2',title:'Private Sydney VIP',desc:'Private guide + car Opera House VIP Bondi private helicopter scenic',meals:'อาหารกลางวัน: Private waterfront'},{day:'วันที่ 3',title:'Private Melbourne VIP',desc:'Private transfer Melbourne fine dining private gallery tour',meals:'อาหารเย็น: Private Melbourne dinner'},{day:'วันที่ 4',title:'Private Great Ocean Road VIP',desc:'Private helicopter Great Ocean Road private picnic',meals:'อาหารกลางวัน: Private picnic'},{day:'วันที่ 5',title:'Private Melbourne VIP',desc:'Private guide Melbourne private art tour dinner',meals:'อาหารเย็น: Private fine dining'},{day:'วันที่ 6',title:'Private Cairns VIP',desc:'Private helicopter Cairns private Great Barrier Reef dive',meals:'อาหารกลางวัน: Private boat lunch'},{day:'วันที่ 7',title:'VIP Departure',desc:'Late checkout Private transfer airport',meals:'อาหารเช้า: Private breakfast'}]}],excludes:['ตั๋วเครื่องบินระหว่างประเทศ'],itinerary:[]},
{id:'phangan1',name:'เกาะพะงัน Full Moon',country:'ประเทศไทย',type:'beach',price:7900,nights:3,rating:4.5,reviews:89,badge:'hot',desc:'Full Moon Party หาดริ้น ดำน้ำ เกาะเต่า',images:['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'],packages:[{tier:'standard',name:'แพ็กเกจปกติ',price:7900,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:['โรงแรม 3 ดาว 2 คืน','อาหารเช้า 3 มื้อ'],itinerary:[{day:'วันที่ 1',title:'ถึงพะงัน',desc:'เรือ ferry เช็อิน dinner อิสระ',meals:'- (อาหารเย็นอิสระ)'},{day:'วันที่ 2',title:'Full Moon Party',desc:'พักผ่อน เตรียมตัว Full Moon Party',meals:'อาหารเช้า: โรงแรม'},{day:'วันที่ 3',title:'กลับ',desc:'เช็คเอาท์ เรือกลับ',meals:'อาหารเช้า: โรงแรม'}]},{tier:'deluxe',name:'แพ็กเกจหรู',price:14900,desc:'โรงแรม 4 ดาว อาหารครบ',includes:['โรงแรม 4 ดาว 2 คืน','อาหาร 3 มื้อทุกวัน','ทัวร์เกาะเต่า','Full Moon VIP Pass'],itinerary:[{day:'วันที่ 1',title:'VIP Welcome',desc:'Speedboat VIP เช็อิน 4 ดาว dinner ริมหาด',meals:'อาหารเย็น: Seafood dinner'},{day:'วันที่ 2',title:'Tao & Full Moon',desc:'เช้าทัวร์เกาะเต่า snorkeling เย็น Full Moon VIP',meals:'อาหารกลางวัน: บนเรือ'},{day:'วันที่ 3',title:'กลับ',desc:'Late checkout Speedboat VIP กลับ',meals:'อาหารเช้า: โรงแรม'}]},{tier:'premium',name:'แพ็กเกจพรีเมียม',price:24900,desc:'Pool Villa 5 ดาว อาหารครบ VIP',includes:['Pool Villa 5 ดาว 2 คืน','อาหารครบทุกมื้อ Private','Private Boat Tour','Full Moon VIP Area'],itinerary:[{day:'วันที่ 1',title:'Luxury Arrival',desc:'Private Speedboat Pool Villa welcome dinner beach',meals:'อาหารเย็น: Private beach dinner'},{day:'วันที่ 2',title:'Private Tao & VIP Party',desc:'Private boat เกาะเต่า snorkeling VIP Full Moon area',meals:'อาหารกลางวัน: Private lunch'},{day:'วันที่ 3',title:'VIP Departure',desc:'Late checkout Private Speedboat',meals:'อาหารเช้า: floating breakfast'}]}],excludes:['ตั๋วเครื่องบิน','ค่าเรือข้ามฟาก'],itinerary:[]},
];

/* ===== GET TOURS FROM FIRESTORE ===== */
let _toursCache = null;
let _uploadingToFirestore = false;

async function getToursFromDB(showLoader=false) {
  if (_toursCache) return _toursCache;

  const grid=document.getElementById('tourGrid')||document.getElementById('homeTours');
  if(showLoader && grid) showSkeleton(grid, 6);

  try {
    const snap = await db.collection('tours').get();
    if (!snap.empty) {
      _toursCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return _toursCache;
    }
  } catch (e) { console.error('Firestore error:', e); }

  // Firestore ว่าง - อัพโหลด TOURS ขึ้น Firestore อัตโนมัติ
  _toursCache = TOURS;
  if (!_uploadingToFirestore) {
    _uploadingToFirestore = true;
    uploadToursToFirestore();
  }
  return TOURS;
}

// อัพโหลด TOURS ขึ้น Firestore (ข้อมูลเต็มพร้อม packages)
async function uploadToursToFirestore() {
  console.log('🔄 อัพโหลดข้อมูลทัวร์ ' + TOURS.length + ' รายการ ขึ้น Firestore...');
  let success = 0;
  for (const tour of TOURS) {
    try {
      await db.collection('tours').doc(tour.id).set(tour);
      success++;
      console.log('✅ ' + tour.name);
    } catch (e) {
      console.error('❌ Upload error:', tour.id, e.message);
    }
  }
  console.log('🎉 อัพโหลดเสร็จ: ' + success + '/' + TOURS.length + ' รายการ');
  return success;
}

// ฟังก์ชันสำหรับล้างและอัพโหลดใหม่ (เรียกจาก Console)
async function resetAndUploadTours() {
  console.log('🗑️ กำลังลบข้อมูลเก่า...');
  try {
    const snap = await db.collection('tours').get();
    for (const doc of snap.docs) {
      await doc.ref.delete();
    }
    console.log('✅ ลบข้อมูลเก่า: ' + snap.size + ' รายการ');
  } catch (e) {
    console.error('❌ ลบข้อมูลไม่ได้:', e.message);
  }
  
  _toursCache = null; // ล้าง cache
  return await uploadToursToFirestore();
}

/* ===== HTML ESCAPE (XSS Protection) ===== */
function escHtml(s){if(!s)return'';const d=document.createElement('div');d.textContent=String(s);return d.innerHTML}

/* ===== TOAST ===== */
function showToast(msg,type='info'){const icons={success:'fa-check-circle',error:'fa-times-circle',info:'fa-info-circle'};const t=document.createElement('div');t.className=`toast ${type}`;t.innerHTML=`<i class="fas ${icons[type]||icons.info}"></i><span>${escHtml(msg)}</span>`;document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),400)},3000)}

/* ===== THEME ===== */
function initTheme(){const s=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',s);updateThemeIcon(s)}
function toggleTheme(){const c=document.documentElement.getAttribute('data-theme');const n=c==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);localStorage.setItem('theme',n);updateThemeIcon(n)}
function updateThemeIcon(t){document.querySelectorAll('.theme-toggle').forEach(b=>b.innerHTML=t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>')}
function getUser(){try{return JSON.parse(localStorage.getItem('currentUser'))}catch{return null}}
function setUser(u){localStorage.setItem('currentUser',JSON.stringify(u))}
function clearUser(){
  localStorage.removeItem('currentUser');
  // Sign out from Firebase Auth
  if(auth) {
    auth.signOut().catch(e => console.log('Sign out error:', e));
  }
}

/* ===== HEADER ===== */
function initHeader(){
  const user=getUser();
  document.querySelectorAll('.btn-login').forEach(btn=>{
    if(user&&!btn.closest('.admin-sidebar')){
      btn.innerHTML=`<i class="fas fa-user"></i> ${escHtml(user.firstName)}`;
      btn.href=user.role==='admin'?'admin/index.html':'user.html'
    }
  });
  const toggle=document.querySelector('.mobile-toggle');
  const links=document.querySelector('.nav-links');
  if(toggle&&links){
    toggle.addEventListener('click',()=>{
      links.classList.toggle('show');
      toggle.classList.toggle('active');
    });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      links.classList.remove('show');
      toggle.classList.remove('active');
    }));
    // Close menu when clicking outside
    document.addEventListener('click',(e)=>{
      if(!toggle.contains(e.target)&&!links.contains(e.target)){
        links.classList.remove('show');
        toggle.classList.remove('active');
      }
    });
  }
}

/* ===== SLIDER ===== */
function initSlider(){const slides=document.querySelectorAll('.hero-slide');const dots=document.querySelectorAll('.dot');if(!slides.length)return;let idx=0,timer;function show(i){slides.forEach((s,j)=>s.classList.toggle('active',j===i));dots.forEach((d,j)=>d.classList.toggle('active',j===i));idx=i}function next(){show((idx+1)%slides.length)}function start(){timer=setInterval(next,5000)}function stop(){clearInterval(timer)}document.querySelector('.slider-arrow.next')?.addEventListener('click',()=>{stop();next();start()});document.querySelector('.slider-arrow.prev')?.addEventListener('click',()=>{stop();show((idx-1+slides.length)%slides.length);start()});dots.forEach((d,i)=>d.addEventListener('click',()=>{stop();show(i);start()}));show(0);start()}

/* ===== RENDER TOURS ===== */
function renderTours(container,tours,limit=0){
  if(!container)return;
  const list=limit?tours.slice(0,limit):tours;
  container.innerHTML=list.map(t=>{
    const eName=escHtml(t.name);
    const eCountry=escHtml(t.country);
    const eBadge=t.badge==='hot'?'ยอดนิยม':t.badge==='new'?'ใหม่':t.badge==='premium'?'พรีเมียม':t.badge;
    const minPrice=t.packages?Math.min(...t.packages.map(p=>p.price)):t.price;
    const maxPrice=t.packages?Math.max(...t.packages.map(p=>p.price)):t.price;
    const priceRange=t.packages?`&#3645;${minPrice.toLocaleString()} - &#3645;${maxPrice.toLocaleString()}`:`&#3645;${minPrice.toLocaleString()}`;
    const imgSrc=t.images?.[0]||t.img||DEFAULT_IMAGES.tourCard;
    return `<div class="tour-card"><div class="tour-card-img"><img src="${imgSrc}" alt="${eName}" loading="lazy" decoding="async" onerror="handleImageError(this,'tourCard')">${t.badge?`<span class="tour-badge badge-${t.badge}">${eBadge}</span>`:''}<button class="wishlist-btn" onclick="event.stopPropagation();doWishlist('${t.id}',this)"><i class="fas fa-heart"></i></button></div><div class="tour-card-body" onclick="showTourDetail('${t.id}')"><h4>${eName}</h4><div class="tour-meta"><span><i class="fas fa-map-marker-alt"></i>${eCountry}</span><span><i class="far fa-clock"></i>${t.nights} วัน ${t.nights-1} คืน</span></div><div class="tour-rating"><i class="fas fa-star"></i> ${t.rating} (${t.reviews} รีวิว)</div><div class="tour-price"><div><span class="amount">${priceRange}</span> <span class="unit">/คน</span></div><button class="btn-detail" onclick="event.stopPropagation();showTourDetail('${t.id}')">ดูรายละเอียด</button></div></div></div>`;
  }).join('');
}

/* ===== TOUR DETAIL MODAL ===== */
let _selectedTier='standard';
async function showTourDetail(id){
  const modal=document.getElementById('tourModal');
  if(!modal)return;

  // Show loading in modal
  modal.querySelector('.modal-body').innerHTML=`<div class="loading-spinner"><div class="spinner"></div><div class="loading-text">กำลังโหลดรายละเอียด...</div></div>`;
  modal.classList.add('show');
  document.body.style.overflow='hidden';

  const tours=await getToursFromDB();
  const t=tours.find(x=>x.id===id);
  if(!t){
    modal.querySelector('.modal-body').innerHTML=`<div style="text-align:center;padding:40px;"><p>ไม่พบข้อมูลทัวร์</p></div>`;
    return;
  }
  const eName=escHtml(t.name);
  const eDesc=escHtml(t.desc);
  const eCountry=escHtml(t.country);
  _selectedTier='standard';

  // Build package tabs HTML
  const packages=t.packages||[];
  let pkgTabsHtml='';
  let pkgContentHtml='';
  if(packages.length>0){
    pkgTabsHtml=`<div style="display:flex;gap:10px;margin:20px 0;flex-wrap:wrap;">
      ${packages.map((p,i)=>`<button class="pkg-tab ${i===0?'active':''}" data-tier="${p.tier}" onclick="selectPackage('${t.id}','${p.tier}',this)" style="flex:1;min-width:100px;padding:12px 8px;border-radius:10px;border:2px solid ${i===0?'var(--gold)':'var(--border)'};background:${i===0?'var(--gold-bg)':'var(--bg-3)'};cursor:pointer;transition:all .3s;text-align:center;">
        <div style="font-size:.75rem;color:var(--text-3);margin-bottom:4px;">${escHtml(p.name)}</div>
        <div style="font-size:1.1rem;font-weight:700;color:${i===0?'var(--gold)':'var(--text-1)'};">&#3645;${p.price.toLocaleString()}</div>
        <div style="font-size:.7rem;color:var(--text-3);margin-top:4px;">${escHtml(p.desc)}</div>
      </button>`).join('')}
    </div>`;
    // Default includes from first package
    const defaultPkg=packages[0];
    pkgContentHtml=`<div id="pkgIncludes">
      <h4 style="font-family:'Poppins',sans-serif;font-size:.95rem;margin-bottom:10px;"><i class="fas fa-check-circle" style="color:var(--gold);"></i> สิ่งที่รวม (${escHtml(defaultPkg.name)})</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
        ${defaultPkg.includes.map(i=>`<div style="font-size:.85rem;color:var(--text-2);"><i class="fas fa-check" style="color:var(--gold);font-size:.75rem;margin-right:6px;"></i>${escHtml(i)}</div>`).join('')}
      </div>
    </div>`;
  } else {
    // Fallback to old includes
    const inclHtml=(t.includes||[]).map(i=>`<div style="font-size:.85rem;color:var(--text-2);"><i class="fas fa-check" style="color:var(--gold);font-size:.75rem;margin-right:6px;"></i>${escHtml(i)}</div>`).join('');
    pkgContentHtml=`<h4 style="font-family:'Poppins',sans-serif;font-size:.95rem;margin-bottom:10px;"><i class="fas fa-check-circle" style="color:var(--gold);"></i> สิ่งที่รวม</h4>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">${inclHtml}</div>`;
  }

  const exclHtml=(t.excludes||[]).map(i=>`<div style="font-size:.85rem;color:var(--text-2);"><i class="fas fa-times" style="color:#e74c3c;font-size:.75rem;margin-right:6px;"></i>${escHtml(i)}</div>`).join('');
  // Get itinerary from first package or tour
  const initItin=(packages.length>0&&packages[0].itinerary)?packages[0].itinerary:(t.itinerary||[]);
  const itinHtml=initItin.map(d=>{
    return `<div style="display:flex;gap:14px;margin-bottom:16px;"><div style="min-width:80px;padding:6px 12px;background:var(--gold-bg);border-radius:6px;text-align:center;font-size:.78rem;font-weight:600;color:var(--gold);height:fit-content;">${escHtml(d.day)}</div><div><h5 style="font-family:'Poppins',sans-serif;font-size:.9rem;margin-bottom:4px;">${escHtml(d.title)}</h5><p style="font-size:.82rem;color:var(--text-2);line-height:1.6;">${escHtml(d.desc)}</p>${d.meals?`<p style="font-size:.78rem;color:var(--text-3);margin-top:4px;"><i class="fas fa-utensils" style="color:var(--gold);"></i> ${escHtml(d.meals)}</p>`:''}</div></div>`;
  }).join('');
  const imgHtml=t.images?.length?t.images.map((img,idx)=>`<img src="${img}" alt="${eName}" class="${idx===0?'active':''}" loading="lazy" decoding="async" onerror="handleImageError(this,'tour')">`).join(''):`<img src="${DEFAULT_IMAGES.tourCard}" alt="${eName}" class="active">`;

  // Get initial price
  const initPrice=packages.length>0?packages[0].price:t.price;

  modal.querySelector('.modal-body').innerHTML=`
    <div class="img-slider">${imgHtml}${t.images?.length>1?`<button class="slider-arrow prev" onclick="slideImg(-1)"><i class="fas fa-chevron-left"></i></button><button class="slider-arrow next" onclick="slideImg(1)"><i class="fas fa-chevron-right"></i></button>`:''}</div>
    <div class="img-dots" id="imgDots">${(t.images||[]).map((_,i)=>`<div class="dot ${i===0?'active':''}" onclick="goToImg(${i})"></div>`).join('')}</div>
    <h3 style="font-family:'Sarabun',sans-serif;font-size:1.5rem;margin:16px 0 12px;">${eName}</h3>
    <p style="color:var(--text-2);margin-bottom:16px;line-height:1.7;">${eDesc}</p>
    <div style="display:flex;gap:16px;margin-bottom:20px;font-size:.85rem;color:var(--text-3);flex-wrap:wrap;">
      <span><i class="fas fa-map-marker-alt" style="color:var(--gold)"></i> ${eCountry}</span>
      <span><i class="far fa-clock" style="color:var(--gold)"></i> ${t.nights} วัน ${t.nights-1} คืน</span>
      <span style="color:var(--gold)"><i class="fas fa-star"></i> ${t.rating} (${t.reviews} รีวิว)</span>
    </div>
    ${pkgTabsHtml}
    ${pkgContentHtml}
    ${t.excludes?`<h4 style="font-family:'Poppins',sans-serif;font-size:.95rem;margin-bottom:10px;"><i class="fas fa-times-circle" style="color:#e74c3c;"></i> ไม่รวม</h4><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">${exclHtml}</div>`:''}
    ${initItin.length>0?`<h4 style="font-family:'Poppins',sans-serif;font-size:.95rem;margin-bottom:14px;"><i class="fas fa-route" style="color:var(--gold);"></i> กำหนดการเดินทาง</h4><div id="pkgItinerary">${itinHtml}</div>`:''}
    <div style="display:flex;gap:12px;margin-top:24px;">
      <a href="booking.html?tour=${t.id}&tier=${_selectedTier}" id="bookNowBtn" class="btn btn-gold" style="flex:1;justify-content:center;">จองเลย &#3645;${initPrice.toLocaleString()}</a>
      <button class="btn btn-outline" onclick="doWishlist('${t.id}')" style="flex:0;"><i class="fas fa-heart"></i></button>
    </div>`;
  modal.classList.add('show');document.body.style.overflow='hidden';
}

function selectPackage(tourId,tier,btn){
  _selectedTier=tier;
  // Update tab styles
  document.querySelectorAll('.pkg-tab').forEach(tab=>{
    tab.style.border='2px solid var(--border)';
    tab.style.background='var(--bg-3)';
    tab.querySelector('div:first-child').style.color='var(--text-3)';
    tab.querySelector('div:nth-child(2)').style.color='var(--text-1)';
  });
  btn.style.border='2px solid var(--gold)';
  btn.style.background='var(--gold-bg)';
  btn.querySelector('div:first-child').style.color='var(--text-3)';
  btn.querySelector('div:nth-child(2)').style.color='var(--gold)';

  // Update includes and itinerary
  getToursFromDB().then(tours=>{
    const t=tours.find(x=>x.id===tourId);
    if(!t||!t.packages)return;
    const pkg=t.packages.find(p=>p.tier===tier);
    if(!pkg)return;
    const pkgIncludes=document.getElementById('pkgIncludes');
    if(pkgIncludes){
      pkgIncludes.innerHTML=`<h4 style="font-family:'Poppins',sans-serif;font-size:.95rem;margin-bottom:10px;"><i class="fas fa-check-circle" style="color:var(--gold);"></i> สิ่งที่รวม (${escHtml(pkg.name)})</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
        ${pkg.includes.map(i=>`<div style="font-size:.85rem;color:var(--text-2);"><i class="fas fa-check" style="color:var(--gold);font-size:.75rem;margin-right:6px;"></i>${escHtml(i)}</div>`).join('')}
      </div>`;
    }
    // Update itinerary if package has its own
    const pkgItin=document.getElementById('pkgItinerary');
    if(pkgItin&&pkg.itinerary){
      pkgItin.innerHTML=pkg.itinerary.map(d=>{
        return `<div style="display:flex;gap:14px;margin-bottom:16px;"><div style="min-width:80px;padding:6px 12px;background:var(--gold-bg);border-radius:6px;text-align:center;font-size:.78rem;font-weight:600;color:var(--gold);height:fit-content;">${escHtml(d.day)}</div><div><h5 style="font-family:'Poppins',sans-serif;font-size:.9rem;margin-bottom:4px;">${escHtml(d.title)}</h5><p style="font-size:.82rem;color:var(--text-2);line-height:1.6;">${escHtml(d.desc)}</p>${d.meals?`<p style="font-size:.78rem;color:var(--text-3);margin-top:4px;"><i class="fas fa-utensils" style="color:var(--gold);"></i> ${escHtml(d.meals)}</p>`:''}</div></div>`;
      }).join('');
    }
    // Update booking button
    const bookBtn=document.getElementById('bookNowBtn');
    if(bookBtn){
      bookBtn.href=`booking.html?tour=${tourId}&tier=${tier}`;
      bookBtn.innerHTML=`จองเลย &#3645;${pkg.price.toLocaleString()}`;
    }
  });
}

/* ===== IMAGE SLIDER IN MODAL ===== */
let _curImgIdx=0;
function slideImg(dir){const imgs=document.querySelectorAll('.img-slider img');if(!imgs.length)return;imgs[_curImgIdx].classList.remove('active');_curImgIdx=(_curImgIdx+dir+imgs.length)%imgs.length;imgs[_curImgIdx].classList.add('active');updateImgDots()}
function goToImg(idx){const imgs=document.querySelectorAll('.img-slider img');if(!imgs.length||idx>=imgs.length)return;imgs[_curImgIdx].classList.remove('active');_curImgIdx=idx;imgs[_curImgIdx].classList.add('active');updateImgDots()}
function updateImgDots(){document.querySelectorAll('#imgDots .dot').forEach((d,i)=>d.classList.toggle('active',i===_curImgIdx))}
function closeModal(){document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('show'));document.body.style.overflow='';_curImgIdx=0}

/* ===== WISHLIST ===== */
function doWishlist(tourId,btn){const user=getUser();if(!user){showToast('กรุณาเข้าสู่ระบบก่อน','error');setTimeout(()=>{window.location.href='auth.html'},1000);return}const wl=JSON.parse(localStorage.getItem('wishlist_'+user.id)||'[]');const idx=wl.indexOf(tourId);if(idx>=0){wl.splice(idx,1);if(btn)btn.classList.remove('active');showToast('ลบออกจากรายการโปรด','success')}else{wl.push(tourId);if(btn)btn.classList.add('active');showToast('เพิ่มในรายการโปรดแล้ว','success')}localStorage.setItem('wishlist_'+user.id,JSON.stringify(wl));updateWishlistBadge()}
function updateWishlistBadge(){const user=getUser();const badges=document.querySelectorAll('.wishlist-badge');if(!user){badges.forEach(b=>b.textContent='0');return}const wl=JSON.parse(localStorage.getItem('wishlist_'+user.id)||'[]');badges.forEach(b=>b.textContent=wl.length)}
function goWishlist(e){e.preventDefault();const user=getUser();if(user){window.location.href='user.html?panel=wishlist'}else{window.location.href='auth.html'}}

/* ===== FILTER ===== */
let _tourCurrentPage=1;const _tourPerPage=6;let _tourFiltered=[];
let _tourFilters={type:'all',sort:'default',search:''};

async function initTourFilter(){
  const grid=document.getElementById('tourGrid');
  if(!grid)return;
  showSkeleton(grid, 6);
  const tours=await getToursFromDB();
  const params=new URLSearchParams(location.search);
  const initType=params.get('type')||'all';
  const initSearch=params.get('search')||'';
  _tourFilters={type:initType,sort:'default',search:initSearch};
  // Set search input value if exists
  const searchInput=document.getElementById('tourSearch');
  if(searchInput&&initSearch)searchInput.value=initSearch;

  function apply(){
    let filtered=[...tours];
    if(_tourFilters.type!=='all')filtered=filtered.filter(t=>t.type===_tourFilters.type);
    if(_tourFilters.search){
      const q=_tourFilters.search.toLowerCase();
      filtered=filtered.filter(t=>
        t.name.toLowerCase().includes(q)||
        t.country.toLowerCase().includes(q)||
        (t.desc&&t.desc.toLowerCase().includes(q))||
        (t.type&&t.type.toLowerCase().includes(q))||
        (t.price&&t.price.toString().includes(q))
      )
    }
    if(_tourFilters.sort==='low')filtered.sort((a,b)=>a.price-b.price);
    if(_tourFilters.sort==='high')filtered.sort((a,b)=>b.price-a.price);
    if(_tourFilters.sort==='rating')filtered.sort((a,b)=>b.rating-a.rating);
    _tourFiltered=filtered;
    _tourCurrentPage=1;
    renderTourPage();
    updateTourCount(filtered.length);
  }

  window.renderTourPage=function(){
    const total=_tourFiltered.length;
    const start=(_tourCurrentPage-1)*_tourPerPage;
    const pageItems=_tourFiltered.slice(start,start+_tourPerPage);
    
    if(total === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
          <i class="fas fa-search" style="font-size:3rem;color:var(--text-3);margin-bottom:16px;display:block;"></i>
          <h3 style="color:var(--text-2);margin-bottom:8px;">ไม่พบทัวร์ที่ค้นหา</h3>
          <p style="color:var(--text-3);font-size:.9rem;margin-bottom:20px;">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่ที่แตกต่าง</p>
          <button onclick="clearSearchInput()" class="btn btn-outline btn-sm">ล้างการค้นหา</button>
        </div>
      `;
    } else {
      renderTours(grid,pageItems);
    }
    renderPagination(total);
  }
  function renderTourPage(){window.renderTourPage()}

  function renderPagination(total){
    const pagEl=document.getElementById('tourPagination');
    if(!pagEl)return;
    const pages=Math.ceil(total/_tourPerPage);
    if(pages<=1){pagEl.innerHTML='';return}
    let html='';
    if(_tourCurrentPage>1)html+=`<a href="#" onclick="event.preventDefault();_tourCurrentPage=${_tourCurrentPage-1};renderTourPage()">‹</a>`;
    for(let i=1;i<=pages;i++){
      if(pages>7&&i>2&&i<pages-1&&Math.abs(i-_tourCurrentPage)>1){if(html.slice(-3)!=='...')html+=`<span>...</span>`;continue}
      html+=`<a href="#" class="${i===_tourCurrentPage?'active':''}" onclick="event.preventDefault();_tourCurrentPage=${i};renderTourPage()">${i}</a>`
    }
    if(_tourCurrentPage<pages)html+=`<a href="#" onclick="event.preventDefault();_tourCurrentPage=${_tourCurrentPage+1};renderTourPage()">›</a>`;
    pagEl.innerHTML=html;
  }

  function updateTourCount(n){
    const el=document.getElementById('tourCount');
    if(!el) return;
    let text = `พบ ${n} ทัวร์`;
    if(_tourFilters.search) {
      text += ` สำหรับ "${_tourFilters.search}"`;
    }
    if(_tourFilters.type !== 'all') {
      const typeNames = {beach:'ชายหาด',mountain:'ภูเขา',city:'เมือง',adventure:'ผจญภัย'};
      text += ` ในหมวด ${typeNames[_tourFilters.type]||_tourFilters.type}`;
    }
    el.textContent = text;
  }

  // Setup event listeners
  document.querySelectorAll('.filter-tab').forEach(tab=>{
    if(tab.dataset.type===_tourFilters.type){
      document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
    }
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      _tourFilters.type=tab.dataset.type;
      apply();
    });
  });

  document.getElementById('sortSelect')?.addEventListener('change',function(){
    _tourFilters.sort=this.value;
    apply();
  });

  // Debounce search for better performance
  let searchTimeout;
  document.getElementById('tourSearch')?.addEventListener('input',function(){
    clearTimeout(searchTimeout);
    const searchValue = this.value;
    searchTimeout = setTimeout(()=>{
      _tourFilters.search=searchValue;
      apply();
    }, 300); // 300ms debounce
  });

  apply();
}

/* ===== CALENDAR PICKER ===== */
function initCalendar(inputId,dropdownId){
  const input=document.getElementById(inputId);const dropdown=document.getElementById(dropdownId);
  if(!input||!dropdown)return;
  const today=new Date();let currentMonth=today.getMonth();let currentYear=today.getFullYear();
  const months=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const weekdays=['อา','จ','อ','พ','พฤ','ศ','ส'];
  function render(){
    const firstDay=new Date(currentYear,currentMonth,1).getDay();
    const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();
    const minDate=new Date();minDate.setHours(0,0,0,0);
    let html=`<div class="cal-header"><button onclick="event.stopPropagation();calNav('${dropdownId}',-1)">‹</button><span>${months[currentMonth]} ${currentYear+543}</span><button onclick="event.stopPropagation();calNav('${dropdownId}',1)">›</button></div>`;
    html+=`<div class="cal-weekdays">${weekdays.map(d=>`<span>${d}</span>`).join('')}</div>`;
    html+=`<div class="cal-days">`;
    for(let i=0;i<firstDay;i++)html+=`<div class="cal-day empty"></div>`;
    for(let d=1;d<=daysInMonth;d++){
      const dt=new Date(currentYear,currentMonth,d);dt.setHours(0,0,0,0);
      const isPast=dt<minDate;
      const isSelected=input.value===`${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday=dt.getTime()===new Date().setHours(0,0,0,0);
      html+=`<div class="cal-day${isPast?' disabled':''}${isSelected?' selected':''}${isToday?' today':''}" onclick="event.stopPropagation();calSelect('${inputId}','${dropdownId}',${currentYear},${currentMonth},${d})">${d}</div>`;
    }
    html+=`</div>`;
    dropdown.innerHTML=html;
  }
  input.addEventListener('click',function(e){e.stopPropagation();dropdown.classList.toggle('show');render()});
  input.addEventListener('focus',function(){dropdown.classList.add('show');render()});
  dropdown.addEventListener('click',function(e){e.stopPropagation()});
  render();
}
function calNav(dropdownId,dir){
  const dropdown=document.getElementById(dropdownId);
  const header=dropdown.querySelector('.cal-header span');
  const text=header.textContent;
  const months=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  let m=months.indexOf(text.split(' ')[0]);let y=parseInt(text.split(' ')[1])-543;
  m+=dir;if(m<0){m=11;y--}if(m>11){m=0;y++}
  dropdown._calYear=y;dropdown._calMonth=m;
  const inputId=dropdown.dataset.inputId||'bkDate';
  const input=document.getElementById(inputId);
  const today=new Date();let currentMonth=m;let currentYear=y;
  const weekdays=['อา','จ','อ','พ','พฤ','ศ','ส'];
  const minDate=new Date();minDate.setHours(0,0,0,0);
  let html=`<div class="cal-header"><button onclick="event.stopPropagation();calNav('${dropdownId}',-1)">‹</button><span>${months[currentMonth]} ${currentYear+543}</span><button onclick="event.stopPropagation();calNav('${dropdownId}',1)">›</button></div>`;
  html+=`<div class="cal-weekdays">${weekdays.map(d=>`<span>${d}</span>`).join('')}</div>`;
  const firstDay=new Date(currentYear,currentMonth,1).getDay();
  const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();
  html+=`<div class="cal-days">`;
  for(let i=0;i<firstDay;i++)html+=`<div class="cal-day empty"></div>`;
  for(let d=1;d<=daysInMonth;d++){
    const dt=new Date(currentYear,currentMonth,d);dt.setHours(0,0,0,0);
    const isPast=dt<minDate;
    const isSelected=input.value===`${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday=dt.getTime()===new Date().setHours(0,0,0,0);
    html+=`<div class="cal-day${isPast?' disabled':''}${isSelected?' selected':''}${isToday?' today':''}" onclick="event.stopPropagation();calSelect('${inputId}','${dropdownId}',${currentYear},${currentMonth},${d})">${d}</div>`;
  }
  html+=`</div>`;
  dropdown.innerHTML=html;
}
function calSelect(inputId,dropdownId,y,m,d){
  const input=document.getElementById(inputId);const dropdown=document.getElementById(dropdownId);
  input.value=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  dropdown.classList.remove('show');
  input.dispatchEvent(new Event('change'));
}
document.addEventListener('click',function(e){
  document.querySelectorAll('.cal-dropdown').forEach(d=>{
    if(!d.contains(e.target)&&!d.previousElementSibling?.contains(e.target)){
      d.classList.remove('show');
    }
  });
});

/* ===== COUNTER ANIMATION ===== */
function initCounters(){
  const counters=document.querySelectorAll('.counter');
  if(!counters.length)return;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el=entry.target;const target=parseInt(el.dataset.target);
        let current=0;const step=Math.ceil(target/60);
        const timer=setInterval(()=>{
          current+=step;
          if(current>=target){current=target;clearInterval(timer)}
          el.textContent=current.toLocaleString();
        },20);
        observer.unobserve(el);
      }
    });
  },{threshold:0.5});
  counters.forEach(c=>observer.observe(c));
}

/* ===== PERFORMANCE UTILITIES ===== */

// Throttle: 限制ฟังก์ชันทำงานได้สูงสุด 1 ครั้งต่อ N ms
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce: รอจนกว่าจะหยุดพิมพ์/ทำอะไรสักอย่าง N ms แล้วค่อยทำงาน
function debounce(func, wait, immediate) {
  let timeout;
  return function(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Lazy Load Images with Intersection Observer
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  lazyImages.forEach(img => observer.observe(img));
}

// Prefetch pages - only on non-admin pages
function preloadPage(url) {
  // Skip prefetch on admin pages to avoid file:// errors
  if(window.location.pathname.includes('/admin/')) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

// Performance monitoring
function logPerformance() {
  if (window.performance) {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    if (loadTime > 0) {
      console.log(`Page load time: ${loadTime}ms`);
    }
  }
}

/* ===== INIT ===== */
function initAll(){
  initTheme();
  initSlider();
  initCounters();
  updateWishlistBadge();
  document.querySelectorAll('.theme-toggle').forEach(b=>b.addEventListener('click',toggleTheme));
  document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal()}));
  initHeader();
  initTourFilter().catch(()=>{});
  lazyLoadImages();
  preloadPage('tours.html');
  preloadPage('auth.html');
  setTimeout(logPerformance, 1000);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initAll)
} else {
  initAll();
}
