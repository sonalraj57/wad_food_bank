const defaultFood=[
 {id:1,icon:"🍚",type:"Rice & Dal",qty:"10 kg",location:"Community Hall",condition:"Dry groceries"},
 {id:2,icon:"🥗",type:"Fresh Meal Boxes",qty:"25 boxes",location:"Central Area",condition:"Freshly prepared"},
 {id:3,icon:"🍞",type:"Bread & Buns",qty:"40 packs",location:"Green Market",condition:"Packaged"},
 {id:4,icon:"🥕",type:"Fresh Vegetables",qty:"8 kg",location:"Vasad Area",condition:"Fresh produce"},
 {id:5,icon:"🍎",type:"Fresh Fruits",qty:"12 kg",location:"Anand Area",condition:"Fresh produce"},
 {id:6,icon:"🥫",type:"Canned Food",qty:"20 cans",location:"Community Center",condition:"Packaged"}
];
function getData(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
function saveData(k,v){localStorage.setItem(k,JSON.stringify(v))}
function toggleMenu(){document.getElementById("nav")?.classList.toggle("show")}
function iconFor(type){let t=type.toLowerCase();if(t.includes("rice"))return"🍚";if(t.includes("bread"))return"🍞";if(t.includes("veget"))return"🥕";if(t.includes("fruit"))return"🍎";if(t.includes("meal"))return"🥗";if(t.includes("milk"))return"🥛";return"🍱"}
function renderFood(targetId="foodList"){
 const target=document.getElementById(targetId);if(!target)return;
 let donations=getData("donations",[]);
 let foods=[...donations.map((d,i)=>({id:"d"+i,icon:iconFor(d.foodType),type:d.foodType,qty:d.quantity,location:d.location,condition:d.condition||"Available"})),...defaultFood];
 const search=(document.getElementById("searchFood")?.value||"").toLowerCase();
 const filter=document.getElementById("filterFood")?.value||"all";
 foods=foods.filter(f=>(f.type+" "+f.location).toLowerCase().includes(search)&&(filter==="all"||f.condition===filter));
 target.innerHTML=foods.length?foods.map(f=>`<article class="food-card"><div class="food-icon">${f.icon}</div><h3>${escapeHtml(f.type)}</h3><p>${escapeHtml(f.qty)} · ${escapeHtml(f.location)}</p><span class="tag">${escapeHtml(f.condition)}</span></article>`).join(""):`<p class="muted">No matching food found.</p>`;
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderHome(){renderFood("homeFood")}
function renderDashboard(){
 let d=getData("donations",[]),v=getData("volunteers",[]);
 document.getElementById("dDonations")&&(document.getElementById("dDonations").textContent=d.length);
 document.getElementById("dVolunteers")&&(document.getElementById("dVolunteers").textContent=v.length);
 document.getElementById("dQuantity")&&(document.getElementById("dQuantity").textContent=d.reduce((a,x)=>a+1,0));
 let box=document.getElementById("dashList");if(!box)return;
 box.innerHTML=d.length?d.slice().reverse().slice(0,8).map(x=>`<div class="activity"><div><b>${escapeHtml(x.foodType)}</b><small> · ${escapeHtml(x.quantity)} · ${escapeHtml(x.location)}</small></div><small>${escapeHtml(x.donorName)}</small></div>`).join(""):"<p class='muted'>No custom donations yet. Add one from the Donate page.</p>";
}
function clearData(){if(confirm("Clear donations and volunteer registrations saved in this browser?")){localStorage.removeItem("donations");localStorage.removeItem("volunteers");renderDashboard();renderFood()}}
document.getElementById("donationForm")?.addEventListener("submit",e=>{
 e.preventDefault();let d={donorName:donorName.value,foodType:foodType.value,quantity:quantity.value,expiry:expiry.value,location:location.value,phone:phone.value,condition:condition.value};
 let arr=getData("donations",[]);arr.push(d);saveData("donations",arr);document.getElementById("formMessage").textContent="✓ Donation published successfully!";e.target.reset();
});
document.getElementById("volunteerForm")?.addEventListener("submit",e=>{
 e.preventDefault();let v={name:vName.value,email:vEmail.value,phone:vPhone.value,area:vArea.value,role:vRole.value};
 let arr=getData("volunteers",[]);arr.push(v);saveData("volunteers",arr);document.getElementById("volMessage").textContent="✓ Welcome to the Nourish volunteer community!";e.target.reset();
});
renderHome();renderFood();renderDashboard();
