/* Omamori v2 — App Logic (v2.1 fixes) */
const S={festivals:[],shelters:[],medical:[],filtered:[],page:0,PS:30,ollamaOk:false,lat:null,lng:null,map:null};
const MONTHS=['','JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const LNAMES={en:'English',ja:'Japanese',zh:'Chinese',ko:'Korean',es:'Spanish',fr:'French',th:'Thai',vi:'Vietnamese'};
const PH={
  restaurant:[
    {en:"Is this halal?",zh:"这是清真的吗？",ko:"이것은 할랄인가요?",es:"¿Es halal?",fr:"C'est halal ?",th:"อาหารฮาลาลไหม?",vi:"Món này có halal không?",jp:"これはハラールですか？",ro:"Kore wa harāru desu ka?"},
    {en:"Is this vegetarian?",zh:"这是素食的吗？",ko:"채식인가요?",es:"¿Es vegetariano?",fr:"C'est végétarien ?",th:"อาหารมังสวิรัติไหม?",vi:"Món này có chay không?",jp:"これはベジタリアンですか？",ro:"Kore wa bejitarian desu ka?"},
    {en:"No peanuts please",zh:"请不要放花生",ko:"땅콩 빼주세요",es:"Sin cacahuetes",fr:"Sans cacahuètes",th:"ไม่ใส่ถั่วลิสง",vi:"Không bỏ đậu phộng",jp:"ピーナッツ抜きでお願いします",ro:"Pīnattsu nuki de onegaishimasu"},
    {en:"The check, please",zh:"请结账",ko:"계산서 주세요",es:"La cuenta, por favor",fr:"L'addition, s'il vous plaît",th:"เช็คบิลด้วย",vi:"Tính tiền giúm",jp:"お会計お願いします",ro:"Okaikei onegaishimasu"},
    {en:"Water, please",zh:"请给我水",ko:"물 주세요",es:"Agua, por favor",fr:"De l'eau, s'il vous plaît",th:"ขอน้ำด้วย",vi:"Cho tôi nước",jp:"お水をください",ro:"Omizu wo kudasai"}
  ],
  transport:[
    {en:"How do I get to ___?",zh:"去___怎么走？",ko:"___에 어떻게 가나요?",es:"¿Cómo llego a ___?",fr:"Comment aller à ___ ?",th:"ไป___ยังไง?",vi:"Đi đến ___ bằng cách nào?",jp:"___への行き方を教えてください",ro:"___ e no ikikata wo oshiete kudasai"},
    {en:"Which platform?",zh:"在哪个站台？",ko:"몇 번 승강장인가요?",es:"¿Qué andén?",fr:"Quel quai ?",th:"ชานชาลาไหน?",vi:"Sân ga nào?",jp:"何番ホームですか？",ro:"Nanban hōmu desu ka?"},
    {en:"One ticket please",zh:"请给我一张票",ko:"표 한 장 주세요",es:"Un billete, por favor",fr:"Un billet, s'il vous plaît",th:"ขอตั๋วหนึ่งใบ",vi:"Cho tôi một vé",jp:"切符を一枚ください",ro:"Kippu wo ichimai kudasai"}
  ],
  hotel:[
    {en:"Check-in please",zh:"我要办理入住",ko:"체크인 해주세요",es:"Check-in, por favor",fr:"Check-in, s'il vous plaît",th:"เช็คอินด้วย",vi:"Tôi muốn nhận phòng",jp:"チェックインをお願いします",ro:"Chekkuin wo onegaishimasu"},
    {en:"Is breakfast included?",zh:"包含早餐吗？",ko:"조식 포함인가요?",es:"¿Incluye desayuno?",fr:"Le petit-déjeuner est inclus ?",th:"รวมอาหารเช้าไหม?",vi:"Có bao gồm bữa sáng không?",jp:"朝食は含まれていますか？",ro:"Chōshoku wa fukumarete imasu ka?"},
    {en:"Can I store luggage?",zh:"可以寄存行李吗？",ko:"짐을 맡길 수 있나요?",es:"¿Puedo guardar el equipaje?",fr:"Puis-je stocker mes bagages ?",th:"ฝากกระเป๋าได้ไหม?",vi:"Tôi gửi hành lý được không?",jp:"荷物を預けられますか？",ro:"Nimotsu wo azukeraremasu ka?"}
  ],
  medical:[
    {en:"I need a doctor",zh:"我需要看医生",ko:"의사가 필요해요",es:"Necesito un médico",fr:"J'ai besoin d'un médecin",th:"ต้องการหมอ",vi:"Tôi cần bác sĩ",jp:"医者が必要です",ro:"Isha ga hitsuyō desu"},
    {en:"I'm allergic to ___",zh:"我对___过敏",ko:"___에 알레르기가 있어요",es:"Soy alérgico a ___",fr:"Je suis allergique à ___",th:"แพ้___",vi:"Tôi bị dị ứng với ___",jp:"___にアレルギーがあります",ro:"___ ni arerugī ga arimasu"},
    {en:"Please call an ambulance",zh:"请叫救护车",ko:"구급차를 불러주세요",es:"Llame una ambulancia",fr:"Appelez une ambulance",th:"เรียกรถพยาบาล",vi:"Hãy gọi xe cấp cứu",jp:"救急車を呼んでください",ro:"Kyūkyūsha wo yonde kudasai"},
    {en:"Where is the pharmacy?",zh:"药店在哪里？",ko:"약국이 어디에 있나요?",es:"¿Dónde está la farmacia?",fr:"Où est la pharmacie ?",th:"ร้านขายยาอยู่ที่ไหน?",vi:"Hiệu thuốc ở đâu?",jp:"薬局はどこですか？",ro:"Yakkyoku wa doko desu ka?"}
  ],
  shopping:[
    {en:"Tax-free please",zh:"请免税",ko:"면세로 해주세요",es:"Libre de impuestos",fr:"Détaxe, s'il vous plaît",th:"ขอปลอดภาษี",vi:"Miễn thuế giúm",jp:"免税でお願いします",ro:"Menzei de onegaishimasu"},
    {en:"How much?",zh:"多少钱？",ko:"얼마예요?",es:"¿Cuánto cuesta?",fr:"Combien ?",th:"เท่าไหร่?",vi:"Bao nhiêu tiền?",jp:"いくらですか？",ro:"Ikura desu ka?"},
    {en:"Can I try this on?",zh:"可以试穿吗？",ko:"입어봐도 되나요?",es:"¿Puedo probármelo?",fr:"Puis-je essayer ?",th:"ลองได้ไหม?",vi:"Tôi thử được không?",jp:"試着してもいいですか？",ro:"Shichaku shitemo ii desu ka?"}
  ],
  general:[
    {en:"Thank you",zh:"谢谢",ko:"감사합니다",es:"Gracias",fr:"Merci",th:"ขอบคุณ",vi:"Cảm ơn",jp:"ありがとうございます",ro:"Arigatō gozaimasu"},
    {en:"Excuse me",zh:"打扰一下",ko:"실례합니다",es:"Disculpe",fr:"Excusez-moi",th:"ขอโทษ",vi:"Xin lỗi",jp:"すみません",ro:"Sumimasen"},
    {en:"I don't understand",zh:"我不明白",ko:"이해하지 못해요",es:"No entiendo",fr:"Je ne comprends pas",th:"ไม่เข้าใจ",vi:"Tôi không hiểu",jp:"わかりません",ro:"Wakarimasen"},
    {en:"Do you speak English?",zh:"你会说英语吗？",ko:"영어 할 수 있나요?",es:"¿Habla inglés?",fr:"Parlez-vous anglais ?",th:"พูดภาษาอังกฤษได้ไหม?",vi:"Bạn nói tiếng Anh được không?",jp:"英語を話せますか？",ro:"Eigo wo hanasemasu ka?"},
    {en:"Where is the restroom?",zh:"洗手间在哪里？",ko:"화장실이 어디에 있나요?",es:"¿Dónde está el baño?",fr:"Où sont les toilettes ?",th:"ห้องน้ำอยู่ที่ไหน?",vi:"Nhà vệ sinh ở đâu?",jp:"トイレはどこですか？",ro:"Toire wa doko desu ka?"},
    {en:"Help!",zh:"救命！",ko:"도와주세요!",es:"¡Ayuda!",fr:"À l'aide !",th:"ช่วยด้วย!",vi:"Cứu tôi!",jp:"助けてください！",ro:"Tasukete kudasai!"}
  ]
};

document.addEventListener('DOMContentLoaded',init);
async function init(){
  setupTabs();setupChips();setupSearch();setupPhrases('restaurant');
  document.getElementById('lang').addEventListener('change',e=>{
    applyLang(e.target.value);localStorage.setItem('lang',e.target.value);
    render(); // re-render festival cards with translated buttons
    renderPhrases(document.querySelector('#pcats .chip.on')?.dataset.c||'restaurant');
  });
  const saved=localStorage.getItem('lang')||'en';
  document.getElementById('lang').value=saved;
  applyLang(saved);
  checkOnline();window.addEventListener('online',checkOnline);window.addEventListener('offline',checkOnline);
  checkOllama();
  await loadData();
  getLocation();
}

// === TABS ===
function setupTabs(){
  const pp=document.getElementById('phrase-panel');
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('p-'+t.dataset.t).classList.add('active');
    const isAI=t.dataset.t==='assistant';
    document.querySelector('.chat-bar').style.display=isAI?'flex':'none';
    if(pp)pp.style.display=isAI?'block':'none';
  }));
  document.querySelector('.chat-bar').style.display='none';
  if(pp)pp.style.display='none';
  // Welcome message
  const t=I18N[document.getElementById('lang').value]||I18N.en;
  addBubble(t.chat_welcome||'Hello! I\'m your AI travel guide for Japan. 🇯🇵','bot');
}

