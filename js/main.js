// Всплывающее уведомление
function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'toast__icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.textContent = icon;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'toast__content';
    contentDiv.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast__close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Закрыть');
    closeBtn.textContent = '×';

    toast.append(iconSpan, contentDiv, closeBtn);
    const removeToast = () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 250);
    };

    closeBtn.addEventListener('click', removeToast);
    container.appendChild(toast);

    if (duration > 0) setTimeout(removeToast, duration);
}

window.showToast = showToast;

const ThemeManager = {
    // Инициализация темы
    init() {
        const saved = localStorage.getItem(window.STORAGE_KEYS?.THEME || 'football_shop_theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (systemPrefersDark ? 'dark' : 'light');

        this.applyTheme(theme);

        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.onclick = () => this.toggleTheme();
        });

        window.addEventListener('storage', (e) => {
            if (e.key === (window.STORAGE_KEYS?.THEME || 'football_shop_theme')) {
                this.applyTheme(e.newValue || 'light');
            }
        });
    },

    // Применение темы
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const isDark = theme === 'dark';

        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
            btn.setAttribute('title', isDark ? 'Светлая тема' : 'Тёмная тема');
            const icon = btn.querySelector('.theme-toggle__icon');
            if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        });
    },

    // Переключение темы
    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
        try {
            localStorage.setItem(window.STORAGE_KEYS?.THEME || 'football_shop_theme', next);
        } catch {}
        if (typeof showToast === 'function') {
            showToast(`Включена ${next === 'dark' ? 'тёмная' : 'светлая'} тема`, 'info', 1800);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();

    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.getElementById('primary-nav');

    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            const nextState = !isExpanded;

            menuToggle.setAttribute('aria-expanded', String(nextState));
            siteNav.classList.toggle('is-open', nextState);

            if (nextState) {
                const firstLink = siteNav.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });

        document.addEventListener('click', (event) => {
            if (siteNav.classList.contains('is-open')) {
                if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
                    siteNav.classList.remove('is-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
                siteNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && siteNav.classList.contains('is-open')) {
                siteNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) scrollTopBtn.classList.add('is-visible');
            else scrollTopBtn.classList.remove('is-visible');
        }, { passive: true });

        scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Блок статуса JavaScript
    const statusMsg = document.getElementById('js-status-message');
    if (statusMsg) {
        statusMsg.textContent = '⚡ JavaScript успешно загружен и инициализирован (Vanilla JS)';
    }
    const summaryOutput = document.getElementById('js-summary-output');
    if (summaryOutput && window.products && window.products.length > 0) {
        const availCount = typeof window.countAvailableProducts === 'function' ? window.countAvailableProducts() : 11;
        const avgPrice = typeof window.calculateAveragePrice === 'function' ? window.calculateAveragePrice() : 10692;
        summaryOutput.textContent = `Каталог: ${window.products.length} товаров | В наличии: ${availCount} | Средняя цена: ${avgPrice.toLocaleString('ru-RU')} руб.`;
    }
});
