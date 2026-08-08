/* inongtravel - Admin JS */

/* ===== ADMIN INIT ===== */
let allBookings=[];let allMembers=[];let allToursAdmin=[];

async function initAdmin(){
  // Check if db is available
  if(typeof db==='undefined'||!db){
    console.error('Firebase db not initialized');
    showToast('ระบบขัดข้อง กรุารีเฟรชหน้า','error');
    return;
  }

  let user=getUser();
  if(!user||user.role!=='admin'){window.location.href='../auth.html';return}

  // Setup sidebar menu navigation
  document.querySelectorAll('.admin-menu a').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      // Remove active from all menu items
      document.querySelectorAll('.admin-menu a').forEach(x=>x.classList.remove('active'));
      // Remove active from all sections
      document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
      // Add active to clicked menu item
      a.classList.add('active');
      // Show corresponding section
      const sectionId=a.dataset.section;
      const section=document.getElementById(sectionId);
      if(section)section.classList.add('active');
    });
  });

  // Load all data
  try{
    await Promise.all([
      renderAdminStats(),renderAdminTours(),renderAdminMembers(),
      renderAdminBookings(),renderAdminPromos()
    ]);
    initSearchFilters();
    renderMonthlyChart();
    renderTopTours();
    renderStatusChart();
    renderTypeChart();
  }catch(e){
    console.error('Admin init error:',e);
    showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล','error');
  }
}

/* ===== DASHBOARD STATS ===== */
async function renderAdminStats(){
  try{
    const[users,bookings,tours]=await Promise.all([
      db.collection('users').get().then(s=>s.docs.map(d=>({id:d.id,...d.data()}))),
      db.collection('bookings').get().then(s=>s.docs.map(d=>({id:d.id,...d.data()}))),
      db.collection('tours').get().then(s=>s.docs.map(d=>({id:d.id,...d.data()})))
    ]);
    allMembers=users;allBookings=bookings;allToursAdmin=tours;
    document.getElementById('statMembers').textContent=users.length;
    document.getElementById('statBookings').textContent=bookings.length;
    document.getElementById('statRevenue').innerHTML=`฿${bookings.filter(b=>b.status==='active').reduce((s,b)=>s+(b.total||0),0).toLocaleString()}`;
    document.getElementById('statTours').textContent=tours.length;
  }catch(e){
    console.error('Error loading stats:',e);
    document.getElementById('statMembers').textContent='0';
    document.getElementById('statBookings').textContent='0';
    document.getElementById('statRevenue').innerHTML='฿0';
    document.getElementById('statTours').textContent='0';
  }
}

/* ===== STATUS CHART ===== */
function renderStatusChart(){
  const el=document.getElementById('statusChart');
  if(!el)return;
  const counts={pending:0,active:0,cancel:0};
  allBookings.forEach(b=>{if(counts[b.status]!==undefined)counts[b.status]++});
  const total=Object.values(counts).reduce((a,b)=>a+b,0)||1;
  const data=[
    {label:'รอตรวจสอบ',count:counts.pending,color:'#f1c40f'},
    {label:'ยืนยันแล้ว',count:counts.active,color:'#2ecc71'},
    {label:'ยกเลิก',count:counts.cancel,color:'#e74c3c'}
  ];
  el.innerHTML=data.map(d=>{
    const pct=Math.round(d.count/total*100);
    return `<div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:.82rem;color:var(--text-2);">${d.label}</span><span style="font-size:.82rem;font-weight:600;color:${d.color};">${d.count} (${pct}%)</span></div>
      <div style="width:100%;height:8px;background:var(--bg-4);border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${d.color};border-radius:4px;transition:width .5s;"></div></div>
    </div>`;
  }).join('');
}

/* ===== TYPE CHART ===== */
function renderTypeChart(){
  const el=document.getElementById('typeChart');
  if(!el)return;
  const typeCounts={beach:0,mountain:0,city:0,adventure:0};
  const typeLabels={beach:'ชายหาด',mountain:'ภูเขา',city:'เมือง',adventure:'ผจญภัย'};
  const typeColors={beach:'#3498db',mountain:'#2ecc71',city:'#9b59b6',adventure:'#e67e22'};
  // Use allToursAdmin instead of TOURS
  const tours=typeof allToursAdmin!=='undefined'?allToursAdmin:(typeof TOURS!=='undefined'?TOURS:[]);
  tours.forEach(t=>{if(typeCounts[t.type]!==undefined)typeCounts[t.type]++});
  const total=Object.values(typeCounts).reduce((a,b)=>a+b,0)||1;
  el.innerHTML=Object.entries(typeCounts).map(([k,v])=>{
    const pct=Math.round(v/total*100);
    return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
      <div style="width:12px;height:12px;border-radius:3px;background:${typeColors[k]};flex-shrink:0;"></div>
      <div style="flex:1;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:.82rem;color:var(--text-2);">${typeLabels[k]}</span><span style="font-size:.82rem;font-weight:500;">${v} ทัวร์</span></div>
      <div style="width:100%;height:6px;background:var(--bg-4);border-radius:3px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${typeColors[k]};border-radius:3px;"></div></div></div>
    </div>`;
  }).join('');
}

/* ===== MONTHLY CHART ===== */
function renderMonthlyChart(){
  const chart=document.getElementById('monthlyChart');
  const labels=document.getElementById('monthLabels');
  if(!chart||!labels)return;
  const months=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const now=new Date();const currentMonth=now.getMonth();const currentYear=now.getFullYear();
  const monthly=new Array(12).fill(0);
  allBookings.forEach(b=>{
    if(!b.createdAt)return;
    const d=new Date(b.createdAt);
    if(d.getFullYear()===currentYear)monthly[d.getMonth()]+=(b.total||0);
  });
  const maxVal=Math.max(...monthly,1);
  chart.innerHTML=monthly.map((v,i)=>{
    const h=Math.max(4,(v/maxVal)*180);
    const isActive=i===currentMonth;
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="font-size:.65rem;color:var(--gold);white-space:nowrap;">${v>0?'฿'+(v/1000).toFixed(0)+'k':''}</div><div style="width:100%;max-width:40px;height:${h}px;background:${isActive?'var(--gold)':'var(--bg-4)'};border-radius:4px 4px 0 0;transition:height .5s;"></div></div>`;
  }).join('');
  labels.innerHTML=months.map((m,i)=>`<span${i===currentMonth?' style="color:var(--gold);font-weight:600;"':''}>${m}</span>`).join('');
}

