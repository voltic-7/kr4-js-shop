const ModalManager = {
    activeDialog: null,
    lastActiveElement: null,

    // Инициализация модальных окон
    init() {
        document.querySelectorAll('dialog').forEach(dialog => {
            const closeBtn = dialog.querySelector('[data-close-dialog], .dialog-close, #close-order-dialog');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close(dialog));
            }

            dialog.addEventListener('click', (event) => {
                const rect = dialog.getBoundingClientRect();
                const inDialog = (
                    rect.top <= event.clientY &&
                    event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX &&
                    event.clientX <= rect.left + rect.width
                );
                if (!inDialog) this.close(dialog);
            });

            dialog.addEventListener('close', () => {
                if (this.lastActiveElement) {
                    this.lastActiveElement.focus();
                    this.lastActiveElement = null;
                }
                this.activeDialog = null;
            });

            dialog.addEventListener('keydown', (event) => {
                if (event.key !== 'Tab') return;
                const focusable = dialog.querySelectorAll(
                    'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            });
        });

        document.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-modal-target], [data-product]');
            if (!trigger) return;

            const productName = trigger.dataset.product;
            const targetId = trigger.dataset.modalTarget || 'order-dialog';
            const dialog = document.getElementById(targetId);

            if (dialog) {
                this.open(dialog, trigger);
                if (productName) {
                    const input = dialog.querySelector('#selected-product, input[name="selected-product"]');
                    if (input) input.value = productName;
                    const label = dialog.querySelector('#dialog-order-product-name');
                    if (label) label.textContent = `Товар: ${productName}`;
                }
            }
        });
    },

    // Открытие диалогового окна
    open(dialog, trigger = null) {
        if (!dialog) return;
        this.lastActiveElement = trigger || document.activeElement;
        this.activeDialog = dialog;
        dialog.showModal();
        const first = dialog.querySelector('input:not([type="hidden"]), select, textarea, button:not([data-close-dialog])');
        if (first) setTimeout(() => first.focus(), 30);
    },

    // Закрытие диалогового окна
    close(dialog = null) {
        const target = dialog || this.activeDialog;
        if (!target) return;
        target.close();
    }
};

window.ModalManager = ModalManager;

document.addEventListener('DOMContentLoaded', () => {
    ModalManager.init();
});
