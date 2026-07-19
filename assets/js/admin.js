/* inongtravel - Admin JS */

/* ===== ADMIN INIT ===== */
async function initAdmin(){
  let user=getUser();
  if(!user||user.role!=='admin'){window.location.href='../auth.html';return}

  document.querySelectorAll('.admin-menu a').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelectorAll('.admin-menu a').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
      a.classList.add('active');
      document.getElementById(a.dataset.section)?.classList.add('active');
    });
  });

  await Promise.all([
    renderAdminStats(),renderAdminTours(),renderAdminMembers(),
    renderAdminBookings(),renderAdminPromos()
  ]);
}

async function renderAdminStats(){
  const[users,bookings]=await Promise.all([
    db.collection('users').get().then(s=>s.docs.map(d=>({id:d.id,...d.data()}))),
    db.collection('bookings').get().then(s=>s.docs.map(d=>({id:d.id,...d.data()})))
  ]);
  const el1=document.getElementById('statMembers');
  const el2=document.getElementById('statBookings');
  const el3=document.getElementById('statRevenue');
  const el4=document.getElementById('statTours');
  if(el1)el1.textContent=users.length;
  if(el2)el2.textContent=bookings.length;
  if(el3)el3.innerHTML=`&#3645;${bookings.reduce((s,b)=>s+(b.total||0),0).toLocaleString()}`;
  if(el4)el4.textContent=TOURS.length;
}