/* ===== TOP TOURS ===== */
function renderTopTours(){
  const el=document.getElementById('topTours');
  if(!el)return;
  const tourSales={};
  allBookings.filter(b=>b.status==='active').forEach(b=>{
    const tid=b.tourId||b.tourName;
    if(!tourSales[tid])tourSales[tid]={name:b.tourName||tid,count:0,revenue:0};
    tourSales[tid].count++;tourSales[tid].revenue+=(b.total||0);
  });
  const sorted=Object.values(tourSales).sort((a,b)=>b.revenue-a.revenue).slice(0,5);
  if(!sorted.length){el.innerHTML='<p style="color:var(--text-3);font-size:.85rem;">ยังไม่มีข้อมูล</p>';return}
  el.innerHTML=sorted.map((t,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;${i<sorted.length-1?'border-bottom:1px solid var(--border);':''}">
    <div style="width:24px;height:24px;border-radius:50%;background:${i<3?'var(--gold)':'var(--bg-4)'};display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:${i<3?'#fff':'var(--text-3)'};">${i+1}</div>
    <div style="flex:1;min-width:0;"><div style="font-size:.85rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.name}</div><div style="font-size:.72rem;color:var(--text-3);">${t.count} การจอง</div></div>
    <div style="font-size:.82rem;font-weight:600;color:var(--gold);">฿${t.revenue.toLocaleString()}</div>
  </div>`).join('');
}

/* ===== TOURS ===== */
async function renderAdminTours(){
  const tbody=document.getElementById('tourTableBody');
  if(!tbody)return;

  // Show loading
  tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-3);"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i><br>กำลังโหลดข้อมูลทัวร์...</td></tr>';

  let tours=[];

  // Try to load from Firestore first
  try{
    const snap=await db.collection('tours').get();
    if(!snap.empty){
      tours=snap.docs.map(d=>({id:d.id,...d.data()}));
      console.log('Loaded tours from Firestore:', tours.length);
    } else {
      console.log('No tours in Firestore, using TOURS array');
      tours=typeof TOURS!=='undefined'?TOURS:[];
    }
  }catch(e){
    console.error('Error loading tours from Firestore:',e);
    tours=typeof TOURS!=='undefined'?TOURS:[];
  }

  allToursAdmin=tours;
  filterAndRenderTours();
}

function filterAndRenderTours(){
  const tbody=document.getElementById('tourTableBody');
  if(!tbody)return;
  let tours=[...allToursAdmin];
  const search=(document.getElementById('adminTourSearch')?.value||'').toLowerCase();
  const filter=document.getElementById('adminTourFilter')?.value||'all';
  if(search)tours=tours.filter(t=>t.name.toLowerCase().includes(search)||t.country.toLowerCase().includes(search));
  if(filter!=='all')tours=tours.filter(t=>t.type===filter);
  const typeLabels={beach:'ชายหาด',mountain:'ภูเขา',city:'เมือง',adventure:'ผจญภัย'};
  tbody.innerHTML=tours.length?tours.map(t=>{
    // Get price from packages or fallback to t.price
    const minPrice=t.packages?Math.min(...t.packages.map(p=>p.price)):(parseInt(t.price)||0);
    const hasPackages=t.packages&&t.packages.length>0;
    const priceDisplay=hasPackages?`฿${minPrice.toLocaleString()}+`:`฿${minPrice.toLocaleString()}`;
    const pkgCount=hasPackages?` (${t.packages.length} แพ็กเกจ)`:'';
    return `<tr><td>#${String(t.id).slice(-4)}</td><td><div style="display:flex;align-items:center;gap:8px;"><img src="${t.images?.[0]||t.img||''}" style="width:48px;height:36px;border-radius:4px;object-fit:cover;">${t.name}</div></td><td>${t.country}</td><td>${typeLabels[t.type]||t.type}</td><td style="color:var(--gold);">${priceDisplay}</td><td style="font-size:.75rem;color:var(--text-3);">${pkgCount||'-'}</td><td><span class="status ${t.hidden?'status-cancel':'status-active'}">${t.hidden?'ซ่อน':'แสดง'}</span></td><td style="white-space:nowrap;"><button class="btn btn-outline btn-sm" onclick="openEditTour('${t.id}')" title="แก้ไข"><i class="fas fa-edit"></i></button> <button class="btn btn-outline btn-sm" onclick="toggleTourVisibility('${t.id}',${!!t.hidden})" title="${t.hidden?'แสดง':'ซ่อน'}"><i class="fas fa-${t.hidden?'eye':'eye-slash'}"></i></button> <button class="btn btn-outline btn-sm btn-danger" onclick="deleteTour('${t.id}')" title="ลบ"><i class="fas fa-trash"></i></button></td></tr>`;
  }).join(''):'<tr><td colspan="8" style="text-align:center;color:var(--text-3);">ไม่พบทัวร์</td></tr>';
}