// === ONLINE ===
function checkOnline(){
  const d=document.getElementById('dot'),l=document.getElementById('dot-label');
  if(navigator.onLine){d.classList.add('on');l.textContent='Online'}else{d.classList.remove('on');l.textContent='Offline'}
}

// === OLLAMA ===
async function checkOllama(){
  const el=document.getElementById('ai-conn'),dot=el.querySelector('.dot'),txt=document.getElementById('ai-conn-text');
  try{const r=await fetch('http://localhost:11434/api/tags',{signal:AbortSignal.timeout(3000)});
    if(r.ok){S.ollamaOk=true;dot.classList.add('on');txt.textContent='Gemma 4 Connected'}else throw 0;
  }catch{S.ollamaOk=false;dot.classList.remove('on');txt.textContent='Gemma 4 Offline — Phrases still work offline'}
}
// Non-streaming (for translations)
async function gemma(msg,sys){
  const r=await fetch('http://localhost:11434/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'gemma4:e2b',messages:[
      {role:'system',content:sys||'You are a bilingual AI travel guide for Japan. Be concise and helpful.'},
      {role:'user',content:msg}
    ],stream:false})});
  return(await r.json()).message.content;
}
// Streaming (for chat - real-time text)
async function gemmaStream(msg,sys,onChunk){
  const r=await fetch('http://localhost:11434/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'gemma4:e2b',messages:[
      {role:'system',content:sys||'You are a bilingual AI travel guide for Japan. Be concise and helpful.'},
      {role:'user',content:msg}
    ],stream:true})});
  const reader=r.body.getReader(),dec=new TextDecoder();
  let full='';
  while(true){
    const{done,value}=await reader.read();
    if(done)break;
    const lines=dec.decode(value).split('\n').filter(Boolean);
    for(const line of lines){
      try{const j=JSON.parse(line);if(j.message?.content){full+=j.message.content;onChunk(full)}}catch{}
    }
  }
  return full;
}

