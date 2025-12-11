// 1. Инициализация Smooth Scroll (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Мобильное меню
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  const body = document.body;
  const links = document.querySelectorAll('.header__link');

  burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      if (nav.classList.contains('active')) {
          lenis.stop();
          body.style.overflow = 'hidden';
      } else {
          lenis.start();
          body.style.overflow = '';
      }
  });

  links.forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
              burger.classList.remove('active');
              nav.classList.remove('active');
              lenis.start();
              body.style.overflow = '';
          }
      });
  });

  // 3. Three.js Фон (Частицы / Нейросеть)
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Создаем частицы
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 700;
      const posArray = new Float32Array(particlesCount * 3);

      for(let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 15; // Разброс
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const material = new THREE.PointsMaterial({
          size: 0.02,
          color: 0x6366f1, // Indigo color
          transparent: true,
          opacity: 0.8,
      });

      const particlesMesh = new THREE.Points(particlesGeometry, material);
      scene.add(particlesMesh);

      camera.position.z = 3;

      // Анимация частиц
      const animateThree = () => {
          requestAnimationFrame(animateThree);
          particlesMesh.rotation.y += 0.001;
          particlesMesh.rotation.x += 0.0005;
          renderer.render(scene, camera);
      };
      animateThree();

      // Ресайз
      window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
      });
  }

  // 4. Анимации GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Hero Text Reveal
  gsap.from('.hero__title', {
      duration: 1.2,
      y: 100,
      opacity: 0,
      ease: 'power4.out',
      delay: 0.2
  });

  gsap.from('.hero__subtitle', {
      duration: 1.2,
      y: 50,
      opacity: 0,
      ease: 'power4.out',
      delay: 0.4
  });

  // Fade In секций при скролле
  gsap.utils.toArray('.section').forEach(section => {
      gsap.from(section, {
          scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
      });
  });

  // 5. Логика Формы
  const form = document.getElementById('leadForm');
  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');
  const captchaLabel = document.getElementById('captchaLabel');
  const captchaInput = document.getElementById('captchaInput');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn = document.querySelector('.form-btn');

  // Валидация телефона (только цифры)
  phoneInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (/[^0-9+]/.test(val)) {
          phoneError.style.display = 'block';
          e.target.value = val.replace(/[^0-9+]/g, '');
      } else {
          phoneError.style.display = 'none';
      }
  });

  // Math Captcha
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const sum = num1 + num2;
  captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

  form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Проверка капчи
      if (parseInt(captchaInput.value) !== sum) {
          alert('Неверный ответ на пример!');
          return;
      }

      // Имитация отправки (AJAX)
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Отправка...</span>';
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
          form.style.display = 'none';
          successMsg.style.display = 'block';
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.opacity = '1';

          // Здесь можно добавить реальный fetch запрос
          console.log('Form submitted:', {
              name: form.name.value,
              email: form.email.value,
              phone: form.phone.value
          });
      }, 1500);
  });

  // 6. Cookie Popup
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookies = document.getElementById('acceptCookies');

  if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
          cookiePopup.style.display = 'flex';
          gsap.fromTo(cookiePopup, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      }, 2000);
  }

  acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      gsap.to(cookiePopup, { y: 50, opacity: 0, duration: 0.5, onComplete: () => {
          cookiePopup.style.display = 'none';
      }});
  });
});