function initSearchFilters(){
  document.getElementById('adminTourSearch')?.addEventListener('input',filterAndRenderTours);
  document.getElementById('adminTourFilter')?.addEventListener('change',filterAndRenderTours);
  document.getElementById('adminBookingSearch')?.addEventListener('input',filterAndRenderBookings);
  document.getElementById('adminBookingStatus')?.addEventListener('change',filterAndRenderBookings);
  document.getElementById('adminMemberSearch')?.addEventListener('input',filterAndRenderMembers);
}

/* Confirm dialog */
let confirmCallback=null;
function showConfirm(title,msg,onConfirm){
  document.getElementById('confirmTitle').textContent=title;
  document.getElementById('confirmMsg').textContent=msg;
  confirmCallback=onConfirm;
  document.getElementById('confirmModal').classList.add('show');document.body.style.overflow='hidden';
}
function closeConfirm(){document.getElementById('confirmModal').classList.remove('show');document.body.style.overflow='';confirmCallback=null}
document.getElementById('confirmOkBtn')?.addEventListener('click',()=>{if(confirmCallback)confirmCallback();closeConfirm()});
document.getElementById('confirmCancelBtn')?.addEventListener('click',closeConfirm);

function deleteTour(id){
  showConfirm('ลบทัวร์','ต้องการลบทัวร์นี้ถาวร?',async()=>{
    try{
      if(!db){showToast('ระบบขัดข้อง กรุารีเฟรชหน้า','error');return}
      await db.collection('tours').doc(id).delete();
      showToast('ลบทัวร์สำเร็จ','success');
      renderAdminTours();
      renderAdminStats();
    }catch(e){
      console.error('Delete tour error:',e);
      if(e.code==='permission-denied'){
        showToast('ไม่มีสิทธิ์ลบข้อมูล กรุณาตั้งค่า Firestore Rules','error');
      }else{
        showToast('ลบไม่ได้: '+e.message,'error');
      }
    }
  });
}

async function toggleTourVisibility(id,currentlyHidden){
  try{await db.collection('tours').doc(id).update({hidden:!currentlyHidden});showToast(currentlyHidden?'แสดงทัวร์แล้ว':'ซ่อนทัวร์แล้ว','success');renderAdminTours()}catch(e){showToast('เกิดข้อผิดพลาด','error')}
}

function openEditTour(id){
  let t=allToursAdmin.find(x=>x.id===id)||TOURS.find(x=>x.id===id);
  if(!t){showToast('ไม่พบทัวร์','error');return}
  document.getElementById('editTourId').value=t.id;
  document.getElementById('editTourName').value=t.name||'';
  document.getElementById('editTourCountry').value=t.country||'';
  document.getElementById('editTourType').value=t.type||'city';
  // Get price from packages or fallback
  const minPrice=t.packages?Math.min(...t.packages.map(p=>p.price)):(t.price||0);
  document.getElementById('editTourPrice').value=minPrice;
  document.getElementById('editTourNights').value=t.nights||1;
  document.getElementById('editTourSeats').value=t.seats||30;
  document.getElementById('editTourImages').value=(t.images||[]).join('\n');
  document.getElementById('editTourDesc').value=t.desc||'';
  // Get includes from packages or fallback
  const pkgIncludes=t.packages&&t.packages[0]?t.packages[0].includes:(t.includes||[]);
  document.getElementById('editTourIncludes').value=pkgIncludes.join(', ');
  document.getElementById('editTourModal').classList.add('show');document.body.style.overflow='hidden';
}
function closeEditTour(){document.getElementById('editTourModal').classList.remove('show');document.body.style.overflow=''}
async function saveEditTour(e){
  e.preventDefault();
  const id=document.getElementById('editTourId').value;
  const f=e.target;
  const images=f.images.value.split('\n').map(s=>s.trim()).filter(Boolean);
  const includes=f.includes.value.split(',').map(s=>s.trim()).filter(Boolean);
  const price=parseInt(f.price.value)||0;
  try{
    // Check if tour has existing packages
    const existingTour=allToursAdmin.find(t=>t.id===id);
    const hasPackages=existingTour&&existingTour.packages&&existingTour.packages.length>0;
    
    // Create or update packages
    let packages=[];
    if(hasPackages){
      // Update existing packages with new price
      packages=existingTour.packages.map(p=>({...p,price:Math.round(price*(p.tier==='standard'?1:p.tier==='deluxe'?1.5:2))}));
    }else{
      // Create new packages
      packages=[
        {tier:'standard',name:'แพ็กเกจปกติ',price:price,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:includes,itinerary:[]},
        {tier:'deluxe',name:'แพ็กเกจหรู',price:Math.round(price*1.5),desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:[...includes,'อาหาร 3 มื้อ','Private Transfer'],itinerary:[]},
        {tier:'premium',name:'แพ็กเกจพรีเมียม',price:Math.round(price*2),desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:[...includes,'อาหารครบทุกมื้อ','Private Guide','Spa'],itinerary:[]}
      ];
    }

    await db.collection('tours').doc(id).set({
      name:f.name.value,country:f.country.value,type:f.type.value,
      price:price,nights:parseInt(f.nights.value),
      seats:parseInt(f.seats.value)||30,desc:f.desc.value,images,
      includes:packages[0].includes,packages
    },{merge:true});
    closeEditTour();showToast('บันทึกสำเร็จ!','success');renderAdminTours();
  }catch(err){showToast('เกิดข้อผิดพลาด','error')}
}