// === DATA ===
async function loadData(){
  const loader=document.getElementById('loader'),fill=document.getElementById('prog-fill'),msg=document.getElementById('loader-msg');
  try{
    const c=await idbLoad('all');
    if(c){S.festivals=c.f;S.shelters=c.s;S.medical=c.m;loader.style.display='none';onReady();return}
    msg.textContent='Loading festivals (13MB)…';fill.style.width='15%';
    S.festivals=await(await fetch('data/festivals.json')).json();fill.style.width='35%';
    msg.textContent='Loading shelters (22MB)…';
    S.shelters=await(await fetch('data/shelters.json')).json();fill.style.width='60%';
    msg.textContent='Loading hospitals (37MB)…';
    S.medical=await(await fetch('data/medical.json')).json();fill.style.width='85%';
    msg.textContent='Caching for offline…';
    await idbSave('all',{f:S.festivals,s:S.shelters,m:S.medical});fill.style.width='100%';
    setTimeout(()=>loader.style.display='none',200);onReady();
  }catch(e){msg.textContent='Error: '+e.message}
}
function idbOpen(){return new Promise((ok,ng)=>{const r=indexedDB.open('omamori3',1);r.onupgradeneeded=e=>e.target.result.createObjectStore('d');r.onsuccess=e=>ok(e.target.result);r.onerror=e=>ng(e.target.error)})}
async function idbLoad(k){try{const db=await idbOpen();return await new Promise((ok,ng)=>{const r=db.transaction('d','readonly').objectStore('d').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>ng()})}catch{return null}}
async function idbSave(k,v){const db=await idbOpen();const tx=db.transaction('d','readwrite');tx.objectStore('d').put(v,k);return new Promise(ok=>{tx.oncomplete=ok})}

