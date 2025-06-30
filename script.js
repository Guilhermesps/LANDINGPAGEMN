document.addEventListener("DOMContentLoaded", () => {
  // Inicializar AOS
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
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
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // Pop-up
  const popup = document.getElementById('lead-popup');
  const closePopup = document.querySelector('.popup-close');
  const popupForm = document.getElementById('popup-form');
  const popupEmailInput = popupForm.querySelector('input[name="email"]');

  setTimeout(() => popup.style.display = 'flex', 10000);
  closePopup.addEventListener('click', () => popup.style.display = 'none');

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
          popup.style.display = 'none';
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

  const validateField = (input, condition, errorMessage) => {
    const errorElement = input.nextElementSibling;
    if (condition) {
      input.classList.remove('invalid');
      input.classList.add('valid');
      errorElement.textContent = '';
    } else {
      input.classList.remove('valid');
      input.classList.add('invalid');
      errorElement.textContent = errorMessage;
    }
  };

  nomeInput.addEventListener('input', () => {
    validateField(nomeInput, nomeInput.value.trim().length >= 2, 'O nome deve ter pelo menos 2 caracteres.');
  });

  emailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'Por favor, insira um email válido.');
  });

  telefoneInput.addEventListener('input', () => {
    const telefone = telefoneInput.value.trim();
    const telefoneRegex = /^\d{10,11}$/;
    if (telefone === '') {
      validateField(telefoneInput, true, '');
    } else {
      validateField(telefoneInput, telefoneRegex.test(telefone), 'Telefone deve ter 10 ou 11 dígitos.');
    }
  });

  mensagemInput.addEventListener('input', () => {
    validateField(mensagemInput, mensagemInput.value.trim().length >= 10, 'A mensagem deve ter pelo menos 10 caracteres.');
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const mensagem = mensagemInput.value.trim();

    if (nome.length < 2) {
      validateField(nomeInput, false, 'O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validateField(emailInput, false, 'Por favor, insira um email válido.');
      return;
    }

    if (telefone !== '' && !/^\d{10,11}$/.test(telefone)) {
      validateField(telefoneInput, false, 'Telefone deve ter 10 ou 11 dígitos.');
      return;
    }

    if (mensagem.length < 10) {
      validateField(mensagemInput, false, 'A mensagem deve ter pelo menos 10 caracteres.');
      return;
    }

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
        if (navLinks.classList.contains("show")) {
          navLinks.classList.remove("show");
        }
      }
    });
  });

  // Menu hambúrguer
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
    }
  });
});