async function addTour(e){
  e.preventDefault();
  const f=e.target;
  const images=f.images.value.split('\n').map(s=>s.trim()).filter(Boolean);
  if(!images.length)images.push('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80');
  const price=parseInt(f.price.value)||0;
  const includes=f.includes.value.split(',').map(s=>s.trim()).filter(Boolean);
  
  // Create packages
  const packages=[
    {tier:'standard',name:'แพ็กเกจปกติ',price:price,desc:'โรงแรม 3 ดาว อาหารเช้า',includes:includes,itinerary:[]},
    {tier:'deluxe',name:'แพ็กเกจหรู',price:Math.round(price*1.5),desc:'โรงแรม 4 ดาว อาหาร 3 มื้อ',includes:[...includes,'อาหาร 3 มื้อ','Private Transfer'],itinerary:[]},
    {tier:'premium',name:'แพ็กเกจพรีเมียม',price:Math.round(price*2),desc:'โรงแรม 5 ดาว อาหารครบ VIP',includes:[...includes,'อาหารครบทุกมื้อ','Private Guide','Spa'],itinerary:[]}
  ];

  try{
    await db.collection('tours').add({
      name:f.name.value,country:f.country.value,type:f.type.value,
      price:price,nights:parseInt(f.nights.value),
      seats:parseInt(f.seats.value)||30,desc:f.desc.value,images,
      img:images[0],
      rating:5,reviews:0,badge:'new',hidden:false,
      includes:packages[0].includes,excludes:[],itinerary:[],packages
    });
    f.reset();document.getElementById('addTourForm').style.display='none';
    renderAdminTours();renderAdminStats();showToast('เพิ่มทัวร์สำเร็จ!','success');
  }catch(err){showToast('เกิดข้อผิดพลาด','error')}
}

/* ===== BOOKINGS ===== */
async function renderAdminBookings(){
  const tbody=document.getElementById('bookingTableBody');
  if(!tbody)return;
  try{
    const snap=await db.collection('bookings').get();
    allBookings=snap.docs.map(d=>({id:d.id,...d.data()}));
    allBookings.sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
    filterAndRenderBookings();
  }catch(e){
    console.error('Error loading bookings:',e);
    tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--text-3);">ไม่สามารถโหลดข้อมูล: '+e.message+'</td></tr>';
  }
}

function filterAndRenderBookings(){
  const tbody=document.getElementById('bookingTableBody');
  if(!tbody)return;
  let bookings=[...allBookings];
  const search=(document.getElementById('adminBookingSearch')?.value||'').toLowerCase();
  const status=document.getElementById('adminBookingStatus')?.value||'all';
  if(search)bookings=bookings.filter(b=>(b.firstName+' '+b.lastName).toLowerCase().includes(search)||b.tourName?.toLowerCase().includes(search));
  if(status!=='all')bookings=bookings.filter(b=>b.status===status);
  tbody.innerHTML=bookings.length?bookings.map(b=>`<tr><td style="font-family:monospace;font-size:.78rem;">#${b.id.slice(-6).toUpperCase()}</td><td>${b.firstName} ${b.lastName}</td><td>${b.tourName}</td><td>${b.date}</td><td>${b.travelers} คน</td><td style="color:var(--gold);">฿${(b.total||0).toLocaleString()}</td><td><span class="status status-${b.status}">${b.status==='active'?'ยืนยันแล้ว':b.status==='pending'?'รอตรวจสอบ':'ยกเลิก'}</span></td><td style="white-space:nowrap;"><button class="btn btn-outline btn-sm" onclick="showBookingDetail('${b.id}')" title="ดูรายละเอียด"><i class="fas fa-eye"></i></button> ${b.status==='pending'?`<button class="btn btn-success btn-sm" onclick="updateBooking('${b.id}','active')" title="อนุมัติ"><i class="fas fa-check"></i></button> <button class="btn btn-danger btn-sm" onclick="updateBooking('${b.id}','cancel')" title="ยกเลิก"><i class="fas fa-times"></i></button>`:''} <button class="btn btn-outline btn-sm btn-danger" onclick="deleteBooking('${b.id}')" title="ลบ"><i class="fas fa-trash"></i></button></td></tr>`).join(''):'<tr><td colspan="8" style="text-align:center;color:var(--text-3);">ไม่พบข้อมูล</td></tr>';
}

