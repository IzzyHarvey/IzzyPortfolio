document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = 'Menu';
    }));
  }

  // ---------- media gallery lightbox ----------
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const stage = lightbox.querySelector('.lightbox-inner');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentGroup = [];
  let currentIndex = 0;

  function renderItem(){
    const item = currentGroup[currentIndex];
    stage.querySelectorAll('video, img').forEach(el => el.remove());
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      stage.insertBefore(video, closeBtn.nextSibling);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      stage.insertBefore(img, closeBtn.nextSibling);
    }
    prevBtn.style.display = currentGroup.length > 1 ? '' : 'none';
    nextBtn.style.display = currentGroup.length > 1 ? '' : 'none';
  }

  function openLightbox(group, index){
    currentGroup = group;
    currentIndex = index;
    renderItem();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    stage.querySelectorAll('video, img').forEach(el => el.remove());
  }

  document.querySelectorAll('.media-gallery').forEach(gallery => {
    const thumbs = Array.from(gallery.querySelectorAll('.media-thumb'));
    const group = thumbs.map(t => ({
      type: t.dataset.type,
      src: t.dataset.src,
      alt: t.dataset.alt || ''
    }));
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => openLightbox(group, i));
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length; renderItem(); });
  nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % currentGroup.length; renderItem(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
});
