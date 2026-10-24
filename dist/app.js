(() => {
 'use strict';
 const config=window.SITE_CONFIG||{},keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
 const clean=s=>String(s||'').slice(0,200).replace(/[<>\r\n]/g,'');
 let attribution={};try{attribution=JSON.parse(sessionStorage.getItem('gdmetro_campaign')||'{}')}catch{}
 const params=new URLSearchParams(location.search);if(keys.some(k=>params.has(k))){attribution=Object.fromEntries(keys.map(k=>[k,clean(params.get(k))]));try{sessionStorage.setItem('gdmetro_campaign',JSON.stringify(attribution))}catch{}}
 window.dataLayer=window.dataLayer||[];
 function track(event,extra={}){const payload={event,...attribution,...extra};window.dataLayer.push(payload);if(window.gtag)window.gtag('event',event,{...attribution,...extra});}
 if(config.production && /^G-[A-Z0-9]+$/.test(config.ga4Id)){window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config',config.ga4Id,{page_location:location.origin+location.pathname});const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(config.ga4Id);document.head.append(s);}
 const menu=document.querySelector('#menu-toggle'),nav=document.querySelector('#navigation');
 function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','메뉴 열기');}
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu?.focus()}});
 nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
 document.querySelectorAll('[data-phone]').forEach(a=>a.addEventListener('click',()=>track('click_to_call',{link_location:a.closest('header')?'header':a.closest('footer')?'footer':'mobile_bar'})));
 const hero=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('[data-hero]')];let slide=0,timer,paused=false,heroCarousel=null;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function showHero(i){heroCarousel?.go(i);slide=(i+hero.length)%hero.length;hero.forEach((s,n)=>s.classList.toggle('active',n===slide));dots.forEach((d,n)=>d.setAttribute('aria-pressed',String(n===slide)));}
 function start(){clearInterval(timer);if(hero.length&&!paused&&!reduce&&!document.hidden)timer=setInterval(()=>showHero(slide+1),8000)}
 dots.forEach((d,i)=>d.addEventListener('click',()=>{showHero(i);start()}));
 document.querySelector('#hero-pause')?.addEventListener('click',e=>{paused=!paused;e.currentTarget.textContent=paused?'▶':'Ⅱ';e.currentTarget.setAttribute('aria-label',paused?'슬라이드 재생':'슬라이드 일시정지');start()});document.addEventListener('visibilitychange',start);start();

 function makeCarousel(surface,slides,onChange,onBegin=()=>{},onEnd=()=>{}){
  if(!surface||slides.length<2)return null;
  const viewport=document.createElement('div'),track=document.createElement('div');
  viewport.className='carousel-viewport';track.className='carousel-track';
  const heroSurface=surface.classList.contains('hero');
  surface.classList.add('swipe-surface','real-carousel');
  if(heroSurface){surface.querySelector('.hero-images').append(viewport)}else{surface.insertBefore(viewport,slides[0])}
  viewport.append(track);
  const clone=slide=>{const copy=slide.cloneNode(true);copy.hidden=false;copy.inert=true;copy.setAttribute('aria-hidden','true');copy.classList.add('carousel-clone');return copy};
  track.append(clone(slides[slides.length-1]));slides.forEach(slide=>{slide.hidden=false;track.append(slide)});track.append(clone(slides[0]));
  let index=0,position=1,gesture=null,settleTimer;
  const width=()=>viewport.getBoundingClientRect().width;
  function paint(offset=0,animate=false){[...track.children].forEach((item,n)=>{item.style.visibility=animate||gesture?.horizontal||n===position?'visible':'hidden'});track.style.transition=animate&&!reduce?'transform .4s cubic-bezier(.22,.61,.36,1)':'none';track.style.transform='translate3d('+(-position*width()+offset)+'px,0,0)'}
  function refresh(){if(!heroSurface){const height=Math.max(...slides.map(s=>s.offsetHeight));viewport.style.height=height+'px'}paint()}
  function normalize(){position=index+1;paint();clearTimeout(settleTimer)}
  function go(target){
   if(gesture)return;
   clearTimeout(settleTimer);
   index=(target%slides.length+slides.length)%slides.length;
   position=target===-1?0:target===slides.length?slides.length+1:index+1;
   slides.forEach((s,n)=>{s.inert=n!==index;s.setAttribute('aria-hidden',String(n!==index))});
   paint(0,true);settleTimer=setTimeout(normalize,reduce?0:420);
  }
  surface.addEventListener('dragstart',e=>e.preventDefault());
  surface.addEventListener('pointerdown',e=>{
   if(!e.isPrimary||e.button!==0||e.target.closest('a,button,input,textarea,select,summary'))return;
   normalize();gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0,horizontal:false};
   surface.setPointerCapture(e.pointerId);onBegin();
  });
  surface.addEventListener('pointermove',e=>{
   if(!gesture||gesture.id!==e.pointerId)return;
   gesture.dx=e.clientX-gesture.x;gesture.dy=e.clientY-gesture.y;
   if(!gesture.horizontal&&Math.abs(gesture.dx)>8&&Math.abs(gesture.dx)>Math.abs(gesture.dy)*1.2)gesture.horizontal=true;
   if(gesture.horizontal){surface.classList.add('is-dragging');paint(Math.max(-width(),Math.min(width(),gesture.dx)))}
  });
  function finish(e,cancelled){
   if(!gesture||gesture.id!==e.pointerId)return;
   const {dx,dy,horizontal}=gesture;gesture=null;surface.classList.remove('is-dragging');
   if(surface.hasPointerCapture(e.pointerId))surface.releasePointerCapture(e.pointerId);
   if(!cancelled&&horizontal&&Math.abs(dx)>=Math.max(45,width()*.18)&&Math.abs(dx)>Math.abs(dy)*1.2){const next=index+(dx<0?1:-1);go(next);onChange(next)}else{paint(0,true);settleTimer=setTimeout(normalize,reduce?0:420)}
   onEnd();
  }
  surface.addEventListener('pointerup',e=>finish(e,false));surface.addEventListener('pointercancel',e=>finish(e,true));
  surface.addEventListener('lostpointercapture',e=>{if(gesture?.id===e.pointerId){gesture=null;surface.classList.remove('is-dragging');paint(0,true);settleTimer=setTimeout(normalize,reduce?0:420);onEnd()}});
  window.addEventListener('resize',refresh);track.querySelectorAll('img').forEach(img=>img.addEventListener('load',refresh));
  slides.forEach((s,n)=>{s.inert=n!==0;s.setAttribute('aria-hidden',String(n!==0))});refresh();
  return {go};
 }
 heroCarousel=makeCarousel(document.querySelector('.hero'),hero,next=>showHero(next),()=>clearInterval(timer),start);
 const premiums=[...document.querySelectorAll('.premium:not(.all-premium) .premium-slide')];let premium=0,premiumCarousel=null;
 function showPremium(i){premiumCarousel?.go(i);premium=(i+premiums.length)%premiums.length;premiums.forEach((s,n)=>{s.hidden=premiumCarousel?false:n!==premium;s.classList.toggle('active',n===premium)});document.querySelectorAll('[data-premium-index]').forEach((d,n)=>d.setAttribute('aria-pressed',String(n===premium)));}
 document.querySelectorAll('[data-premium]').forEach(b=>b.addEventListener('click',()=>{const direction=Number(b.dataset.premium);showPremium(premium+direction);premiums[premium].querySelector(`[data-premium="${direction}"]`).focus({preventScroll:true});}));
 document.querySelectorAll('[data-premium-index]').forEach(b=>b.addEventListener('click',()=>showPremium(Number(b.dataset.premiumIndex))));
 premiumCarousel=makeCarousel(document.querySelector('.premium:not(.all-premium)'),premiums,next=>showPremium(next));
 if('IntersectionObserver'in window){document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e))}
 const newsCards=[...document.querySelectorAll('.news-card')],newsMore=document.querySelector('#news-more');
 if(newsMore){let visibleCount=9;const updateNews=()=>{newsCards.forEach((card,index)=>{card.hidden=index>=visibleCount});newsMore.hidden=visibleCount>=newsCards.length};updateNews();newsMore.addEventListener('click',()=>{const firstNew=newsCards[visibleCount];visibleCount+=9;updateNews();firstNew?.querySelector('a')?.focus({preventScroll:true})})}
 const form=document.querySelector('#interest-form');if(!form)return;
 const status=document.querySelector('#form-status'),button=form.querySelector('[type=submit]');let started=false,attempt=null;
 form.addEventListener('input',()=>{if(!started){started=true;track('form_start',{form_name:'interest'})}});
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(button.disabled||!form.reportValidity())return;
  if(!config.contact?.endpoint||!config.contact.privacyApproved){status.textContent='온라인 접수 준비중입니다.';return;}
  const values=new FormData(form),name=String(values.get('name')).trim(),phone=String(values.get('phone')).replace(/\D/g,''),message=String(values.get('message')).trim();
  if(name.length<2||name.length>30||/[<>=]/.test(name)||!/^0\d{8,10}$/.test(phone)){status.textContent='이름과 연락처를 확인해 주세요.';return;}
  const fingerprint=JSON.stringify([name,phone,message]);if(!attempt||attempt.fingerprint!==fingerprint)attempt={fingerprint,id:crypto.randomUUID()};
  const payload={name,phone,message,privacy_agree:values.get('privacy_agree')==='on',website:values.get('website')||'',...attribution,request_id:attempt.id,project:config.name,page_path:location.pathname};
  button.disabled=true;status.textContent='접수 중입니다.';const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
  try{const response=await fetch(config.contact.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),credentials:'omit',redirect:'follow',signal:controller.signal});if(!response.ok)throw Error();const result=await response.json();if(result.ok!==true||result.request_id!==attempt.id)throw Error();track('generate_lead',{form_name:'interest'});status.textContent='관심고객 등록이 완료되었습니다.';form.reset();attempt=null;started=false;}
  catch{track('form_error',{form_name:'interest'});status.textContent='접수 결과를 확인하지 못했습니다. 다시 시도해 주세요.';}
  finally{clearTimeout(timeout);button.disabled=false;}
 });
})();