async function updateBooking(id,status){
  try{await db.collection('bookings').doc(id).update({status});showToast(status==='active'?'อนุมัติแล้ว':'ยกเลิกแล้ว',status==='active'?'success':'info');renderAdminBookings();renderAdminStats()}catch(e){showToast('เกิดข้อผิดพลาด','error')}
}

function deleteBooking(id){
  showConfirm('ลบการจอง','ต้องการลบการจองนี้ถาวร?',async()=>{
    try{
      if(!db){showToast('ระบบขัดข้อง กรุารีเฟรชหน้า','error');return}
      await db.collection('bookings').doc(id).delete();
      showToast('ลบสำเร็จ','success');
      renderAdminBookings();
      renderAdminStats();
    }catch(e){
      console.error('Delete booking error:',e);
      if(e.code==='permission-denied'){
        showToast('ไม่มีสิทธิ์ลบข้อมูล กรุณาตั้งค่า Firestore Rules','error');
      }else{
        showToast('ลบไม่ได้: '+e.message,'error');
      }
    }
  });
}

function showBookingDetail(id){
  const b=allBookings.find(x=>x.id===id);
  if(!b)return;
  const el=document.getElementById('bookingDetailContent');
  el.innerHTML=`
  <h3 style="font-family:'Poppins',sans-serif;font-size:1.1rem;margin-bottom:20px;"><i class="fas fa-receipt" style="color:var(--gold);"></i> รายละเอียดการจอง</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <div><label style="font-size:.75rem;color:var(--text-3);">รหัสการจอง</label><p style="font-family:monospace;font-weight:600;">#${id.slice(-6).toUpperCase()}</p></div>
    <div><label style="font-size:.75rem;color:var(--text-3);">สถานะ</label><p><span class="status status-${b.status}">${b.status==='active'?'ยืนยันแล้ว':b.status==='pending'?'รอตรวจสอบ':'ยกเลิก'}</span></p></div>
    <div><label style="font-size:.75rem;color:var(--text-3);">ชื่อลูกค้า</label><p>${b.firstName} ${b.lastName}</p></div>
    <div><label style="font-size:.75rem;color:var(--text-3);">เบอร์โทร</label><p>${b.phone||'-'}</p></div>
    <div><label style="font-size:.75rem;color:var(--text-3);">ทัวร์</label><p>${b.tourName}</p></div>
    <div><label style="font-size:.75rem;color:var(--text-3);">วันเดินทาง</label><p>${b.date}</p></div>
    <div><label style="font-size:.75rem;color:var(--text-3);">จำนวนผู้เดินทาง</label><p>${b.travelers} คน</p></div>
    <div><label style="font-size:.75rem;color:var(--text-3);">ยอดรวม</label><p style="color:var(--gold);font-weight:600;font-size:1.1rem;">฿${(b.total||0).toLocaleString()}</p></div>
    ${b.coupon?`<div><label style="font-size:.75rem;color:var(--text-3);">คูปอง</label><p>${b.coupon} (-฿${(b.discount||0).toLocaleString()})</p></div>`:''}
    <div><label style="font-size:.75rem;color:var(--text-3);">จองเมื่อ</label><p>${b.createdAt?new Date(b.createdAt).toLocaleString('th-TH'):'-'}</p></div>
  </div>
  ${b.note?`<div style="margin-top:16px;"><label style="font-size:.75rem;color:var(--text-3);">หมายเหตุ</label><p style="background:var(--bg-4);padding:10px;border-radius:6px;font-size:.85rem;">${b.note}</p></div>`:''}
  ${b.slipImage?`<div style="margin-top:16px;"><label style="font-size:.75rem;color:var(--text-3);">สลิปการโอนเงิน</label><div style="margin-top:8px;"><img src="${b.slipImage}" style="max-width:100%;max-height:300px;border-radius:8px;border:1px solid var(--border);cursor:pointer;" onclick="window.open(this.src,'_blank')" title="คลิกเพื่อดูรูปขนาดใหญ่"></div></div>`:''}`;
  document.getElementById('bookingDetailModal').classList.add('show');document.body.style.overflow='hidden';
}
function closeBookingDetail(){document.getElementById('bookingDetailModal').classList.remove('show');document.body.style.overflow=''}

