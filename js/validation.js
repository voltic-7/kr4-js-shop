const FormValidator = {
    patterns: {
        name: /^[A-Za-zА-Яа-яЁё\s\-]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/
    },

    messages: {
        required: 'Это поле обязательно для заполнения',
        name: 'Имя должно содержать от 2 до 50 букв',
        email: 'Введите корректный e-mail (например, name@mail.ru)',
        phone: 'Формат телефона: +7 (900) 000-00-00',
        agreement: 'Необходимо подтвердить согласие на обработку данных'
    },

    // Инициализация валидации
    init() {
        document.querySelectorAll('.order-form, form[data-validate]').forEach(form => this.attachForm(form));
        document.querySelectorAll('input[type="tel"]').forEach(input => this.attachPhoneMask(input));
    },

    // Маска номера телефона
    attachPhoneMask(input) {
        input.addEventListener('input', () => {
            let value = input.value.replace(/\D/g, '');
            if (value.startsWith('8')) value = '7' + value.slice(1);
            if (!value.startsWith('7')) value = '7' + value;

            let formatted = '+7';
            if (value.length > 1) formatted += ' (' + value.substring(1, 4);
            if (value.length >= 5) formatted += ') ' + value.substring(4, 7);
            if (value.length >= 8) formatted += '-' + value.substring(7, 9);
            if (value.length >= 10) formatted += '-' + value.substring(9, 11);

            input.value = formatted;
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length <= 4) {
                e.preventDefault();
                input.value = '';
            }
        });
    },

    // Подключение валидации к форме
    attachForm(form) {
        form.setAttribute('novalidate', '');

        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('is-invalid')) this.validateField(field);
            });
        });

        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    },

    // Проверка отдельного поля
    validateField(field) {
        if (!field.name && !field.id) return true;
        if (field.type === 'hidden') return true;

        const val = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required')) {
            if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                errorMessage = this.messages.agreement;
            } else if (!val) {
                isValid = false;
                errorMessage = this.messages.required;
            }
        }

        if (isValid && val) {
            if (field.type === 'email' || field.name.toLowerCase().includes('email')) {
                if (!this.patterns.email.test(val)) {
                    isValid = false;
                    errorMessage = this.messages.email;
                }
            } else if (field.type === 'tel' || field.name.toLowerCase().includes('phone')) {
                if (!this.patterns.phone.test(val)) {
                    isValid = false;
                    errorMessage = this.messages.phone;
                }
            } else if (field.name.toLowerCase().includes('name')) {
                if (!this.patterns.name.test(val)) {
                    isValid = false;
                    errorMessage = this.messages.name;
                }
            }
        }

        this.setFieldStatus(field, isValid, errorMessage);
        return isValid;
    },

    // Отображение статуса ошибки
    setFieldStatus(field, isValid, message = '') {
        const parent = field.closest('.order-form__field') || field.parentElement;
        const errorId = `${field.id || field.name}-error`;
        let errorEl = document.getElementById(errorId);

        if (!isValid) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', errorId);

            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'field-error';
                errorEl.id = errorId;
                errorEl.setAttribute('role', 'alert');
                parent.appendChild(errorEl);
            }
            errorEl.replaceChildren();
            const iconSpan = document.createElement('span');
            iconSpan.setAttribute('aria-hidden', 'true');
            iconSpan.textContent = '⚠️ ';
            const msgSpan = document.createElement('span');
            msgSpan.textContent = message;
            errorEl.append(iconSpan, msgSpan);
        } else {
            field.classList.remove('is-invalid');
            field.setAttribute('aria-invalid', 'false');
            if (field.value.trim()) field.classList.add('is-valid');
            else field.classList.remove('is-valid');

            if (errorEl) errorEl.remove();
            field.removeAttribute('aria-describedby');
        }
    },

    // Отправка формы заявки
    async handleSubmit(event, form) {
        event.preventDefault();

        const fields = Array.from(form.querySelectorAll('input, select, textarea'));
        let isFormValid = true;
        let firstInvalid = null;

        fields.forEach(field => {
            const valid = this.validateField(field);
            if (!valid) {
                isFormValid = false;
                if (!firstInvalid) firstInvalid = field;
            }
        });

        if (!isFormValid) {
            if (firstInvalid) firstInvalid.focus();
            if (typeof window.showToast === 'function') window.showToast('Исправьте ошибки в форме', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Отправить';

        if (submitBtn) {
            submitBtn.classList.add('button--loading');
            submitBtn.disabled = true;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const orderNumber = `FS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

            if (window.Cart && typeof window.Cart.saveItems === 'function') {
                window.Cart.saveItems([]);
            }

            const successContainer = document.getElementById('success-message') || document.querySelector('.order-success-card');
            if (successContainer) {
                successContainer.hidden = false;
                successContainer.replaceChildren();

                const cardDiv = document.createElement('div');
                cardDiv.className = 'order-success-card';

                const iconDiv = document.createElement('div');
                iconDiv.className = 'order-success-card__icon';
                iconDiv.setAttribute('aria-hidden', 'true');
                iconDiv.textContent = '✅';

                const h2 = document.createElement('h2');
                h2.textContent = 'Заказ успешно оформлен!';

                const numDiv = document.createElement('div');
                numDiv.className = 'order-success-card__number';
                numDiv.textContent = `Номер вашего заказа: ${orderNumber}`;

                const p1 = document.createElement('p');
                p1.textContent = 'Наш менеджер свяжется с вами в течение 15 минут для подтверждения адреса и доставки.';

                const p2 = document.createElement('p');
                p2.style.marginTop = '16px';
                const backLink = document.createElement('a');
                backLink.className = 'button';
                backLink.href = 'catalog.html';
                backLink.textContent = 'Вернуться к покупкам';
                p2.appendChild(backLink);

                cardDiv.append(iconDiv, h2, numDiv, p1, p2);
                successContainer.appendChild(cardDiv);
                successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            if (typeof window.showToast === 'function') {
                window.showToast(`Заказ ${orderNumber} оформлен!`, 'success');
            }

            form.reset();
            fields.forEach(f => {
                f.classList.remove('is-valid', 'is-invalid');
                f.removeAttribute('aria-invalid');
                f.removeAttribute('aria-describedby');
            });

            const dialog = form.closest('dialog');
            if (dialog && dialog.open) {
                setTimeout(() => {
                    if (window.ModalManager) window.ModalManager.close(dialog);
                    else dialog.close();
                }, 1200);
            }
        } catch {
            if (typeof window.showToast === 'function') window.showToast('Ошибка при отправке заявки', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.classList.remove('button--loading');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    }
};

window.FormValidator = FormValidator;

document.addEventListener('DOMContentLoaded', () => {
    FormValidator.init();
});