function onReady(){
  const prefs=[...new Set(S.festivals.map(f=>f.pref).filter(Boolean))].sort();
  const sel=document.getElementById('f-pref');
  prefs.forEach(p=>{const o=document.createElement('option');o.value=p;o.textContent=p;sel.appendChild(o)});
  S.filtered=S.festivals;render();
  document.getElementById('count').textContent=S.festivals.length.toLocaleString();
}

// === LOCATION ===
function getLocation(){if(!navigator.geolocation)return;navigator.geolocation.getCurrentPosition(p=>{S.lat=p.coords.latitude;S.lng=p.coords.longitude;showReco()},()=>{})}
function hav(a,b,c,d){const R=6371,dL=(c-a)*Math.PI/180,dG=(d-b)*Math.PI/180,x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dG/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
function fmtD(k){return k<1?Math.round(k*1000)+'m':k.toFixed(1)+'km'}

// === RECO ===
async function showReco(){
  if(!S.lat||!S.festivals.length)return;
  const near=S.festivals.filter(f=>f.lat&&f.lng).map(f=>({...f,dist:hav(S.lat,S.lng,f.lat,f.lng)})).filter(f=>f.dist<50).sort((a,b)=>a.dist-b.dist).slice(0,5);
  if(!near.length)return;
  const box=document.getElementById('ai-reco'),body=document.getElementById('reco-body');
  body.innerHTML=near.map(f=>`<b>${f.name}</b> (${fmtD(f.dist)})`).join(' · ');box.style.display='block';
  if(S.ollamaOk){try{
    const lang=LNAMES[document.getElementById('lang').value]||'English';
    const txt=near.map(f=>`${f.name}: ${f.desc||''}`).join('\n');
    body.innerHTML=`<p style="line-height:1.6">${await gemma(`Recommend these nearby festivals in ${lang} (2 sentences):\n${txt}`)}</p>`;
  }catch{}}
}

// === SEARCH ===
function setupSearch(){
  let t;document.getElementById('srch').addEventListener('input',()=>{clearTimeout(t);t=setTimeout(filter,300)});
  document.getElementById('f-pref').addEventListener('change',filter);
  document.getElementById('f-month').addEventListener('change',filter);
  document.getElementById('more').addEventListener('click',()=>{S.page++;render(true)});
}
function setupChips(){document.querySelectorAll('#chips .chip').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('#chips .chip').forEach(x=>x.classList.remove('on'));c.classList.add('on');filter()}))}
function filter(){
  const q=document.getElementById('srch').value.toLowerCase().trim(),pref=document.getElementById('f-pref').value,mo=document.getElementById('f-month').value,tag=document.querySelector('#chips .chip.on')?.dataset.v||'';
  S.filtered=S.festivals.filter(f=>{if(pref&&f.pref!==pref)return false;if(mo&&f.date){const m=new Date(f.date).getMonth()+1;if(m!==+mo)return false}if(tag&&!(f.tags||[]).some(t=>t.includes(tag)))return false;if(q){const h=[f.name,f.pref,f.city,f.venue,f.desc,...(f.tags||[])].join(' ').toLowerCase();if(!h.includes(q))return false}return true});
  S.page=0;document.getElementById('count').textContent=S.filtered.length.toLocaleString();render();
}

