export const SHELL = String.raw`<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Mô phỏng</title>
<style>
:root{--t:#eef0ff;--m:#9ba3c7;--a:#8b6bff;--b:#ff5fa2;--y:#ffb547;--g:#34d399;--l:rgba(255,255,255,.12);--p:rgba(255,255,255,.05)}
*{box-sizing:border-box}html,body{height:100%;margin:0;overflow:hidden;color:var(--t);font:14px/1.5 system-ui,"Segoe UI",sans-serif;
background:radial-gradient(60vmax 60vmax at 0 0,rgba(139,107,255,.22),transparent 60%),radial-gradient(50vmax 50vmax at 100% 100%,rgba(255,95,162,.16),transparent 60%),#0a0b1f}
.app{display:grid;grid-template-columns:58fr 42fr;gap:12px;padding:12px;height:100%}
.card{background:var(--p);border:1px solid var(--l);border-radius:14px;backdrop-filter:blur(8px)}
.left,.right{display:flex;flex-direction:column;gap:10px;min-height:0;min-width:0}
.left .card:first-child{flex:1;display:flex;flex-direction:column;min-height:0;padding:10px 12px}
h1{margin:0 0 4px;font-size:17px;font-weight:800;background:linear-gradient(90deg,var(--a),var(--b),var(--y));-webkit-background-clip:text;background-clip:text;color:transparent}
#view{flex:1;min-height:0}#view svg{width:100%;height:100%;display:block}
#exw{padding:12px 14px;border-left:4px solid var(--b);min-height:66px;font-size:15px}
#exw small{display:block;color:var(--b);font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:11px;margin-bottom:2px}
.ctl{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px}
.bt{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;border:1px solid var(--l);background:rgba(255,255,255,.08);color:var(--t);font:600 13px inherit;cursor:pointer;transition:.15s}
.bt:hover{background:rgba(255,255,255,.16);transform:translateY(-1px)}.bt:active{transform:scale(.96)}
.bt.pri{border:0;background:linear-gradient(135deg,var(--a),var(--b));box-shadow:0 4px 16px rgba(255,95,162,.35);padding:8px 20px}
.sl{display:flex;align-items:center;gap:6px;color:var(--m);font-size:12px}.sl input{accent-color:var(--b);width:90px}
#pm{display:contents}
.bar{height:4px;background:var(--l);border-radius:4px;overflow:hidden;margin:0 10px}.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--a),var(--b));transition:width .15s}
.stt{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px;align-items:center}
.chip{padding:3px 10px;border-radius:999px;background:rgba(255,255,255,.08);font-size:12px}.chip b{color:var(--y)}
#badge{margin-left:auto;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700}
.run{background:rgba(52,211,153,.18);color:var(--g)}.pau{background:rgba(255,181,71,.18);color:var(--y)}.dn{background:rgba(139,107,255,.25);color:#c9bbff}
#code{flex:1.1;min-height:90px;overflow:auto;background:#0d0e26;padding:6px 0;font:12.5px/1.65 Consolas,"Courier New",monospace;position:relative}
.cl{display:flex;white-space:pre;padding-right:10px}.cl em{width:34px;color:#5d6490;font-style:normal;text-align:right;padding-right:8px;flex:none}
.cl .mk{width:16px;color:var(--b);flex:none}.cl.on{background:rgba(139,107,255,.28)}.cl.on .mk:before{content:"▶"}
.kw{color:#c792ea}
.bot{flex:1;min-height:120px;display:flex;flex-direction:column;overflow:hidden}
.tabs{display:flex;gap:4px;padding:6px 6px 0;flex:none}.tabs button{border:0;background:none;color:var(--m);padding:6px 12px;border-radius:8px 8px 0 0;font:600 12.5px inherit;cursor:pointer}
.tabs button.on{background:rgba(139,107,255,.25);color:var(--t)}
#tw,#th{flex:1;min-height:0;overflow:auto;position:relative}#th{padding:10px 14px;white-space:pre-wrap;font-size:13.5px}
table{width:100%;border-collapse:collapse;font-size:12px}th{position:sticky;top:0;background:#1a1c40;text-align:left;padding:5px 8px;z-index:1}
td{padding:4px 8px;border-bottom:1px solid rgba(255,255,255,.05)}tbody tr{cursor:pointer}tbody tr:hover{background:rgba(255,255,255,.06)}tr.on{background:rgba(255,95,162,.22)}
#win{font-size:11px;color:var(--m);padding:3px 10px;flex:none}
@media(max-width:800px){html,body{overflow:auto}.app{grid-template-columns:1fr;height:auto}.left .card:first-child{height:65vh;flex:none}#code{height:220px;flex:none}.bot{height:300px;flex:none}}
</style></head><body><div class="app">
<div class="left"><div class="card"><h1 id="ti"></h1><div id="view"></div></div>
<div class="card" id="exw"><small>Giải thích bước hiện tại</small><span id="ex"></span></div></div>
<div class="right">
<div class="card"><div class="ctl"><button class="bt" id="bReset">↺ Đặt lại</button><button class="bt" id="bBack">⏮ Lùi</button><button class="bt pri" id="bPlay">▶ Chạy</button><button class="bt" id="bStep">Tiếp ⏭</button>
<label class="sl">Tốc độ<input id="sp" type="range" min="1" max="100" value="60"></label><span id="pm"></span></div><div class="bar"><i id="pg"></i></div>
<div class="stt"><span id="st" style="display:contents"></span><span id="badge"></span></div></div>
<div class="card" id="code"></div>
<div class="card bot"><div class="tabs"><button data-k="steps" class="on">Bảng từng bước</button><button data-k="idea">Ý tưởng</button><button data-k="pseudo">Mã giả</button><button data-k="complexity">Độ phức tạp</button></div>
<div id="tw"><table><thead><tr><th>Bước</th><th>Hành động</th><th>Chi tiết</th><th>Kết quả</th></tr></thead><tbody id="tb"></tbody></table></div><div id="th" hidden></div><div id="win"></div></div>
</div></div>
<script>
/*__AI_CODE__*/
const $=i=>document.getElementById(i);let steps=[],cur=0,timer=null,P={},tabK='steps';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function sc(c,e){if(e)c.scrollTop+=e.getBoundingClientRect().top-c.getBoundingClientRect().top-c.clientHeight/2+e.offsetHeight/2}
$('ti').textContent=META.title;
(META.params||[]).forEach(p=>{P[p.id]=p.value;const l=document.createElement('label');l.className='sl';const s=document.createElement('span');s.textContent=p.label+'='+p.value;
const r=document.createElement('input');r.type='range';r.min=p.min;r.max=p.max;r.value=p.value;
r.onchange=()=>{P[p.id]=+r.value;s.textContent=p.label+'='+r.value;reset()};l.append(s,r);$('pm').appendChild(l)});
$('code').innerHTML=CODE_LINES.map((c,i)=>'<div class="cl"><em>'+(i+1)+'</em><span class="mk"></span>'+esc(c).replace(/\b(function|let|const|for|while|if|else|return|yield|of|in)\b/g,'<span class="kw">$1</span>')+'</div>').join('');
function tab(k){tabK=k;document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
$('tw').hidden=k!=='steps';$('win').hidden=k!=='steps';$('th').hidden=k==='steps';if(k!=='steps')$('th').textContent=(META.theory||{})[k]||'';else show(cur)}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.k));
function pause(){clearInterval(timer);timer=null;$('bPlay').textContent='▶ Chạy'}
function show(i){cur=Math.max(0,Math.min(i,steps.length-1));const s=steps[cur];if(!s)return;
try{const v=draw(s.state,s,P);$('view').innerHTML=v&&String(v).includes('<')?v:'<p style="color:#ff8fa3;padding:12px">draw() không trả về hình. Bấm "Tạo lại".</p>'}catch(e){$('view').innerHTML='<p style="color:#ff8fa3;padding:12px">Lỗi vẽ hình: '+esc(e.message)+'</p>'}
[...$('code').children].forEach((d,k)=>d.classList.toggle('on',k+1===s.line));
const ln=$('code').children[s.line-1];if(ln)sc($('code'),ln);
$('ex').textContent=s.text||'';$('pg').style.width=((cur+1)/steps.length*100)+'%';
const end=cur>=steps.length-1;
$('st').innerHTML='<span class="chip">Bước <b>'+(cur+1)+'/'+steps.length+'</b></span>'+Object.entries(s.stats||{}).map(([k,v])=>'<span class="chip">'+esc(k)+': <b>'+esc(v)+'</b></span>').join('');
$('badge').className=end?'dn':timer?'run':'pau';$('badge').textContent=end?'✔ Hoàn thành':timer?'● Đang chạy':'⏸ Tạm dừng';
if(tabK==='steps'){const a=Math.max(0,cur-40),b=Math.min(steps.length,cur+41);let h='';
for(let k=a;k<b;k++){const x=steps[k];h+='<tr data-i="'+k+'"'+(k===cur?' class="on"':'')+'><td>'+(k+1)+'</td><td>'+esc((x.icon||'')+' '+(x.action||''))+'</td><td>'+esc(x.detail||'')+'</td><td>'+esc(x.result||'')+'</td></tr>'}
$('tb').innerHTML=h;sc($('tw'),$('tb').querySelector('.on'));$('win').textContent='Đang hiển thị bước '+(a+1)+'-'+b+' / '+steps.length}}
$('tb').onclick=e=>{const r=e.target.closest('tr');if(r){pause();show(+r.dataset.i)}};
function reset(){pause();steps=[];try{for(const s of algo(P)){steps.push(structuredClone(s));if(steps.length>=3000)break}}catch(e){steps.push({line:1,text:'Lỗi thuật toán: '+e.message,state:null})}show(0)}
function play(){$('bPlay').textContent='⏸ Tạm dừng';timer=setInterval(()=>{if(cur>=steps.length-1){pause();show(cur)}else show(cur+1)},1010-$('sp').value*10)}
$('bPlay').onclick=()=>{if(timer){pause();show(cur);return}if(cur>=steps.length-1)show(0);play();show(cur)};
$('sp').oninput=()=>{if(timer){clearInterval(timer);play()}};
$('bStep').onclick=()=>{pause();show(cur+1)};$('bBack').onclick=()=>{pause();show(cur-1)};$('bReset').onclick=reset;
reset();
</script></body></html>`;