/* ===== EXPORT PDF ===== */
function exportBookingsPDF(){
  let bookings=[...allBookings];
  const status=document.getElementById('adminBookingStatus')?.value||'all';
  if(status!=='all')bookings=bookings.filter(b=>b.status===status);
  let html=`<html><head><meta charset="utf-8"><title>รายงานการจอง - inongtravel</title><style>body{font-family:'Sarabun',sans-serif;padding:40px;}h1{text-align:center;color:#c9a96e;margin-bottom:8px;}h2{text-align:center;font-size:14px;color:#666;margin-bottom:30px;}table{width:100%;border-collapse:collapse;margin-top:20px;}th,td{border:1px solid #ddd;padding:8px 10px;font-size:12px;text-align:left;}th{background:#f5f5f0;font-weight:600;}.total{text-align:right;font-weight:bold;font-size:14px;margin-top:20px;}.gold{color:#c9a96e;}</style></head><body><h1>inongtravel</h1><h2>รายงานการจองทั้งหมด (${new Date().toLocaleDateString('th-TH')})</h2><table><thead><tr><th>รหัส</th><th>ลูกค้า</th><th>ทัวร์</th><th>วันเดินทาง</th><th>จำนวน</th><th>ยอดรวม</th><th>สถานะ</th></tr></thead><tbody>`;
  bookings.forEach(b=>{
    html+=`<tr><td>#${b.id.slice(-6).toUpperCase()}</td><td>${b.firstName} ${b.lastName}</td><td>${b.tourName}</td><td>${b.date}</td><td>${b.travelers}</td><td class="gold">฿${(b.total||0).toLocaleString()}</td><td>${b.status==='active'?'ยืนยัน':b.status==='pending'?'รอตรวจสอบ':'ยกเลิก'}</td></tr>`;
  });
  const total=bookings.filter(b=>b.status==='active').reduce((s,b)=>s+(b.total||0),0);
  html+=`</tbody></table><div class="total">รายได้รวม: <span class="gold">฿${total.toLocaleString()}</span></div></body></html>`;
  const win=window.open('','_blank');win.document.write(html);win.document.close();win.print();
}

/* ===== EXPORT MEMBERS EXCEL ===== */
function exportMembersExcel(){
  let csv='\uFEFF';
  csv+='รหัส,ชื่อ,นามสกุล,อีเมล,เบอร์โทร,วันที่สมัคร,สถานะ\n';
  allMembers.forEach(m=>{
    const status=m.suspended?'ระงับ':m.role==='admin'?'แอดมิน':'สมาชิก';
    csv+=`#${String(m.id).slice(-4)},${m.firstName},${m.lastName},${m.email},${m.phone||'-'},${m.createdAt?new Date(m.createdAt).toLocaleDateString('th-TH'):'-'},${status}\n`;
  });
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`members_${new Date().toISOString().slice(0,10)}.csv`;a.click();
  showToast('Export สำเร็จ!','success');
}

/* ===== EXPORT EXCEL (CSV) ===== */
function exportBookingsExcel(){
  let bookings=[...allBookings];
  const status=document.getElementById('adminBookingStatus')?.value||'all';
  if(status!=='all')bookings=bookings.filter(b=>b.status===status);
  let csv='\uFEFF'; // BOM for Thai
  csv+='รหัส,ลูกค้า,ทัวร์,วันเดินทาง,จำนวน,ยอดรวม,สถานะ\n';
  bookings.forEach(b=>{
    csv+=`#${b.id.slice(-6).toUpperCase()},${b.firstName} ${b.lastName},${b.tourName},${b.date},${b.travelers},${b.total||0},${b.status==='active'?'ยืนยัน':b.status==='pending'?'รอตรวจสอบ':'ยกเลิก'}\n`;
  });
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`bookings_${new Date().toISOString().slice(0,10)}.csv`;a.click();
}

/* ===== MEMBERS ===== */
async function renderAdminMembers(){
  const tbody=document.getElementById('memberTableBody');
  if(!tbody)return;
  try{
    const snap=await db.collection('users').get();
    allMembers=snap.docs.map(d=>({id:d.id,...d.data()}));
    filterAndRenderMembers();
  }catch(e){
    console.error('Error loading members:',e);
    tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--text-3);">ไม่สามารถโหลดข้อมูล: '+e.message+'</td></tr>';
  }
}

function filterAndRenderMembers(){
  const tbody=document.getElementById('memberTableBody');
  if(!tbody)return;
  let members=[...allMembers];
  const search=(document.getElementById('adminMemberSearch')?.value||'').toLowerCase();
  if(search)members=members.filter(m=>(m.firstName+' '+m.lastName).toLowerCase().includes(search)||m.email?.toLowerCase().includes(search));
  tbody.innerHTML=members.length?members.map(m=>`<tr><td style="font-family:monospace;font-size:.78rem;">#${String(m.id).slice(-4)}</td><td><div style="display:flex;align-items:center;gap:8px;"><img src="https://ui-avatars.com/api/?name=${m.firstName}+${m.lastName}&background=c9a96e&color=fff&size=32" style="width:32px;height:32px;border-radius:50%;">${m.firstName} ${m.lastName}</div></td><td>${m.email}</td><td>${m.phone||'-'}</td><td>${m.createdAt?new Date(m.createdAt).toLocaleDateString('th-TH'):'-'}</td><td><span class="status ${m.suspended?'status-cancel':m.role==='admin'?'status-active':'status-pending'}">${m.suspended?'ระงับ':m.role==='admin'?'แอดมิน':'สมาชิก'}</span></td><td style="white-space:nowrap;"><button class="btn btn-outline btn-sm" onclick="showMemberDetail('${m.id}')" title="ดูรายละเอียด"><i class="fas fa-eye"></i></button> <button class="btn btn-outline btn-sm" onclick="toggleSuspend('${m.id}',${!!m.suspended})" title="${m.suspended?'ระงับ':'ปลดล็อค'}"><i class="fas fa-${m.suspended?'unlock':'ban'}"></i></button> <button class="btn btn-outline btn-sm btn-danger" onclick="deleteMember('${m.id}')" title="ลบ"><i class="fas fa-trash"></i></button></td></tr>`).join(''):'<tr><td colspan="7" style="text-align:center;color:var(--text-3);">ไม่พบสมาชิก</td></tr>';
}

