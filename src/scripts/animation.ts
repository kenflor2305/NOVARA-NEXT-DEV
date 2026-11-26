import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const init = () => {
  const context = gsap.context(() => {
    if (!reducedMotion) {
      gsap.set('.title-line > span', { yPercent: 115 });
      gsap.set('.hero-kicker, .hero-bottom', { opacity: 0, y: 20 });

      gsap.timeline({ delay: 0.15 })
        .to('.title-line > span', { yPercent: 0, duration: 1.05, stagger: 0.12, ease: 'power4.out' })
        .to('.hero-kicker, .hero-bottom', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=.55');

      document.querySelectorAll('.reveal-text').forEach((element) => {
        gsap.from(element, {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 82%', once: true },
        });
      });

      document.querySelectorAll('.reveal-item').forEach((element) => {
        if (element.closest('.hero')) return;
        gsap.from(element, {
          y: 35,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('.service-card, .project-card, .team-card').forEach((element, index) => {
        gsap.from(element, {
          y: 55,
          opacity: 0,
          duration: 0.85,
          delay: (index % 3) * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
        gsap.from(step, {
          x: -50,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 88%', once: true },
        });
      });

      gsap.to('.about-orb', {
        y: -35,
        rotation: 12,
        scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });
    }

    const header = document.querySelector('[data-header]');
    const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
    const themeColor = document.querySelector<HTMLMetaElement>('[data-theme-color]');
    const initialTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    themeToggle?.setAttribute('aria-pressed', String(initialTheme === 'light'));
    themeToggle?.setAttribute('aria-label', `Switch to ${initialTheme === 'light' ? 'dark' : 'light'} mode`);
    themeToggle?.setAttribute('title', `Switch to ${initialTheme === 'light' ? 'dark' : 'light'} mode`);
    if (themeColor) themeColor.content = initialTheme === 'light' ? '#f6f6f2' : '#080808';
    let themeTransitionTimer: number | undefined;
    const applyTheme = (theme: 'light' | 'dark') => {
      const root = document.documentElement;
      if (themeTransitionTimer) window.clearTimeout(themeTransitionTimer);
      root.classList.add('theme-transitioning');
      root.dataset.theme = theme;
      themeToggle?.setAttribute('aria-pressed', String(theme === 'light'));
      themeToggle?.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
      themeToggle?.setAttribute('title', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
      if (themeColor) themeColor.content = theme === 'light' ? '#f6f6f2' : '#080808';

      try {
        localStorage.setItem('novara-theme', theme);
      } catch {
        // The current page theme still works when storage is unavailable.
      }

      themeTransitionTimer = window.setTimeout(() => root.classList.remove('theme-transitioning'), 500);
    };

    themeToggle?.addEventListener('click', () => {
      applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
    });

    const menuToggle = document.querySelector('.menu-toggle') as HTMLButtonElement | null;
    const navLinks = document.querySelectorAll('.site-nav a');
    menuToggle?.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.forEach((link) => link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }));

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const dot = document.querySelector('.cursor-dot') as HTMLElement | null;
      const ring = document.querySelector('.cursor-ring') as HTMLElement | null;
      if (dot && ring) {
        window.addEventListener('mousemove', (event) => {
          gsap.set(dot, { x: event.clientX - 2.5, y: event.clientY - 2.5 });
          gsap.to(ring, { x: event.clientX - 19, y: event.clientY - 19, duration: 0.18, ease: 'power2.out' });
        });
        document.querySelectorAll('a, button, input, textarea').forEach((element) => {
          element.addEventListener('mouseenter', () => gsap.to(ring, { width: 58, height: 58, x: '-=10', y: '-=10', background: 'rgba(255,255,255,.08)', duration: 0.25 }));
          element.addEventListener('mouseleave', () => gsap.to(ring, { width: 38, height: 38, background: 'transparent', duration: 0.25 }));
        });
      }

      document.querySelectorAll<HTMLElement>('.tilt-card').forEach((card) => {
        card.addEventListener('mousemove', (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, { rotateY: x * 5, rotateX: y * -5, transformPerspective: 900, duration: 0.35, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' }));
      });

      document.querySelectorAll<HTMLElement>('.magnetic').forEach((element) => {
        element.addEventListener('mousemove', (event) => {
          const rect = element.getBoundingClientRect();
          gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * 0.12, y: (event.clientY - rect.top - rect.height / 2) * 0.12, duration: 0.35 });
        });
        element.addEventListener('mouseleave', () => gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.4)' }));
      });
    }

    const track = document.querySelector('.project-track') as HTMLElement | null;
    document.querySelector('[data-project-next]')?.addEventListener('click', () => track?.scrollBy({ left: track.clientWidth * 0.75, behavior: 'smooth' }));
    document.querySelector('[data-project-prev]')?.addEventListener('click', () => track?.scrollBy({ left: -track.clientWidth * 0.75, behavior: 'smooth' }));

    const form = document.querySelector('[data-contact-form]') as HTMLFormElement | null;
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      if (status) status.textContent = 'Thanks — your inquiry is ready to send.';
      form.reset();
    });
  });

  let renderer: THREE.WebGLRenderer | undefined;
  let frame = 0;
  const canvas = document.querySelector('#hero-canvas') as HTMLCanvasElement | null;

  if (canvas && !reducedMotion) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 8);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

      const group = new THREE.Group();
      scene.add(group);

      const geometry = new THREE.IcosahedronGeometry(1.45, 2);
      const material = new THREE.MeshPhysicalMaterial({ color: 0x5d72b8, wireframe: true, transparent: true, opacity: 0.34, roughness: 0.25, metalness: 0.2 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(2.15, 0.2, 0);
      group.add(sphere);

      const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.78, 1),
        new THREE.MeshPhysicalMaterial({ color: 0xb2bbff, transparent: true, opacity: 0.12, roughness: 0.1, metalness: 0.4 })
      );
      inner.position.copy(sphere.position);
      group.add(inner);

      const ringGeometry = new THREE.TorusGeometry(2.05, 0.012, 8, 160);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xbfc8ff, transparent: true, opacity: 0.24 });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(sphere.position);
      ring.rotation.set(1.1, 0.35, 0.2);
      group.add(ring);

      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 240;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 12;
        positions[i + 1] = (Math.random() - 0.5) * 7;
        positions[i + 2] = (Math.random() - 0.5) * 5;
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xaeb6de, size: 0.018, transparent: true, opacity: 0.55 }));
      scene.add(particles);

      scene.add(new THREE.AmbientLight(0xffffff, 1.2));

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        renderer?.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        group.position.x = rect.width < 780 ? -0.7 : 0;
      };
      resize();
      window.addEventListener('resize', resize);

      const pointer = { x: 0, y: 0 };
      window.addEventListener('pointermove', (event) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.35;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.25;
      }, { passive: true });

      const animate = () => {
        frame = requestAnimationFrame(animate);
        sphere.rotation.y += 0.002;
        sphere.rotation.x -= 0.001;
        inner.rotation.y -= 0.004;
        ring.rotation.z += 0.0015;
        particles.rotation.y += 0.0002;
        group.rotation.y += (pointer.x - group.rotation.y) * 0.025;
        group.rotation.x += (-pointer.y - group.rotation.x) * 0.025;
        renderer?.render(scene, camera);
      };
      animate();

      document.documentElement.addEventListener('astro:before-swap', () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        context.revert();
        renderer?.dispose();
      });
    } catch (error) {
      console.warn('3D hero unavailable:', error);
    }
  }
};

init();