(() => {
 const tabs=[...document.querySelectorAll('[data-plan-tab]')],groups=[...document.querySelectorAll('[data-plan-group]')];
 function select(label,focus=false){const active=tabs.find(t=>t.dataset.planTab===label);if(!active)return;const group=active.dataset.group;groups.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.planGroup===group)));tabs.forEach(b=>{b.hidden=b.dataset.group!==group;b.setAttribute('aria-selected',String(b===active));b.tabIndex=b===active?0:-1});document.querySelectorAll('.unit-panel').forEach(p=>p.hidden=p.id!=='panel-'+label);if(focus)active.focus()}
 tabs.forEach(t=>{t.addEventListener('click',()=>select(t.dataset.planTab));t.addEventListener('keydown',e=>{const visible=tabs.filter(b=>!b.hidden);let index=visible.indexOf(t);if(e.key==='ArrowRight')index=(index+1)%visible.length;else if(e.key==='ArrowLeft')index=(index+visible.length-1)%visible.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=visible.length-1;else return;e.preventDefault();select(visible[index].dataset.planTab,true)})});
 groups.forEach(g=>g.addEventListener('click',()=>select(tabs.find(t=>t.dataset.group===g.dataset.planGroup).dataset.planTab)));
 const dialog=document.querySelector('#plan-dialog');let opener;
 document.querySelectorAll('[data-plan-zoom]').forEach(link=>link.addEventListener('click',e=>{if(!dialog?.showModal)return;e.preventDefault();opener=link;const image=dialog.querySelector('img');image.src=link.href;image.alt=link.querySelector('img').alt;dialog.showModal()}));
 dialog?.querySelector('[data-plan-close]').addEventListener('click',()=>dialog.close());dialog?.addEventListener('close',()=>opener?.focus());dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
})();
