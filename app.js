// Configuração: troque só estas linhas.
const LINK_CHECKOUT = 'https://pay.cakto.com.br/3aam6mb_1279699';
const PIXEL_ID = '';   // ex.: '123456789012345' (Gerenciador de Eventos da Meta)
// Depoimentos REAIS de clientes: [nome curto, cidade, texto, 'img/depoimentos/arquivo.jpg' ou '']. Vazio = seção escondida.
const DEPOIMENTOS = [];

// O botão só pode levar ao checkout da Cakto (evita que um link adulterado mande o cliente para outro site).
const checkoutSeguro = (() => {
  try { const u = new URL(LINK_CHECKOUT); return u.protocol === 'https:' && u.hostname === 'pay.cakto.com.br' ? u.href : '#ofertas'; }
  catch { return '#ofertas'; }
})();
document.querySelectorAll('#ofertas a.compra').forEach(a => {
  a.href = checkoutSeguro; a.rel = 'noopener';
  a.addEventListener('click', () => window.fbq && fbq('track', 'InitiateCheckout', { value: 19.9, currency: 'BRL' }));
});

// barra fixa aparece depois do topo e some na seção de ofertas
const fixo = document.getElementById('fixo'), ofertas = document.getElementById('ofertas');
addEventListener('scroll', () => {
  const r = ofertas.getBoundingClientRect();
  fixo.style.display = scrollY > 600 && (r.top > innerHeight || r.bottom < 0) ? 'block' : 'none';
}, { passive: true });

// depoimentos: montados com textContent (nunca innerHTML), então texto de cliente não vira código
const sec = document.getElementById('depoimentos');
if (DEPOIMENTOS.length) {
  const lista = sec.querySelector('.lista-dep');
  for (const [nome, cidade, texto, img] of DEPOIMENTOS) {
    const c = document.createElement('figure'); c.className = 'dep';
    if (img && /^img\/depoimentos\/[\w.-]+\.(jpe?g|png|webp)$/.test(img)) { const i = document.createElement('img'); i.src = img; i.alt = 'Mensagem de ' + nome; i.loading = 'lazy'; c.append(i); }
    if (texto) { const q = document.createElement('blockquote'); q.textContent = texto; c.append(q); }
    const f = document.createElement('figcaption'); f.textContent = nome + (cidade ? ' · ' + cidade : ''); c.append(f);
    lista.append(c);
  }
  sec.hidden = false;
}

if (/^\d{10,20}$/.test(PIXEL_ID)) {
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID); fbq('track', 'PageView'); fbq('track', 'ViewContent', { content_name: 'A Biblia Explicada' });
}
