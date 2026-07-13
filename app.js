document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. SERVICES INTERACTIVE TABS
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate all buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      // Deactivate all panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });

      // Activate selected button
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Activate corresponding panel
      const targetId = button.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. FAQ INTERACTIVE ACCORDION ACCESSIBILITY
  // ==========================================
  const detailsElements = document.querySelectorAll('.faq-list details');

  detailsElements.forEach(targetDetail => {
    targetDetail.addEventListener('click', (e) => {
      // Close other details when opening one
      if (!targetDetail.open) {
        detailsElements.forEach(detail => {
          if (detail !== targetDetail && detail.open) {
            detail.removeAttribute('open');
          }
        });
      }
    });
  });


  // ==========================================
  // 4. SCROLLSPY ACTIVE NAV LINKS
  // ==========================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveLink = () => {
    let currentSectionId = 'home';
    const scrollPosition = window.scrollY + 120; // offset navbar height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // initial run

  // ==========================================
  // 5. CONTACT FORM & SUCCESS MODAL SIMULATION
  // ==========================================
  const form = document.getElementById('consultation-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusMsg = document.getElementById('form-status-msg');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Form validation
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      
      if (!name || !email || !phone) {
        statusMsg.textContent = 'Please fill out all required fields.';
        statusMsg.style.color = '#ff7b7b';
        return;
      }

      // Google Sheets Web App URL (Paste your deployed Google Web App URL here)
      const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwDomcbOkZVuNvjvuF3KzACH3dvyrN2qSdQNZ8tBb0ESljp62nYzG5ityaiRPrJa8SRsA/exec';

      // UI visual feedback
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing Request...';
      statusMsg.textContent = 'Verifying and submitting information...';
      statusMsg.style.color = '#e2b95f';

      if (GOOGLE_SHEETS_URL) {
        // Prepare Form Data URL-encoded parameters to avoid CORS preflight issues
        const params = new URLSearchParams();
        params.append('name', name);
        params.append('email', email);
        params.append('phone', phone);
        params.append('service', document.getElementById('form-service').value);
        params.append('message', document.getElementById('form-message').value.trim());

        fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          body: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.result === 'success') {
            form.reset();
            successModal.classList.add('active');
            statusMsg.textContent = '';
          } else {
            statusMsg.textContent = 'Submission failed: ' + (data.error || 'Unknown error');
            statusMsg.style.color = '#ff7b7b';
          }
        })
        .catch(error => {
          statusMsg.textContent = 'Network error: could not connect to sheet.';
          statusMsg.style.color = '#ff7b7b';
          console.error('Error!', error.message);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = '🚀 Book Free Consultation';
        });
      } else {
        // Fallback simulation for local offline testing
        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = '🚀 Book Free Consultation';
          statusMsg.textContent = '';
          successModal.classList.add('active');
        }, 1200);
      }
    });
  }

  // Modal interaction closure
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    // Close when overlay is clicked
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }
});
