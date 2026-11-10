// Ser Essência — interações do site (sem bibliotecas externas)
(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');

  // Sombra no cabeçalho ao fazer scroll
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu no telemóvel (só existe em algumas páginas)
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    document.querySelectorAll('.nav-links a').forEach((a) =>
      a.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Elementos aparecem suavemente ao entrar no ecrã.
  // A classe "js" só é posta aqui: se este código falhar, nada fica escondido.
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('visible'));
  }

  // Mapa do Google só carrega com o clique (evita cookies de terceiros)
  const mapBtn = document.querySelector('[data-load-map]');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src =
        'https://www.google.com/maps?q=Rua+Teresa+Gomes+22,+2725-177+Algueir%C3%A3o-Mem+Martins&output=embed';
      iframe.title = 'Mapa: Ser Essência, Rua Teresa Gomes 22, Algueirão-Mem Martins';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      document.getElementById('mapa').replaceChildren(iframe);
    });
  }

  // Fotos a passar sozinhas (onde existir data-slideshow)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-slideshow]').forEach((box) => {
    const slides = [...box.querySelectorAll('.slide')];
    const dots = box.querySelector('.dots');
    if (slides.length < 2 || !dots) return;
    let current = 0;
    let timer;
    const go = (k) => {
      slides[current].classList.remove('on');
      dots.children[current].classList.remove('on');
      current = k;
      slides[current].classList.add('on');
      dots.children[current].classList.add('on');
    };
    const restart = () => {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => go((current + 1) % slides.length), 4500);
    };
    slides.forEach((_, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Imagem ' + (k + 1));
      b.addEventListener('click', () => { go(k); restart(); });
      dots.appendChild(b);
    });
    dots.children[0].classList.add('on');

    // Setas anterior / seguinte
    const arrow = (dir) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'arrow ' + (dir < 0 ? 'prev' : 'next');
      b.setAttribute('aria-label', dir < 0 ? 'Imagem anterior' : 'Imagem seguinte');
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
        (dir < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>';
      b.addEventListener('click', () => { go((current + dir + slides.length) % slides.length); restart(); });
      box.appendChild(b);
    };
    arrow(-1);
    arrow(1);
    restart();
  });

  // Ano atual no rodapé
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
})();
