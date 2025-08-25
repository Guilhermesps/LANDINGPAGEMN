document.addEventListener("DOMContentLoaded", () => {
  // Ocultar preloader após carregamento
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.style.display = 'none', 500);
  });

  // Inicializar AOS
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    startEvent: 'DOMContentLoaded',
  });

  // Inicializar Swiper
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
    autoplay: { delay: 5000, disableOnInteraction: false },
  });

  // Pop-up
  const popup = document.getElementById('lead-popup');
  const closePopup = document.querySelector('.popup-close');
  const popupForm = document.getElementById('popup-form');
  const popupEmailInput = popupForm.querySelector('input[name="email"]');

  setTimeout(() => {
    popup.style.display = 'flex';
    popup.classList.add('active');
  }, 30000);

  closePopup.addEventListener('click', () => {
    popup.classList.remove('active');
    setTimeout(() => popup.style.display = 'none', 300);
  });

  // Validação do pop-up
  popupEmailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = popupEmailInput.nextElementSibling || popupEmailInput.parentElement.appendChild(document.createElement('span'));
    errorElement.className = 'form-error';
    if (emailRegex.test(popupEmailInput.value.trim())) {
      popupEmailInput.classList.remove('invalid');
      popupEmailInput.classList.add('valid');
      errorElement.textContent = '';
    } else {
      popupEmailInput.classList.remove('valid');
      popupEmailInput.classList.add('invalid');
      errorElement.textContent = 'Por favor, insira um email válido.';
    }
  });

  popupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = popupEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, insira um email válido.',
      });
      return;
    }

    fetch(popupForm.action, {
      method: popupForm.method,
      body: new FormData(popupForm),
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'E-mail Enviado!',
            text: 'Você receberá o catálogo em breve.',
            timer: 3000,
            showConfirmButton: false,
          });
          popupForm.reset();
          popupEmailInput.classList.remove('valid', 'invalid');
          popup.classList.remove('active');
          setTimeout(() => popup.style.display = 'none', 300);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Houve um problema ao enviar sua solicitação. Tente novamente.',
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Houve um problema ao enviar sua solicitação. Tente novamente.',
        });
      });
  });

  // Validação do formulário de contato
  const form = document.getElementById("contato-form");
  const nomeInput = form.querySelector('#nome');
  const emailInput = form.querySelector('#email');
  const telefoneInput = form.querySelector('#telefone');
  const mensagemInput = form.querySelector('#mensagem');

  function validateField(input, condition, errorMessage) {
    const errorElement = input.nextElementSibling;
    if (condition) {
      input.classList.remove('invalid');
      input.classList.add('valid');
      errorElement.textContent = '';
      return true;
    } else {
      input.classList.remove('valid');
      input.classList.add('invalid');
      errorElement.textContent = errorMessage;
      return false;
    }
  }

  nomeInput.addEventListener('input', () => {
    validateField(nomeInput, nomeInput.value.trim().length >= 2, 'O nome deve ter pelo menos 2 caracteres.');
  });

  emailInput.addEventListener('input', () => {
    validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Por favor, insira um email válido.');
  });

  telefoneInput.addEventListener('input', () => {
    const telefone = telefoneInput.value.trim();
    validateField(telefoneInput, telefone === '' || /^\d{10,11}$/.test(telefone), 'Telefone deve ter 10 ou 11 dígitos.');
  });

  mensagemInput.addEventListener('input', () => {
    validateField(mensagemInput, mensagemInput.value.trim().length >= 10, 'A mensagem deve ter pelo menos 10 caracteres.');
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isNomeValid = validateField(nomeInput, nomeInput.value.trim().length >= 2, 'O nome deve ter pelo menos 2 caracteres.');
    const isEmailValid = validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Por favor, insira um email válido.');
    const isTelefoneValid = validateField(telefoneInput, telefoneInput.value.trim() === '' || /^\d{10,11}$/.test(telefoneInput.value.trim()), 'Telefone deve ter 10 ou 11 dígitos.');
    const isMensagemValid = validateField(mensagemInput, mensagemInput.value.trim().length >= 10, 'A mensagem deve ter pelo menos 10 caracteres.');

    if (isNomeValid && isEmailValid && isTelefoneValid && isMensagemValid) {
      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Mensagem Enviada!',
              text: 'Entraremos em contato em breve.',
              timer: 3000,
              showConfirmButton: false,
            });
            form.reset();
            [nomeInput, emailInput, telefoneInput, mensagemInput].forEach(input => {
              input.classList.remove('valid', 'invalid');
              input.nextElementSibling.textContent = '';
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Houve um problema ao enviar sua mensagem. Tente novamente.',
            });
          }
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Houve um problema ao enviar sua mensagem. Tente novamente.',
          });
        });
    }
  });

  // Navegação suave
  const links = document.querySelectorAll(".nav-links a, .back-to-top");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  links.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const sectionId = link.getAttribute("href").substring(1);
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else if (link.classList.contains("back-to-top")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");
      }
    });
  });

  // Menu hambúrguer
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    menuToggle.classList.toggle("active");
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
    }
  });

  // Botão "Voltar ao Topo"
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // Verificar imagem de fundo da seção .hero
  const heroSection = document.querySelector('.hero');
  const bgImage = 'FOTOS/FOTO ESTOQUE 1.png';
  const img = new Image();
  img.src = bgImage;
  img.onload = () => console.log(`Imagem ${bgImage} carregada com sucesso.`);
  img.onerror = () => {
    console.error(`Erro: Não foi possível carregar a imagem ${bgImage}. Verifique o caminho do arquivo.`);
    heroSection.style.background = '#ccc';
  };

  // Modo Escuro
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  const body = document.body;

  // Verificar preferência salva ou sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.setAttribute('data-theme', 'dark');
  }

  darkModeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
});