async function renderAdminTours(){
  const tbody=document.getElementById('tourTableBody');
  if(!tbody)return;
  let tours=TOURS;
  try{const snap=await db.collection('tours').get();if(!snap.empty){tours=snap.docs.map(d=>({id:d.id,...d.data()}))}}catch{}
  tbody.innerHTML=tours.map(t=>`<tr><td>#${String(t.id).slice(-4)}</td><td><div style="display:flex;align-items:center;gap:8px;"><img src="${t.images?.[0]||t.img||''}" style="width:48px;height:36px;border-radius:4px;object-fit:cover;">${t.name}</div></td><td>${t.country}</td><td style="color:var(--gold);">&#3645;${(parseInt(t.price)||0).toLocaleString()}</td><td>${t.rating||'-'}</td><td><span class="status status-active">ใช้งาน</span></td><td><button class="btn btn-outline btn-sm" onclick="editTourModal('${t.id}')"><i class="fas fa-edit"></i></button> <button class="btn btn-outline btn-sm btn-danger" onclick="deleteTourFromAdmin('${t.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join('');
}

async function deleteTourFromAdmin(id){
  if(!confirm('ต้องการลบทัวร์นี้?'))return;
  try{await db.collection('tours').doc(id).delete();showToast('ลบทัวร์สำเร็จ','success');renderAdminTours();renderAdminStats()}catch(e){showToast('ลบไม่ได้: '+e.message,'error')}
}

async function editTourModal(id){
  let t=TOURS.find(x=>x.id===id);
  try{const doc=await db.collection('tours').doc(id).get();if(doc.exists)t={id:doc.id,...doc.data()}}catch{}
  if(!t){showToast('ไม่พบทัวร์','error');return}
  const modal=document.getElementById('tourModal');
  if(!modal)return;
  const itinStr=(t.itinerary||[]).map(d=>`${d.day}|${d.title}|${d.desc}|${d.meals||''}`).join('\n');
  const inclStr=(t.includes||[]).join(', ');
  const exclStr=(t.excludes||[]).join(', ');
  const imgStr=(t.images||[]).join('\n');
  modal.querySelector('.modal-body').innerHTML=`
<h3 style="font-family:'Poppins',sans-serif;margin-bottom:16px;"><i class="fas fa-edit" style="color:var(--gold);"></i> แก้ไขทัวร์: ${t.name}</h3>
<form onsubmit="saveTourEdit(event,'${t.id}')">
<div class="form-row"><div class="form-group"><label>ชื่อทัวร์</label><input type="text" name="name" value="${t.name}"></div><div class="form-group"><label>ประเทศ</label><input type="text" name="country" value="${t.country}"></div></div>
<div class="form-row"><div class="form-group"><label>ประเภท</label><select name="type"><option value="beach" ${t.type==='beach'?'selected':''}>ชายหาด</option><option value="mountain" ${t.type==='mountain'?'selected':''}>ภูเขา</option><option value="city" ${t.type==='city'?'selected':''}>เมือง</option><option value="adventure" ${t.type==='adventure'?'selected':''}>ผจญภัย</option></select></div><div class="form-group"><label>ราคา (บาท)</label><input type="number" name="price" value="${t.price}"></div></div>
<div class="form-row"><div class="form-group"><label>จำนวนวัน</label><input type="number" name="nights" value="${t.nights}"></div><div class="form-group"><label>คะแนน</label><input type="number" name="rating" value="${t.rating}" step="0.1" min="0" max="5"></div></div>
<div class="form-group"><label>รายละเอียด</label><textarea rows="3" name="desc">${t.desc||''}</textarea></div>
<div class="form-group"><label>รูปภาพ URL (1 รูปต่อ 1 บรรทัด)</label><textarea rows="3" name="images">${imgStr}</textarea></div>
<div class="form-group"><label>สิ่งที่รวม (คั่นด้วย comma)</label><input type="text" name="includes" value="${inclStr}"></div>
<div class="form-group"><label>สิ่งที่ไม่รวม (คั่นด้วย comma)</label><input type="text" name="excludes" value="${exclStr}"></div>
<div class="form-group"><label>Itinerary (วันที่|หัวข้อ|รายละเอียด|อาหาร - 1 วันต่อ 1 บรรทัด)</label><textarea rows="5" name="itinerary">${itinStr}</textarea></div>
<button type="submit" class="btn btn-gold">บันทึกการแก้ไข</button>
</form>`;
  modal.classList.add('show');document.body.style.overflow='hidden';
}

async function saveTourEdit(e,id){
  e.preventDefault();
  const f=e.target;
  try{
    await db.collection('tours').doc(id).set({
      name:f.name.value,country:f.country.value,price:parseInt(f.price.value),
      nights:parseInt(f.nights.value),desc:f.desc.value,
      type:'city',rating:4.5,reviews:0,badge:'',images:[],includes:[],excludes:[],itinerary:[]
    },{merge:true});
    closeModal();showToast('บันทึกสำเร็จ!','success');renderAdminTours();
  }catch(err){showToast('เกิดข้อผิดพลาด','error')}
}

async function addTour(e){
  e.preventDefault();
  const f=e.target;
  try{
    await db.collection('tours').add({
      name:f.name.value,country:f.country.value,type:f.type.value,
      price:parseInt(f.price.value),nights:parseInt(f.nights.value),
      desc:f.desc.value,img:f.img.value||'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      images:[f.img.value||'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'],
      rating:5,reviews:0,badge:'new',
      includes:f.includes.value.split(',').map(s=>s.trim()),excludes:[],itinerary:[]
    });
    f.reset();document.getElementById('addTourForm').style.display='none';
    renderAdminTours();renderAdminStats();showToast('เพิ่มทัวร์สำเร็จ!','success');
  }catch(err){showToast('เกิดข้อผิดพลาด','error')}
}

async function renderAdminMembers(){
  const tbody=document.getElementById('memberTableBody');
  if(!tbody)return;
  try{
    const snap=await db.collection('users').get();
    const users=snap.docs.map(d=>({id:d.id,...d.data()}));
    tbody.innerHTML=users.length?users.map(u=>`<tr><td>#${String(u.id).slice(-4)}</td><td><div style="display:flex;align-items:center;gap:8px;"><img src="https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=c8a97e&color=fff&size=32" style="width:32px;height:32px;border-radius:50%;">${u.firstName} ${u.lastName}</div></td><td>${u.email}</td><td>${u.phone||'-'}</td><td>${u.createdAt?new Date(u.createdAt).toLocaleDateString('th-TH'):'-'}</td><td><span class="status ${u.role==='admin'?'status-active':'status-pending'}">${u.role==='admin'?'แอดมิน':'สมาชิก'}</span></td><td><button class="btn btn-outline btn-sm btn-danger" onclick="deleteMember('${u.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join(''):'<tr><td colspan="7" style="text-align:center;color:var(--text-3);">ยังไม่มีสมาชิก</td></tr>';
  }catch(e){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--text-3);">ไม่สามารถโหลดข้อมูล</td></tr>'}
}