// === RENDER FESTIVALS ===
function render(append=false){
  const list=document.getElementById('flist'),start=S.page*S.PS,items=S.filtered.slice(start,start+S.PS);
  if(!append)list.innerHTML='';
  const t=I18N[document.getElementById('lang').value]||I18N.en;
  const lang=document.getElementById('lang').value;
  const isJa=lang==='ja';
  items.forEach((f,i)=>{
    const idx=start+i;
    const mo=f.date?new Date(f.date).getMonth()+1:0;
    const d=document.createElement('div');d.className='fcard';d.dataset.idx=idx;
    const key=`t_${lang}_${f.name}`;
    const cached=!isJa&&S._tc&&S._tc[key];
    // Main content: translated if cached, otherwise Japanese with loading
    d.innerHTML=`${mo?`<span class="fc-month">${MONTHS[mo]}</span>`:''}
      <div class="fc-name">${cached?S._tc[key].name:f.name}</div>
      <div class="fc-loc">${cached?S._tc[key].loc:[f.pref,f.city,f.venue].filter(Boolean).join(' · ')}</div>
      ${f.desc?`<div class="fc-desc">${cached?S._tc[key].desc:f.desc}</div>`:''}
      ${!isJa?`<div class="fc-orig">${cached?'🇯🇵 '+f.name:'<span class="trans-loading">🌐 Translating…</span>'}</div>`:''}
      <div class="fc-meta">${f.schedule?`<span>📅 ${f.schedule}</span>`:''}${f.station?`<span>🚃 ${f.station}</span>`:''}</div>
      ${(f.tags||[]).length?`<div class="fc-tags">${f.tags.slice(0,3).map(t=>`<span class="ftag">${t}</span>`).join('')}</div>`:''}
      <div class="fc-acts">
        ${f.lat?`<a class="btn btn-gold" href="https://www.google.com/maps?q=${f.lat},${f.lng}" target="_blank">${t.btn_map}</a>`:''}
        ${f.desc?`<button class="btn btn-gold btn-ask" data-idx="${idx}">${t.btn_ask}</button>`:''}
      </div>`;
    list.appendChild(d);
  });
  list.querySelectorAll('.btn-ask').forEach(btn=>btn.addEventListener('click',function(){askAboutCard(this)}));
  document.getElementById('more').style.display=(start+S.PS<S.filtered.length)?'block':'none';
  // Auto-translate for non-Japanese
  if(!isJa)autoTranslateVisible(items);
}

