const Catalog = {
    allProducts: [],
    filteredProducts: [],
    currentPage: 1,
    pageSize: 6,
    activeFilters: {
        search: '',
        category: 'all',
        minPrice: 0,
        maxPrice: Infinity,
        sortBy: 'popular',
        onlyFavorites: false
    },

    // Чтение избранного из хранилища
    getFavorites() {
        try {
            const raw = localStorage.getItem(window.STORAGE_KEYS?.FAVORITES || 'football_shop_favorites');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    // Переключение избранного
    toggleFavorite(productId) {
        const id = Number(productId);
        let favs = this.getFavorites();
        const exists = favs.includes(id);

        if (exists) {
            favs = favs.filter(item => item !== id);
            if (typeof window.showToast === 'function') window.showToast('Товар удален из избранного', 'info');
        } else {
            favs.push(id);
            if (typeof window.showToast === 'function') window.showToast('Товар добавлен в избранное', 'success');
        }

        try {
            localStorage.setItem(window.STORAGE_KEYS?.FAVORITES || 'football_shop_favorites', JSON.stringify(favs));
        } catch {}

        this.updateFavoriteBadges();

        document.querySelectorAll(`.button--favorite[data-id="${id}"]`).forEach(btn => {
            btn.classList.toggle('is-active', !exists);
            btn.setAttribute('aria-pressed', String(!exists));
        });

        if (this.activeFilters.category === 'favorites') {
            this.applyFiltersAndRender();
        }
    },

    // Обновление счётчиков избранного
    updateFavoriteBadges() {
        const count = this.getFavorites().length;
        document.querySelectorAll('.wishlist-badge').forEach(badge => {
            badge.textContent = String(count);
            badge.setAttribute('aria-label', `В избранном: ${count}`);
        });
    },

    // Инициализация каталога
    async init() {
        if (typeof window.loadProductsData === 'function') {
            this.allProducts = await window.loadProductsData();
        } else {
            this.allProducts = window.INITIAL_PRODUCTS || [];
        }

        window.currentProducts = this.allProducts;
        this.updateFavoriteBadges();

        const catalogContainer = document.getElementById('catalog-products');
        if (catalogContainer) this.initCatalogPage();

        const featuredContainer = document.getElementById('featured-products');
        if (featuredContainer) this.initFeaturedProducts();

        const productDetailContainer = document.getElementById('product-detail-container');
        if (productDetailContainer) this.initProductDetailPage();

        document.addEventListener('click', (e) => {
            const addBtn = e.target.closest('button[data-action="add-to-cart"]');
            if (addBtn) {
                const id = Number(addBtn.dataset.id);
                if (window.Cart) window.Cart.addItem(id, 1, this.allProducts);
                return;
            }

            const favBtn = e.target.closest('.button--favorite');
            if (favBtn) {
                const id = Number(favBtn.dataset.id);
                this.toggleFavorite(id);
                return;
            }
        });
    },

    // Вывод популярных товаров
    initFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;
        const popular = this.allProducts.filter(p => p.isPopular).slice(0, 3);
        container.replaceChildren(...popular.map(p => this.createProductCard(p)));
    },

    // Страница отдельного товара
    initProductDetailPage() {
        const params = new URLSearchParams(window.location.search);
        const productId = Number(params.get('id')) || 1;
        const product = this.allProducts.find(p => p.id === productId) || this.allProducts[0];
        if (!product) return;

        const prodTitle = product.title || product.name;
        document.title = `${prodTitle} — FootballShop`;
        const breadcrumbCurrent = document.querySelector('.breadcrumbs__current');
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = prodTitle;

        const titleEl = document.getElementById('product-title');
        if (titleEl) titleEl.textContent = prodTitle;

        const priceEl = document.getElementById('product-price');
        if (priceEl) priceEl.textContent = `${product.price.toLocaleString('ru-RU')} руб.`;

        const descEl = document.getElementById('product-description');
        if (descEl) descEl.textContent = product.description;

        const imageContainer = document.getElementById('product-image-container');
        if (imageContainer) {
            const respBase = product.imageResponsive || 'ball';
            imageContainer.innerHTML = `
                <div style="position: relative;">
                    ${product.isNew ? '<span class="product-card__badge product-card__badge--new">Новинка</span>' : ''}
                    <picture>
                        <source type="image/webp"
                                srcset="images/responsive/${respBase}-360.webp 360w, images/responsive/${respBase}-720.webp 720w"
                                sizes="(max-width: 767px) 100vw, 50vw">
                        <source type="image/jpeg"
                                srcset="images/responsive/${respBase}-360.jpg 360w, images/responsive/${respBase}-720.jpg 720w"
                                sizes="(max-width: 767px) 100vw, 50vw">
                        <img src="${product.image}"
                             alt="${product.name}"
                             width="447"
                             height="447"
                             style="width: 100%; height: auto; border-radius: 12px;"
                             loading="lazy"
                             decoding="async">
                    </picture>
                </div>
            `;
        }

        const specsTbody = document.getElementById('product-specs-tbody');
        if (specsTbody && product.specs) {
            specsTbody.innerHTML = Object.entries(product.specs).map(([key, val]) => `
                <tr>
                    <td data-label="Параметр">${key}</td>
                    <td data-label="Значение">${val}</td>
                </tr>
            `).join('');
        }

        const addToCartBtn = document.getElementById('product-add-cart-btn');
        const qtyInput = document.getElementById('product-quantity-input');
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                const count = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;
                if (window.Cart) window.Cart.addItem(product.id, count, this.allProducts);
            };
        }

        const quickOrderBtn = document.getElementById('product-quick-order-btn');
        if (quickOrderBtn) {
            quickOrderBtn.dataset.product = product.title || product.name;
        }
    },

    // Инициализация страницы каталога
    initCatalogPage() {
        this.setupToolbar();
        this.setupFilterEvents();
        this.applyFiltersAndRender();
    },

    // Настройка поиска и сортировки
    setupToolbar() {
        const searchInput = document.getElementById('catalog-search-input');
        const searchClear = document.getElementById('catalog-search-clear');
        let searchTimeout = null;

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const val = searchInput.value.trim();
                if (searchClear) searchClear.classList.toggle('is-visible', val.length > 0);

                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.activeFilters.search = val.toLowerCase();
                    this.currentPage = 1;
                    this.applyFiltersAndRender();
                }, 200);
            });
        }

        if (searchClear && searchInput) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.classList.remove('is-visible');
                this.activeFilters.search = '';
                this.currentPage = 1;
                this.applyFiltersAndRender();
                searchInput.focus();
            });
        }

        const sortSelect = document.getElementById('catalog-sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.activeFilters.sortBy = sortSelect.value;
                this.applyFiltersAndRender();
            });
        }
    },

    // Настройка фильтров
    setupFilterEvents() {
        const filterForm = document.querySelector('.filters-form');
        if (!filterForm) return;

        filterForm.addEventListener('change', (e) => {
            if (e.target.name === 'category') {
                this.activeFilters.category = e.target.value;
                this.currentPage = 1;
                this.applyFiltersAndRender();
            }
        });

        const priceFrom = document.getElementById('price-from');
        const priceTo = document.getElementById('price-to');

        const handlePriceChange = () => {
            this.activeFilters.minPrice = parseFloat(priceFrom?.value) || 0;
            this.activeFilters.maxPrice = parseFloat(priceTo?.value) || Infinity;
            this.currentPage = 1;
            this.applyFiltersAndRender();
        };

        if (priceFrom) priceFrom.addEventListener('input', handlePriceChange);
        if (priceTo) priceTo.addEventListener('input', handlePriceChange);

        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePriceChange();
        });
    },

    // Применение фильтров и рендер
    applyFiltersAndRender() {
        const favorites = this.getFavorites();

        this.filteredProducts = this.allProducts.filter(product => {
            if (this.activeFilters.search) {
                const query = this.activeFilters.search;
                const matchName = product.name.toLowerCase().includes(query);
                const matchDesc = product.description.toLowerCase().includes(query);
                if (!matchName && !matchDesc) return false;
            }

            if (this.activeFilters.category !== 'all') {
                if (this.activeFilters.category === 'popular' && !product.isPopular) return false;
                if (this.activeFilters.category === 'new' && !product.isNew) return false;
                if (this.activeFilters.category === 'favorites' && !favorites.includes(product.id)) return false;
                if (!['popular', 'new', 'favorites'].includes(this.activeFilters.category)) {
                    if (product.category !== this.activeFilters.category) return false;
                }
            }

            if (product.price < this.activeFilters.minPrice) return false;
            if (product.price > this.activeFilters.maxPrice) return false;

            return true;
        });

        this.filteredProducts.sort((a, b) => {
            if (this.activeFilters.sortBy === 'price-asc') return a.price - b.price;
            if (this.activeFilters.sortBy === 'price-desc') return b.price - a.price;
            if (this.activeFilters.sortBy === 'name-asc') return a.name.localeCompare(b.name, 'ru');
            return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        });

        this.renderCatalogList();
        this.renderPagination();
    },

    // Создание карточки товара
    createProductCard(product) {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = String(product.id);
        const isAvail = product.isAvailable !== false;
        if (!isAvail) {
            card.classList.add('product-card--unavailable');
        }

        if (product.isNew) {
            const badge = document.createElement('span');
            badge.className = 'product-card__badge product-card__badge--new';
            badge.textContent = 'Новинка';
            card.appendChild(badge);
        } else if (product.isPopular) {
            const badge = document.createElement('span');
            badge.className = 'product-card__badge';
            badge.textContent = 'Хит';
            card.appendChild(badge);
        }

        const picture = document.createElement('picture');
        const respBase = product.imageResponsive || 'ball';

        const sourceWebp = document.createElement('source');
        sourceWebp.type = 'image/webp';
        sourceWebp.srcset = `images/responsive/${respBase}-360.webp 360w, images/responsive/${respBase}-720.webp 720w`;
        sourceWebp.sizes = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw';

        const sourceJpg = document.createElement('source');
        sourceJpg.type = 'image/jpeg';
        sourceJpg.srcset = `images/responsive/${respBase}-360.jpg 360w, images/responsive/${respBase}-720.jpg 720w`;
        sourceJpg.sizes = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title || product.name;
        img.width = 447;
        img.height = 447;
        img.loading = 'lazy';
        img.decoding = 'async';

        picture.append(sourceWebp, sourceJpg, img);
        card.appendChild(picture);

        const categoryEl = document.createElement('div');
        categoryEl.className = 'product-card__category';
        categoryEl.textContent = product.categoryName || product.category;
        card.appendChild(categoryEl);

        const titleEl = document.createElement('h3');
        titleEl.className = 'product-card__title';

        const titleLink = document.createElement('a');
        titleLink.href = `product.html?id=${product.id}`;
        titleLink.style.color = 'inherit';
        titleLink.style.textDecoration = 'none';
        titleLink.textContent = product.title || product.name;

        titleEl.appendChild(titleLink);
        card.appendChild(titleEl);

        const descEl = document.createElement('p');
        descEl.className = 'product-card__description';
        descEl.textContent = product.description || '';
        card.appendChild(descEl);

        const priceEl = document.createElement('p');
        priceEl.className = 'product-card__price';
        const formattedPrice = typeof formatPrice === 'function'
            ? formatPrice(product.price)
            : `${product.price.toLocaleString('ru-RU')} руб.`;
        priceEl.textContent = `Цена: ${formattedPrice}`;
        card.appendChild(priceEl);

        const statusEl = document.createElement('p');
        statusEl.className = `product-card__status ${isAvail ? 'product-card__status--available' : 'product-card__status--unavailable'}`;
        statusEl.textContent = isAvail ? 'В наличии' : 'Нет в наличии';
        card.appendChild(statusEl);

        const actionsEl = document.createElement('div');
        actionsEl.className = 'product-card__actions';

        const addBtn = document.createElement('button');
        addBtn.className = 'button';
        addBtn.type = 'button';
        addBtn.dataset.action = 'add-to-cart';
        addBtn.dataset.id = String(product.id);
        addBtn.setAttribute('aria-label', `Добавить в корзину: ${product.title || product.name}`);
        if (!isAvail) {
            addBtn.disabled = true;
            addBtn.textContent = 'Недоступно';
        } else {
            addBtn.textContent = 'В корзину';
        }
        actionsEl.appendChild(addBtn);

        const orderBtn = document.createElement('button');
        orderBtn.className = 'button button--secondary';
        orderBtn.type = 'button';
        orderBtn.dataset.modalTarget = 'order-dialog';
        orderBtn.dataset.product = product.title || product.name;
        orderBtn.setAttribute('aria-label', `Заказать: ${product.title || product.name}`);
        orderBtn.textContent = 'Заказать';
        actionsEl.appendChild(orderBtn);

        const isFav = this.getFavorites().includes(product.id);
        const favBtn = document.createElement('button');
        favBtn.className = `button--favorite${isFav ? ' is-active' : ''}`;
        favBtn.type = 'button';
        favBtn.dataset.id = String(product.id);
        favBtn.setAttribute('aria-label', 'В избранное');
        favBtn.setAttribute('aria-pressed', String(isFav));
        favBtn.textContent = '♥';
        actionsEl.appendChild(favBtn);

        card.appendChild(actionsEl);

        return card;
    },

    // Генерация HTML карточки
    createCardHtml(product) {
        return this.createProductCard(product).outerHTML;
    },

    // Отрисовка списка товаров
    renderCatalogList() {
        const container = document.getElementById('catalog-products');
        if (!container) return;

        const countEl = document.getElementById('catalog-count');
        if (countEl) {
            countEl.textContent = `Найдено товаров: ${this.filteredProducts.length}`;
        }

        if (this.filteredProducts.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'cart-empty';
            emptyDiv.style.gridColumn = '1 / -1';

            const icon = document.createElement('div');
            icon.className = 'cart-empty__icon';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = '🔍';

            const h2 = document.createElement('h2');
            h2.textContent = 'Товары не найдены';

            const p = document.createElement('p');
            p.textContent = 'По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска или сбросить фильтры.';

            const resetBtn = document.createElement('button');
            resetBtn.className = 'button';
            resetBtn.type = 'button';
            resetBtn.id = 'reset-filters-btn';
            resetBtn.textContent = 'Сбросить фильтры';
            resetBtn.onclick = () => {
                this.activeFilters = {
                    search: '',
                    category: 'all',
                    minPrice: 0,
                    maxPrice: Infinity,
                    sortBy: 'popular',
                    onlyFavorites: false
                };
                const searchInput = document.getElementById('catalog-search-input');
                if (searchInput) searchInput.value = '';
                const priceFrom = document.getElementById('price-from');
                if (priceFrom) priceFrom.value = '';
                const priceTo = document.getElementById('price-to');
                if (priceTo) priceTo.value = '';
                const allRadio = document.querySelector('input[name="category"][value="all"]');
                if (allRadio) allRadio.checked = true;
                this.currentPage = 1;
                this.applyFiltersAndRender();
            };

            emptyDiv.append(icon, h2, p, resetBtn);
            container.replaceChildren(emptyDiv);
            return;
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const pageItems = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
        const cardElements = pageItems.map(p => this.createProductCard(p));
        container.replaceChildren(...cardElements);
    },

    // Отрисовка кнопок пагинации
    renderPagination() {
        const paginationContainer = document.getElementById('catalog-pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let buttonsHtml = `
            <button class="pagination__btn" type="button" data-page="${this.currentPage - 1}" ${this.currentPage === 1 ? 'disabled' : ''} aria-label="Назад">
                ←
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            buttonsHtml += `
                <button class="pagination__btn ${i === this.currentPage ? 'pagination__btn--active' : ''}" type="button" data-page="${i}" aria-label="Страница ${i}" ${i === this.currentPage ? 'aria-current="page"' : ''}>
                    ${i}
                </button>
            `;
        }

        buttonsHtml += `
            <button class="pagination__btn" type="button" data-page="${this.currentPage + 1}" ${this.currentPage === totalPages ? 'disabled' : ''} aria-label="Вперед">
                →
            </button>
        `;

        paginationContainer.innerHTML = buttonsHtml;

        paginationContainer.querySelectorAll('.pagination__btn').forEach(btn => {
            btn.onclick = () => {
                const targetPage = Number(btn.dataset.page);
                if (targetPage >= 1 && targetPage <= totalPages && targetPage !== this.currentPage) {
                    this.currentPage = targetPage;
                    this.renderCatalogList();
                    this.renderPagination();
                    const topOfCatalog = document.querySelector('.catalog-layout');
                    if (topOfCatalog) topOfCatalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            };
        });
    }
};

window.Catalog = Catalog;
window.createProductCard = (p) => Catalog.createProductCard(p);

document.addEventListener('DOMContentLoaded', () => {
    Catalog.init();
});
