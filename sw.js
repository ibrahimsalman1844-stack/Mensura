var V='mensura-v1',
FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'],
QR='https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){
    return c.addAll(FILES).then(function(){
      return fetch(QR,{mode:'no-cors'}).then(function(r){return c.put(QR,r)}).catch(function(){});
    });
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request,u=r.url;
  if(r.method!=='GET')return;
  if(u===QR){e.respondWith(caches.match(QR).then(function(m){return m||fetch(r)}));return}
  if(u.indexOf(self.location.origin)!==0)return;
  e.respondWith(fetch(r).then(function(res){
    var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res;
  }).catch(function(){
    return caches.match(r).then(function(m){return m||caches.match('index.html')});
  }));
});