// Replace card content with translated text - sequential streaming
async function autoTranslateVisible(items){
  const lang=document.getElementById('lang').value;
  if(!S.ollamaOk)return;
  const langName=LNAMES[lang]||'English';
  const cards=[...document.querySelectorAll('#flist .fcard')];
  for(let i=0;i<Math.min(cards.length,10);i++){
    const card=cards[i],f=items[i];
    if(!f||!f.name)continue;
    const key=`t_${lang}_${f.name}`;
    // Already cached — skip (rendered from cache already)
    if(S._tc&&S._tc[key])continue;
    const nameEl=card.querySelector('.fc-name');
    const locEl=card.querySelector('.fc-loc');
    const descEl=card.querySelector('.fc-desc');
    const origEl=card.querySelector('.fc-orig');
    try{
      let result='';
      await gemmaStream(
        `Translate to ${langName}.\nName: ${f.name}\nLocation: ${[f.pref,f.city,f.venue].filter(Boolean).join(', ')}\nDescription: ${(f.desc||'').slice(0,150)}`,
        `Output EXACTLY this format in ${langName}:\nName: [translated name]\nLocation: [translated location]\nDescription: [translated description]\nNothing else.`,
        chunk=>{
          result=chunk;
          // Live update — parse partial results
          const lines=chunk.split('\n');
          for(const line of lines){
            if(line.startsWith('Name:'))nameEl.textContent=line.replace('Name:','').trim();
            else if(line.startsWith('Location:'))locEl.textContent=line.replace('Location:','').trim();
            else if(line.startsWith('Description:')&&descEl)descEl.textContent=line.replace('Description:','').trim();
          }
          if(origEl)origEl.innerHTML='🇯🇵 '+f.name;
        }
      );
      // Parse final result and cache
      const parsed={name:f.name,loc:'',desc:''};
      result.split('\n').forEach(line=>{
        if(line.startsWith('Name:'))parsed.name=line.replace('Name:','').trim();
        else if(line.startsWith('Location:'))parsed.loc=line.replace('Location:','').trim();
        else if(line.startsWith('Description:'))parsed.desc=line.replace('Description:','').trim();
      });
      if(!S._tc)S._tc={};
      S._tc[key]=parsed;
      // Final update
      nameEl.textContent=parsed.name;
      locEl.textContent=parsed.loc||locEl.textContent;
      if(descEl&&parsed.desc)descEl.textContent=parsed.desc;
      if(origEl)origEl.innerHTML='🇯🇵 '+f.name;
    }catch{
      if(origEl)origEl.innerHTML='';
    }
  }
}

// === ASK AI (switch to chat) ===
function askAboutCard(btn){
  const idx=parseInt(btn.dataset.idx);
  const f=S.filtered[idx];
  if(!f)return;
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelector('[data-t="assistant"]').classList.add('active');
  document.getElementById('p-assistant').classList.add('active');
  document.querySelector('.chat-bar').style.display='flex';
  const lang=LNAMES[document.getElementById('lang').value]||'English';
  document.getElementById('chat-in').value=`Tell me about the festival "${f.name}" in ${lang}. Here's what I know: ${f.desc||'No description'}`;
  sendChat();
}

// === CHAT (streaming + voice) ===
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('chat-send').addEventListener('click',sendChat);
  document.getElementById('chat-in').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey)sendChat()});
  // Voice input button
  const mic=document.getElementById('chat-mic');
  if(mic)mic.addEventListener('click',startVoice);
});