async function deleteMember(id){
  if(!confirm('ต้องการลบสมาชิกนี้?'))return;
  try{await db.collection('users').doc(id).delete();showToast('ลบสมาชิกสำเร็จ','success');renderAdminMembers();renderAdminStats()}catch(e){showToast('ลบไม่ได้','error')}
}

async function renderAdminBookings(){
  const tbody=document.getElementById('bookingTableBody');
  if(!tbody)return;
  try{
    const snap=await db.collection('bookings').orderBy('createdAt','desc').get();
    const bookings=snap.docs.map(d=>({id:d.id,...d.data()}));
    tbody.innerHTML=bookings.length?bookings.map(b=>`<tr><td>#${b.id.slice(-6).toUpperCase()}</td><td>${b.firstName} ${b.lastName}</td><td>${b.tourName}</td><td>${b.date}</td><td style="color:var(--gold);">&#3645;${(b.total||0).toLocaleString()}</td><td><span class="status status-${b.status}">${b.status==='active'?'ยืนยันแล้ว':b.status==='pending'?'รอตรวจสอบ':'ยกเลิก'}</span></td><td>${b.status==='pending'?`<button class="btn btn-success btn-sm" onclick="updateBooking('${b.id}','active')"><i class="fas fa-check"></i></button> <button class="btn btn-danger btn-sm" onclick="updateBooking('${b.id}','cancel')"><i class="fas fa-times"></i></button>`:'-'}</td></tr>`).join(''):'<tr><td colspan="7" style="text-align:center;color:var(--text-3);">ยังไม่มีการจอง</td></tr>';
  }catch(e){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--text-3);">ไม่สามารถโหลดข้อมูล</td></tr>'}
}

async function updateBooking(id,status){
  try{await db.collection('bookings').doc(id).update({status});showToast(status==='active'?'อนุมัติแล้ว':'ยกเลิกแล้ว',status==='active'?'success':'info');renderAdminBookings();renderAdminStats()}catch(e){showToast('เกิดข้อผิดพลาด','error')}
}

async function renderAdminPromos(){
  const tbody=document.getElementById('promoTableBody');
  if(!tbody)return;
  try{
    const snap=await db.collection('promos').get();
    const promos=snap.docs.map(d=>({id:d.id,...d.data()}));
    tbody.innerHTML=promos.length?promos.map(p=>`<tr><td>#${p.id.slice(-4)}</td><td>${p.name}</td><td style="color:var(--gold);font-weight:600;">${p.discount}</td><td style="font-family:monospace;background:var(--gold-bg);padding:2px 8px;border-radius:4px;">${p.code}</td><td>${p.desc||'-'}</td><td>${p.expires||'-'}</td><td><span class="status status-active">ใช้งาน</span></td></tr>`).join(''):'<tr><td colspan="7" style="text-align:center;color:var(--text-3);">ยังไม่มีโปรโมชั่น</td></tr>';
  }catch(e){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--text-3);">ไม่สามารถโหลดข้อมูล</td></tr>'}
}

/* ===== ADMIN INIT RUN ===== */
function initAllAdmin(){initTheme();document.querySelectorAll('.theme-toggle').forEach(b=>b.addEventListener('click',toggleTheme));Promise.resolve(initAdmin()).catch(()=>{})}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initAllAdmin)}else{initAllAdmin()}