async function toggleSuspend(id,currentlySuspended){
  showConfirm(currentlySuspended?'ปลดล็อคบัญชี':'ระงับบัญชี',currentlySuspended?'ต้องการปลดล็อคบัญชีนี้?':'ต้องการระงับบัญชีนี้? สมาชิกจะไม่สามารถเข้าสู่ระบบได้',async()=>{
    try{await db.collection('users').doc(id).update({suspended:!currentlySuspended});showToast(currentlySuspended?'ปลดล็อคแล้ว':'ระงับแล้ว','success');renderAdminMembers()}catch(e){showToast('เกิดข้อผิดพลาด','error')}
  });
}

function deleteMember(id){
  showConfirm('ลบสมาชิก','ต้องการลบสมาชิกนี้ถาวร?',async()=>{
    try{
      if(!db){showToast('ระบบขัดข้อง กรุารีเฟรชหน้า','error');return}
      await db.collection('users').doc(id).delete();
      showToast('ลบสมาชิกสำเร็จ','success');
      renderAdminMembers();
      renderAdminStats();
    }catch(e){
      console.error('Delete member error:',e);
      if(e.code==='permission-denied'){
        showToast('ไม่มีสิทธิ์ลบข้อมูล กรุณาตั้งค่า Firestore Rules','error');
      }else{
        showToast('ลบไม่ได้: '+e.message,'error');
      }
    }
  });
}

async function showMemberDetail(id){
  const m=allMembers.find(x=>x.id===id);
  if(!m)return;
  // Load member's bookings
  let memberBookings=[];
  try{
    const snap=await db.collection('bookings').where('userId','==',id).get();
    memberBookings=snap.docs.map(d=>({id:d.id,...d.data()}));
    memberBookings.sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
  }catch{}
  const el=document.getElementById('memberDetailContent');
  el.innerHTML=`
  <h3 style="font-family:'Poppins',sans-serif;font-size:1.1rem;margin-bottom:20px;"><i class="fas fa-user" style="color:var(--gold);"></i> รายละเอียดสมาชิก</h3>
  <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
    <img src="https://ui-avatars.com/api/?name=${m.firstName}+${m.lastName}&background=c9a96e&color=fff&size=64" style="width:64px;height:64px;border-radius:50%;border:3px solid var(--gold);">
    <div><h4>${m.firstName} ${m.lastName}</h4><p style="color:var(--text-3);font-size:.85rem;">${m.email}</p><p style="color:var(--text-3);font-size:.82rem;">เบอร์โทร: ${m.phone||'-'}</p></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
    <div style="background:var(--bg-4);padding:12px;border-radius:8px;"><div style="font-size:.72rem;color:var(--text-3);">วันที่สมัคร</div><div style="font-weight:600;">${m.createdAt?new Date(m.createdAt).toLocaleDateString('th-TH'):'-'}</div></div>
    <div style="background:var(--bg-4);padding:12px;border-radius:8px;"><div style="font-size:.72rem;color:var(--text-3);">สถานะ</div><div><span class="status ${m.suspended?'status-cancel':'status-active'}">${m.suspended?'ระงับ':'ใช้งาน'}</span></div></div>
  </div>
  <h4 style="font-family:'Poppins',sans-serif;font-size:.95rem;margin-bottom:12px;"><i class="fas fa-calendar-check" style="color:var(--gold);"></i> ประวัติการจอง (${memberBookings.length})</h4>
  ${memberBookings.length?memberBookings.map(b=>`<div style="display:flex;gap:10px;padding:10px;background:var(--bg-4);border-radius:8px;margin-bottom:8px;align-items:center;">
    <div style="flex:1;"><div style="font-size:.85rem;font-weight:500;">${b.tourName}</div><div style="font-size:.75rem;color:var(--text-3);">วันเดินทาง: ${b.date} | ${b.travelers} คน</div></div>
    <div style="text-align:right;"><div style="font-weight:600;color:var(--gold);font-size:.85rem;">฿${(b.total||0).toLocaleString()}</div><span class="status status-${b.status}" style="font-size:.68rem;">${b.status==='active'?'ยืนยัน':b.status==='pending'?'รอตรวจสอบ':'ยกเลิก'}</span></div>
  </div>`).join(''):'<p style="color:var(--text-3);font-size:.85rem;">ยังไม่มีประวัติการจอง</p>'}`;
  document.getElementById('memberDetailModal').classList.add('show');document.body.style.overflow='hidden';
}
function closeMemberDetail(){document.getElementById('memberDetailModal').classList.remove('show');document.body.style.overflow=''}