async function sendChat(){
  const inp=document.getElementById('chat-in'),msg=inp.value.trim();if(!msg)return;inp.value='';
  addBubble(msg,'user');
  if(!S.ollamaOk){addBubble('🤖 AI is offline. Start Ollama for Gemma 4. Phrase cards below work offline.','bot');return}
  const b=addBubble('','bot');
  b.innerHTML='<span class="typing">●●●</span>';
  try{
    const lang=LNAMES[document.getElementById('lang').value]||'English';
    const full=await gemmaStream(msg,
      `You are Omamori, a friendly AI travel guide for Japan powered by Gemma 4. User speaks ${lang}. Help with translations, culture, festivals, directions, emergencies. Be warm and concise. Respond in ${lang}. If user asks for translation, provide both original and translated text.`,
      chunk=>{
        b.innerHTML=chunk.replace(/\n/g,'<br>');
        document.getElementById('chat').scrollTop=99999;
      }
    );
    // Add TTS button to response
    const ttsBtn=document.createElement('button');
    ttsBtn.className='btn btn-green tts-btn';
    ttsBtn.textContent='🔊';
    ttsBtn.title='Read aloud';
    ttsBtn.onclick=()=>speakText(full,lang);
    b.appendChild(ttsBtn);
  }catch{b.innerHTML='⚠️ Could not reach Gemma 4.'}
  document.getElementById('chat').scrollTop=99999;
}

function addBubble(t,c){
  const d=document.createElement('div');d.className='bubble '+c;
  if(t)d.textContent=t;
  document.getElementById('chat').appendChild(d);
  document.getElementById('chat').scrollTop=99999;
  return d;
}
function sendSuggestion(btn){document.getElementById('chat-in').value=btn.textContent.replace(/^.\s/,'');sendChat()}

// === VOICE INPUT ===
function startVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert('Speech recognition not supported');return}
  const r=new SR();
  const lang=document.getElementById('lang').value;
  // Map to BCP47 codes
  const langMap={en:'en-US',ja:'ja-JP',zh:'zh-CN',ko:'ko-KR',es:'es-ES',fr:'fr-FR',th:'th-TH',vi:'vi-VN'};
  r.lang=langMap[lang]||'en-US';
  r.interimResults=true;
  const mic=document.getElementById('chat-mic');
  mic.classList.add('mic-active');
  r.onresult=e=>{
    const t=Array.from(e.results).map(r=>r[0].transcript).join('');
    document.getElementById('chat-in').value=t;
  };
  r.onend=()=>{
    mic.classList.remove('mic-active');
    if(document.getElementById('chat-in').value.trim())sendChat();
  };
  r.onerror=()=>mic.classList.remove('mic-active');
  r.start();
}

// === VOICE OUTPUT ===
function speakText(text,lang){
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  const langMap={en:'en-US',ja:'ja-JP',zh:'zh-CN',ko:'ko-KR',es:'es-ES',fr:'fr-FR',th:'th-TH',vi:'vi-VN'};
  u.lang=langMap[lang]||'en-US';
  u.rate=0.9;
  speechSynthesis.speak(u);
}

// === PHRASES ===
function setupPhrases(cat){
  document.querySelectorAll('#pcats .chip').forEach(c=>c.addEventListener('click',()=>{
    document.querySelectorAll('#pcats .chip').forEach(x=>x.classList.remove('on'));c.classList.add('on');
    renderPhrases(c.dataset.c)}));
  renderPhrases(cat);
}
function renderPhrases(cat){
  const lang=document.getElementById('lang').value;
  const t=I18N[lang]||I18N.en;
  document.getElementById('plist').innerHTML=(PH[cat]||[]).map(p=>{
    const userText=p[lang]||p.en;
    return `
    <div class="pcard-mini">
      <div class="pm-user">${userText}</div>
      <div class="pm-jp">🇯🇵 ${p.jp}</div>
      <div class="pm-ro">${p.ro}</div>
      <div class="pm-acts">
        <button class="btn btn-green" onclick="speak('${p.jp.replace(/'/g,"\\'")}')">${t.btn_speak}</button>
        <button class="btn btn-blue" onclick="showOverlay('${p.jp.replace(/'/g,"\\'")}','${p.ro.replace(/'/g,"\\'")}')">${t.btn_show}</button>
      </div>
    </div>`;
  }).join('');
}

