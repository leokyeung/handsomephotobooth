(function () {
  if (!window.fetch || !window.FormData) return;

  function findStatus(form) {
    var target = form.getAttribute('data-status-target');
    if (target) return document.querySelector(target);
    return form.parentElement && form.parentElement.querySelector('[data-form-status]');
  }

  function showStatus(status, type, message, title, shouldFocus) {
    if (!status) return;
    status.textContent = '';
    status.classList.remove('is-entered');
    if (type === 'success' && title) {
      var heading = document.createElement('h3');
      var body = document.createElement('p');
      heading.textContent = title;
      body.textContent = message;
      status.appendChild(heading);
      status.appendChild(body);
    } else {
      status.textContent = message;
    }
    status.classList.remove('form-status-success', 'form-status-error');
    status.classList.add('is-visible', type === 'success' ? 'form-status-success' : 'form-status-error');
    status.setAttribute('role', type === 'success' ? 'status' : 'alert');
    window.requestAnimationFrame(function () {
      status.classList.add('is-entered');
    });

    if (shouldFocus) {
      try {
        status.focus({ preventScroll: true });
      } catch (error) {
        status.focus();
      }
    }
  }

  function clearStatus(status) {
    if (!status) return;
    status.textContent = '';
    status.classList.remove('is-visible', 'is-entered', 'form-status-success', 'form-status-error');
    status.setAttribute('role', 'status');
  }

  function getErrorMessage(response, data) {
    if (data && data.errors && data.errors.length) {
      return data.errors.map(function (error) {
        return error.message;
      }).join(' ');
    }

    if (response && response.status === 422) {
      return 'Please check the highlighted fields and try again.';
    }

    return 'Sorry, something went wrong. Please try again or email leo@handsomephotobooth.com.';
  }

  function setSubmitting(button, submitting) {
    if (!button) return;
    if (!button.getAttribute('data-original-text')) {
      button.setAttribute('data-original-text', button.textContent);
    }

    button.disabled = submitting;
    button.textContent = submitting
      ? button.getAttribute('data-sending-text') || 'Sending...'
      : button.getAttribute('data-original-text');
  }

  function prepareSuccessTransition(form) {
    var container = form.parentElement;
    if (!container) return;

    container.style.setProperty('--success-area-height', form.offsetHeight + 'px');
    container.classList.add('form-success-active');
    form.classList.add('form-is-leaving');
  }

  document.querySelectorAll('[data-ajax-form]').forEach(function (form) {
    var status = findStatus(form);
    var submitButton = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearStatus(status);
      setSubmitting(submitButton, true);

      fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      })
        .then(function (response) {
          return response.json().catch(function () {
            return {};
          }).then(function (data) {
            if (!response.ok) {
              throw { response: response, data: data };
            }
            return data;
          });
        })
        .then(function () {
          prepareSuccessTransition(form);
          form.reset();
          showStatus(
            status,
            'success',
            form.getAttribute('data-success-message') ||
              'Thank you! We received your inquiry and will reply within 12 hours.',
            form.getAttribute('data-success-title'),
            false
          );
          window.setTimeout(function () {
            form.hidden = true;
            form.classList.remove('form-is-leaving');
          }, 280);
        })
        .catch(function (error) {
          showStatus(status, 'error', getErrorMessage(error.response, error.data), null, null, true);
        })
        .finally(function () {
          setSubmitting(submitButton, false);
        });
    });
  });
})();