/* ===== PROMOS ===== */
async function renderAdminPromos(){
  const tbody=document.getElementById('promoTableBody');
  if(!tbody)return;
  try{
    const snap=await db.collection('promos').get();
    const promos=snap.docs.map(d=>({id:d.id,...d.data()}));
    tbody.innerHTML=promos.length?promos.map(p=>{
      const now=new Date();
      const isExpired=p.endDate&&new Date(p.endDate)<now;
      const usedCount=p.usedCount||0;const maxUses=p.maxUses||'-';
      return `<tr><td style="font-family:monospace;font-size:.78rem;">#${p.id.slice(-4)}</td><td>${p.name}</td><td style="color:var(--gold);font-weight:600;">${p.discountFlat?`฿${p.discountFlat}`:''}${p.discountPercent?`${p.discountPercent}%`:''}</td><td style="font-family:monospace;background:var(--gold-bg);padding:2px 8px;border-radius:4px;">${p.code}</td><td>${usedCount}/${maxUses}</td><td>${p.minPurchase?`฿${p.minPurchase.toLocaleString()}`:'-'}</td><td>${p.endDate||'-'}</td><td><span class="status ${isExpired?'status-cancel':'status-active'}">${isExpired?'หมดอายุ':'ใช้งาน'}</span></td><td style="white-space:nowrap;"><button class="btn btn-outline btn-sm" onclick="openEditPromo('${p.id}')" title="แก้ไข"><i class="fas fa-edit"></i></button> <button class="btn btn-outline btn-sm btn-danger" onclick="deletePromo('${p.id}')" title="ลบ"><i class="fas fa-trash"></i></button></td></tr>`;
    }).join(''):'<tr><td colspan="9" style="text-align:center;color:var(--text-3);">ยังไม่มีโปรโมชั่น</td></tr>';
  }catch(e){
    console.error('Error loading promos:',e);
    tbody.innerHTML='<tr><td colspan="9" style="text-align:center;color:var(--text-3);">ไม่สามารถโหลดข้อมูล: '+e.message+'</td></tr>';
  }
}

function showAddPromoForm(){
  document.getElementById('addPromoForm').style.display=document.getElementById('addPromoForm').style.display==='none'?'block':'none';
}

async function addPromo(e){
  e.preventDefault();
  const f=e.target;
  try{
    await db.collection('promos').add({
      name:f.name.value,code:f.code.value.toUpperCase(),
      discountFlat:parseInt(f.discountFlat.value)||0,
      discountPercent:parseInt(f.discountPercent.value)||0,
      startDate:f.startDate.value,endDate:f.endDate.value,
      maxUses:parseInt(f.maxUses.value)||100,usedCount:0,
      minPurchase:parseInt(f.minPurchase.value)||0,
      desc:f.desc.value,createdAt:new Date().toISOString()
    });
    f.reset();document.getElementById('addPromoForm').style.display='none';
    renderAdminPromos();showToast('เพิ่มโปรโมชั่นสำเร็จ!','success');
  }catch(err){showToast('เกิดข้อผิดพลาด','error')}
}

function deletePromo(id){
  showConfirm('ลบโปรโมชั่น','ต้องการลบโปรโมชั่นนี้?',async()=>{
    try{await db.collection('promos').doc(id).delete();showToast('ลบสำเร็จ','success');renderAdminPromos()}catch(e){showToast('ลบไม่ได้','error')}
  });
}

async function openEditPromo(id){
  try{
    const doc=await db.collection('promos').doc(id).get();
    if(!doc.exists){showToast('ไม่พบข้อมูล','error');return}
    const p=doc.data();
    document.getElementById('editPromoId').value=id;
    document.getElementById('editPromoName').value=p.name||'';
    document.getElementById('editPromoCode').value=p.code||'';
    document.getElementById('editPromoFlat').value=p.discountFlat||0;
    document.getElementById('editPromoPct').value=p.discountPercent||0;
    document.getElementById('editPromoStart').value=p.startDate||'';
    document.getElementById('editPromoEnd').value=p.endDate||'';
    document.getElementById('editPromoMax').value=p.maxUses||100;
    document.getElementById('editPromoMin').value=p.minPurchase||0;
    document.getElementById('editPromoDesc').value=p.desc||'';
    document.getElementById('editPromoModal').classList.add('show');document.body.style.overflow='hidden';
  }catch(e){showToast('เกิดข้อผิดพลาด','error')}
}
function closeEditPromo(){document.getElementById('editPromoModal').classList.remove('show');document.body.style.overflow=''}
async function saveEditPromo(e){
  e.preventDefault();
  const id=document.getElementById('editPromoId').value;
  const f=e.target;
  try{
    await db.collection('promos').doc(id).set({
      name:f.name.value,code:f.code.value.toUpperCase(),
      discountFlat:parseInt(f.discountFlat.value)||0,
      discountPercent:parseInt(f.discountPercent.value)||0,
      startDate:f.startDate.value,endDate:f.endDate.value,
      maxUses:parseInt(f.maxUses.value)||100,
      minPurchase:parseInt(f.minPurchase.value)||0,
      desc:f.desc.value
    },{merge:true});
    closeEditPromo();showToast('บันทึกสำเร็จ!','success');renderAdminPromos();
  }catch(err){showToast('เกิดข้อผิดพลาด','error')}
}

/* ===== ADMIN INIT RUN ===== */
function initAllAdmin(){initTheme();Promise.resolve(initAdmin()).catch(e=>console.error('Admin init error:',e))}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initAllAdmin)}else{initAllAdmin()}
