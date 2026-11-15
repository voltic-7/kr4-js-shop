const Cart = {
    getItems() {
        try {
            const raw = localStorage.getItem(window.STORAGE_KEYS?.CART || 'football_shop_cart');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    saveItems(items) {
        try {
            localStorage.setItem(window.STORAGE_KEYS?.CART || 'football_shop_cart', JSON.stringify(items));
            this.updateBadges();
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items } }));
        } catch {}
    },

    addItem(productId, count = 1, sourceList = null) {
        const products = sourceList || window.currentProducts || window.INITIAL_PRODUCTS || [];
        const product = products.find(p => p.id === Number(productId));
        if (!product) return;

        const items = this.getItems();
        const existing = items.find(item => item.id === product.id);

        if (existing) {
            existing.quantity = Math.min(99, existing.quantity + count);
        } else {
            items.push({
                id: product.id,
                name: product.title || product.name,
                title: product.title || product.name,
                price: product.price,
                oldPrice: product.oldPrice,
                categoryName: product.categoryName,
                image: product.image,
                imageResponsive: product.imageResponsive,
                quantity: count
            });
        }

        this.saveItems(items);
        if (typeof window.showToast === 'function') {
            window.showToast(`«${product.title || product.name}» добавлен в корзину`, 'success');
        }
    },

    removeItem(productId) {
        const id = Number(productId);
        const items = this.getItems().filter(item => item.id !== id);
        this.saveItems(items);

        if (typeof window.showToast === 'function') {
            window.showToast('Товар удален из корзины', 'info');
        }
        this.renderCartPage();
    },

    updateQuantity(productId, change, isDelta = true) {
        const id = Number(productId);
        const items = this.getItems();
        const item = items.find(i => i.id === id);
        if (!item) return;

        if (isDelta) item.quantity += change;
        else item.quantity = change;

        if (item.quantity <= 0) {
            this.removeItem(id);
            return;
        }

        if (item.quantity > 99) item.quantity = 99;

        this.saveItems(items);
        this.renderCartPage();
    },

    clear() {
        this.saveItems([]);
        if (typeof window.showToast === 'function') {
            window.showToast('Корзина полностью очищена', 'info');
        }
        this.renderCartPage();
    },

    getSummary() {
        const items = this.getItems();
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const promoCode = sessionStorage.getItem('applied_promo') || '';
        let discount = 0;
        if (promoCode.toUpperCase() === 'FOOTBALL10') {
            discount = Math.round(subtotal * 0.10);
        }

        const total = Math.max(0, subtotal - discount);
        return { count, subtotal, discount, total, promoCode };
    },

    updateBadges() {
        const { count } = this.getSummary();
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = String(count);
            badge.setAttribute('aria-label', `Товаров в корзине: ${count}`);
            if (count === 0) badge.classList.add('cart-badge--empty');
            else badge.classList.remove('cart-badge--empty');
        });
    },

    renderCartPage() {
        const container = document.getElementById('cart-container');
        if (!container) return;

        const items = this.getItems();
        const { count, subtotal, discount, total, promoCode } = this.getSummary();

        if (items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty" role="region" aria-label="Пустая корзина">
                    <div class="cart-empty__icon" aria-hidden="true">🛒</div>
                    <h2 class="cart-empty__title">Ваша корзина пуста</h2>
                    <p class="cart-empty__text">Вы пока не добавили ни одного товара в корзину.</p>
                    <a class="button" href="catalog.html">Перейти в каталог</a>
                </div>
            `;
            return;
        }

        const rowsHtml = items.map(item => {
            const itemSubtotal = item.price * item.quantity;
            const respBase = item.imageResponsive || 'ball';
            const itemName = item.title || item.name;
            return `
                <tr class="cart-item-row" data-id="${item.id}">
                    <td data-label="Товар">
                        <div class="cart-item__product">
                            <picture>
                                <source type="image/webp" srcset="images/responsive/${respBase}-360.webp 360w, images/responsive/${respBase}-720.webp 720w">
                                <img class="cart-item__thumb" src="${item.image}" alt="${itemName}" width="64" height="64" loading="lazy">
                            </picture>
                            <div>
                                <a class="cart-item__name" href="product.html?id=${item.id}">${itemName}</a>
                                <div class="cart-item__category">${item.categoryName}</div>
                            </div>
                        </div>
                    </td>
                    <td data-label="Цена">
                        <span class="cart-item__price">${item.price.toLocaleString('ru-RU')} руб.</span>
                    </td>
                    <td data-label="Количество">
                        <div class="cart-quantity" role="group" aria-label="Количество товара ${itemName}">
                            <button class="cart-quantity__btn" type="button" data-action="decrease" data-id="${item.id}" aria-label="Уменьшить" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                            <span class="cart-quantity__val" aria-live="polite">${item.quantity}</span>
                            <button class="cart-quantity__btn" type="button" data-action="increase" data-id="${item.id}" aria-label="Увеличить">+</button>
                        </div>
                    </td>
                    <td data-label="Сумма">
                        <span class="cart-item__subtotal">${itemSubtotal.toLocaleString('ru-RU')} руб.</span>
                    </td>
                    <td data-label="Действие">
                        <button class="cart-item__remove-btn" type="button" data-action="remove" data-id="${item.id}" title="Удалить" aria-label="Удалить товар ${itemName}">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <div class="cart-page-layout">
                <div class="cart-items-container">
                    <div class="table-wrapper">
                        <table class="cart-table">
                            <caption class="visually-hidden">Список товаров в корзине</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Товар</th>
                                    <th scope="col">Цена</th>
                                    <th scope="col">Количество</th>
                                    <th scope="col">Сумма</th>
                                    <th scope="col"><span class="visually-hidden">Удалить</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                    <div class="cart-actions-bar">
                        <button class="button button--secondary" type="button" id="cart-clear-btn">Очистить корзину</button>
                        <a class="button button--secondary" href="catalog.html">← Продолжить покупки</a>
                    </div>
                </div>

                <aside class="cart-summary-box" aria-labelledby="cart-summary-heading">
                    <h2 class="cart-summary__title" id="cart-summary-heading">Сводка заказа</h2>
                    <div class="cart-summary__row">
                        <span>Всего товаров:</span>
                        <strong>${count} шт.</strong>
                    </div>
                    <div class="cart-summary__row">
                        <span>Стоимость товаров:</span>
                        <span>${subtotal.toLocaleString('ru-RU')} руб.</span>
                    </div>
                    ${discount > 0 ? `
                    <div class="cart-summary__row" style="color: var(--color-success);">
                        <span>Скидка по промокоду (10%):</span>
                        <span>−${discount.toLocaleString('ru-RU')} руб.</span>
                    </div>
                    ` : ''}
                    <div class="cart-summary__row cart-summary__row--total">
                        <span>Итого:</span>
                        <span class="cart-summary__total-price">${total.toLocaleString('ru-RU')} руб.</span>
                    </div>

                    <form class="cart-promo-form" id="cart-promo-form" action="#" method="get">
                        <label class="visually-hidden" for="cart-promo-input">Промокод</label>
                        <input class="promo-input" id="cart-promo-input" type="text" placeholder="Промокод (FOOTBALL10)" value="${promoCode}">
                        <button class="button button--secondary" type="submit">Применить</button>
                    </form>

                    <div class="cart-summary__actions">
                        <a class="button" href="order.html" style="text-align: center; width: 100%;">
                            Перейти к оформлению
                        </a>
                    </div>
                </aside>
            </div>
        `;

        container.onclick = (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const id = Number(btn.dataset.id);
            if (action === 'increase') this.updateQuantity(id, 1, true);
            else if (action === 'decrease') this.updateQuantity(id, -1, true);
            else if (action === 'remove') this.removeItem(id);
        };

        const clearBtn = document.getElementById('cart-clear-btn');
        if (clearBtn) {
            clearBtn.onclick = () => {
                if (confirm('Очистить корзину?')) this.clear();
            };
        }

        const promoForm = document.getElementById('cart-promo-form');
        if (promoForm) {
            promoForm.onsubmit = (e) => {
                e.preventDefault();
                const input = document.getElementById('cart-promo-input');
                const val = input ? input.value.trim().toUpperCase() : '';
                if (val === 'FOOTBALL10') {
                    sessionStorage.setItem('applied_promo', val);
                    if (typeof window.showToast === 'function') window.showToast('Промокод FOOTBALL10 применен (-10%)', 'success');
                    this.renderCartPage();
                } else if (!val) {
                    sessionStorage.removeItem('applied_promo');
                    this.renderCartPage();
                } else {
                    if (typeof window.showToast === 'function') window.showToast('Неверный промокод', 'error');
                }
            };
        }
    },

    init() {
        this.updateBadges();
        this.renderCartPage();
        window.addEventListener('storage', (event) => {
            if (event.key === (window.STORAGE_KEYS?.CART || 'football_shop_cart')) {
                this.updateBadges();
                this.renderCartPage();
            }
        });
    }
};

window.Cart = Cart;

document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
