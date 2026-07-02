function showScreen2(){screen1.classList.add('hidden');screen2.classList.remove('hidden');}
function back(){screen2.classList.add('hidden');screen1.classList.remove('hidden');}
function chat(){window.open('https://elevenlabs.io/app/talk-to?agent_id=agent_1301k9eqagjfe21v2hgvmyf701tb','_blank');}
function renderComplaints(){
const data=JSON.parse(localStorage.getItem('satyasetu_complaints')||'[]');
document.getElementById('complaints').innerHTML=data.length?data.map(c=>`<div class="item"><b>${c.title}</b><br>${c.details}</div>`).join(''):'No complaints saved yet.';
}
document.getElementById('f').onsubmit=(e)=>{
e.preventDefault();
const data=JSON.parse(localStorage.getItem('satyasetu_complaints')||'[]');
data.push({title:document.getElementById('title').value,details:document.getElementById('details').value});
localStorage.setItem('satyasetu_complaints',JSON.stringify(data));
alert('Your complaint has been submitted successfully!');
e.target.reset();
renderComplaints();
};
renderComplaints();