// === MAP (replace content with translated text) ===
async function showMap(type){
  if(!navigator.geolocation){alert('Geolocation not available');return}
  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat=pos.coords.latitude,lng=pos.coords.longitude;
    const data=type==='shelter'?S.shelters:S.medical;
    const near=data.filter(d=>d.lat&&d.lng).map(d=>({...d,dist:hav(lat,lng,d.lat,d.lng)})).sort((a,b)=>a.dist-b.dist).slice(0,20);
    const mapEl=document.getElementById('map');mapEl.style.display='block';
    if(S.map){S.map.remove()}
    S.map=L.map('map').setView([lat,lng],14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:18}).addTo(S.map);
    L.circleMarker([lat,lng],{radius:10,color:'#d4a017',fillColor:'#f0c850',fillOpacity:1,weight:3}).addTo(S.map).bindPopup('📍 You are here');
    const t=I18N[document.getElementById('lang').value]||I18N.en;
    const icon=type==='shelter'?'🏛️':'🏥';
    near.forEach(d=>{
      const m=L.marker([d.lat,d.lng]).addTo(S.map);
      m.bindPopup(`<b>${icon} ${d.name}</b><br>${d.addr||''}<br>${d.em?'<b style="color:red">🔴 Emergency OK</b><br>':''}<b>${fmtD(d.dist)}</b><br><a href="https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}" target="_blank">${t.navigate} →</a>`);
    });
    const listEl=document.getElementById('map-list');
    const lang=document.getElementById('lang').value;
    const isJa=lang==='ja';
    listEl.innerHTML=near.slice(0,10).map((d,i)=>`
      <div class="fcard" style="padding:12px" data-mi="${i}">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <div class="fc-name">${icon} ${d.name}</div>
            <div class="fc-loc">${d.addr||d.pref||''}</div>
            ${!isJa?'<div class="fc-orig"><span class="trans-loading">🌐 Translating…</span></div>':''}
            ${d.em?'<span class="ftag" style="border-color:var(--red);color:var(--red)">Emergency OK</span>':''}
          </div>
          <div style="text-align:right">
            <div style="font-size:20px;font-weight:800;color:var(--gold)">${fmtD(d.dist)}</div>
            <a class="btn btn-gold" href="https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}" target="_blank" style="margin-top:6px">${t.navigate}</a>
          </div>
        </div>
      </div>`).join('');
    // Translate facility names sequentially
    if(!isJa&&S.ollamaOk){
      const langName=LNAMES[lang]||'English';
      const cards=listEl.querySelectorAll('.fcard');
      for(let i=0;i<Math.min(cards.length,10);i++){
        const card=cards[i],d=near[i];
        if(!d)continue;
        const nameEl=card.querySelector('.fc-name');
        const locEl=card.querySelector('.fc-loc');
        const origEl=card.querySelector('.fc-orig');
        try{
          await gemmaStream(
            `Translate to ${langName}: "${d.name}" and "${d.addr||''}"`,
            `Output EXACTLY:\nName: [${langName} translation]\nAddress: [${langName} translation]`,
            chunk=>{
              const lines=chunk.split('\n');
              for(const line of lines){
                if(line.startsWith('Name:'))nameEl.textContent=icon+' '+line.replace('Name:','').trim();
                else if(line.startsWith('Address:'))locEl.textContent=line.replace('Address:','').trim();
              }
              if(origEl)origEl.innerHTML='🇯🇵 '+d.name;
            }
          );
        }catch{if(origEl)origEl.innerHTML=''}
      }
    }
  },()=>alert('Please enable location access'));
}

function speak(t){const u=new SpeechSynthesisUtterance(t);u.lang='ja-JP';u.rate=.85;speechSynthesis.speak(u)}
function showOverlay(jp,ro){document.getElementById('ov-jp').textContent=jp;document.getElementById('ov-ro').textContent=ro||'';document.getElementById('overlay').style.display='flex'}

window.sendSuggestion=sendSuggestion;window.speak=speak;window.showOverlay=showOverlay;window.showMap=showMap;
