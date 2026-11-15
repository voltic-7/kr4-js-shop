const STORAGE_KEYS = {
    CART: 'football_shop_cart',
    FAVORITES: 'football_shop_favorites',
    THEME: 'football_shop_theme'
};

const INITIAL_PRODUCTS = [
  {
    "id": 1,
    "name": "Мяч Лига Чемпионов Pro",
    "category": "balls",
    "categoryName": "Мячи",
    "price": 12000,
    "oldPrice": 14500,
    "rating": 5,
    "isNew": true,
    "isPopular": true,
    "image": "images/ball.jpg",
    "imageResponsive": "ball",
    "description": "Официальный игровой мяч с термосклеенными панелями для идеальной траектории полёта и минимального влагопоглощения.",
    "specs": {
      "Размер": "5 (стандарт FIFA)",
      "Материал": "100% полиуретан",
      "Конструкция": "Бесшовная термосклейка",
      "Назначение": "Профессиональные матчи"
    },
    "inStock": 15,
    "title": "Мяч Лига Чемпионов Pro",
    "discountPercent": 17,
    "isAvailable": true
  },
  {
    "id": 2,
    "name": "Бутсы Predator Pro",
    "category": "shoes",
    "categoryName": "Обувь",
    "price": 18500,
    "oldPrice": 21000,
    "rating": 5,
    "isNew": false,
    "isPopular": true,
    "image": "images/boots.jpg",
    "imageResponsive": "boots",
    "description": "Профессиональные бутсы со специальными зонами контроля Strikeskin для филигранного контроля мяча и мощных ударов.",
    "specs": {
      "Покрытие": "Натуральный и сухой газон (FG)",
      "Материал верха": "HybridTouch 2.0",
      "Фиксация": "Классическая шнуровка",
      "Вес": "210 г"
    },
    "inStock": 8,
    "title": "Бутсы Predator Pro",
    "discountPercent": 12,
    "isAvailable": true
  },
  {
    "id": 3,
    "name": "Вратарские перчатки Grip",
    "category": "equipment",
    "categoryName": "Экипировка",
    "price": 6000,
    "oldPrice": 7200,
    "rating": 4,
    "isNew": false,
    "isPopular": true,
    "image": "images/hands.jpg",
    "imageResponsive": "hands",
    "description": "Перчатки с 4мм немецким латексом URG 2.0 для идеального сцепления с мячом в любую погоду и защитой суставов.",
    "specs": {
      "Крой": "Negative Cut (внутренние швы)",
      "Ладонь": "4 мм латекс URG 2.0",
      "Запястье": "Эластичный ремешок полной обмотки",
      "Защита пальцев": "Съемные пластины"
    },
    "inStock": 12,
    "title": "Вратарские перчатки Grip",
    "discountPercent": 17,
    "isAvailable": true
  },
  {
    "id": 4,
    "name": "Бутсы Phantom Elite GX2",
    "category": "shoes",
    "categoryName": "Обувь",
    "price": 21000,
    "oldPrice": 24000,
    "rating": 5,
    "isNew": true,
    "isPopular": true,
    "image": "images/phantom.jpg",
    "imageResponsive": "phantom",
    "description": "Сверхлегкие бутсы с революционным липким покрытием Gripknit и подошвой Cyclone 360 для быстрых рывков.",
    "specs": {
      "Покрытие": "Твердый газон (FG)",
      "Материал верха": "Nike Gripknit",
      "Подошва": "Cyclone 360",
      "Вес": "195 г"
    },
    "inStock": 6,
    "title": "Бутсы Phantom Elite GX2",
    "discountPercent": 12,
    "isAvailable": true
  },
  {
    "id": 5,
    "name": "Бутсы Puma Future Match",
    "category": "shoes",
    "categoryName": "Обувь",
    "price": 16500,
    "oldPrice": 19000,
    "rating": 4,
    "isNew": false,
    "isPopular": false,
    "image": "images/puma.jpg",
    "imageResponsive": "puma",
    "description": "Адаптивный верх FUZIONFIT360 с поддерживающей компрессией стопы для взрывного дриблинга и маневренности.",
    "specs": {
      "Покрытие": "Универсальное (FG/AG)",
      "Материал верха": "FUZIONFIT360 с сеткой",
      "Подошва": "Dynamic Motion System",
      "Вес": "220 г"
    },
    "inStock": 10,
    "title": "Бутсы Puma Future Match",
    "discountPercent": 13,
    "isAvailable": true
  },
  {
    "id": 6,
    "name": "Гетры Nike Squad Pro",
    "category": "equipment",
    "categoryName": "Экипировка",
    "price": 1800,
    "oldPrice": 2200,
    "rating": 5,
    "isNew": false,
    "isPopular": false,
    "image": "images/whiteSocks.jpg",
    "imageResponsive": "whiteSocks",
    "description": "Анатомический крой с зональной амортизацией в ключевых точках давления стопы и влагоотводящей нитью Dri-FIT.",
    "specs": {
      "Состав": "88% полиэстер, 9% хлопок, 3% спандекс",
      "Технология": "Dri-FIT влагоотвод",
      "Поддержка": "Компрессионная арка свода стопы",
      "Цвет": "Белый / Черный логотип"
    },
    "inStock": 30,
    "title": "Гетры Nike Squad Pro",
    "discountPercent": 18,
    "isAvailable": true
  },
  {
    "id": 7,
    "name": "Мяч тренировочный FIFA Basic",
    "category": "balls",
    "categoryName": "Мячи",
    "price": 4500,
    "oldPrice": 5500,
    "rating": 4,
    "isNew": false,
    "isPopular": true,
    "image": "images/ball.jpg",
    "imageResponsive": "ball",
    "description": "Прочный тренировочный мяч с сертификатом FIFA Basic. Отлично держит давление благодаря бутиловой камере.",
    "specs": {
      "Размер": "5 (стандартный)",
      "Материал": "Текстурированный TPU",
      "Швы": "Ручная сшивка + герметик",
      "Камера": "Бутиловая"
    },
    "inStock": 20,
    "title": "Мяч тренировочный FIFA Basic",
    "discountPercent": 18,
    "isAvailable": true
  },
  {
    "id": 8,
    "name": "Бутсы Predator Club FG",
    "category": "shoes",
    "categoryName": "Обувь",
    "price": 9800,
    "oldPrice": 11500,
    "rating": 4,
    "isNew": true,
    "isPopular": false,
    "image": "images/boots.jpg",
    "imageResponsive": "boots",
    "description": "Надежные и долговечные бутсы начального уровня с текстурированным синтетическим верхом для точных передач.",
    "specs": {
      "Покрытие": "Трава и искусственный газон",
      "Материал верха": "Синтетическая кожа",
      "Колодка": "Стандартная посадка",
      "Вес": "240 г"
    },
    "inStock": 0,
    "title": "Бутсы Predator Club FG",
    "discountPercent": 15,
    "isAvailable": false
  },
  {
    "id": 9,
    "name": "Вратарские перчатки Pro Contact",
    "category": "equipment",
    "categoryName": "Экипировка",
    "price": 8400,
    "oldPrice": 9900,
    "rating": 5,
    "isNew": true,
    "isPopular": false,
    "image": "images/hands.jpg",
    "imageResponsive": "hands",
    "description": "Элитная модель с максимальной площадью контакта латекса и неопреновым тыльным слоем с силиконовым тиснением.",
    "specs": {
      "Крой": "Roll Finger (круглые пальцы)",
      "Ладонь": "4 мм немецкий Contact Latex",
      "Запястье": "Удлиненная манжета без ремешка",
      "Вентиляция": "Дышащие вставки"
    },
    "inStock": 7,
    "title": "Вратарские перчатки Pro Contact",
    "discountPercent": 15,
    "isAvailable": true
  },
  {
    "id": 10,
    "name": "Бутсы Puma Ultra Ultimate",
    "category": "shoes",
    "categoryName": "Обувь",
    "price": 22500,
    "oldPrice": 25000,
    "rating": 5,
    "isNew": true,
    "isPopular": true,
    "image": "images/puma.jpg",
    "imageResponsive": "puma",
    "description": "Флагманские скоростные бутсы из ультратонкого тканого материала ULTRAWEAVE с пластиной SPEEDPLATE с двойной плотностью.",
    "specs": {
      "Покрытие": "Сухой газон (FG/AG)",
      "Материал верха": "ULTRAWEAVE",
      "Подошва": "SPEEDPLATE",
      "Вес": "160 г"
    },
    "inStock": 5,
    "title": "Бутсы Puma Ultra Ultimate",
    "discountPercent": 10,
    "isAvailable": true
  },
  {
    "id": 11,
    "name": "Гетры компрессионные Matchday",
    "category": "equipment",
    "categoryName": "Экипировка",
    "price": 2100,
    "oldPrice": 2600,
    "rating": 4,
    "isNew": false,
    "isPopular": false,
    "image": "images/whiteSocks.jpg",
    "imageResponsive": "whiteSocks",
    "description": "Гетры с градуированной компрессией для улучшения кровообращения и снижения усталости икроножных мышц.",
    "specs": {
      "Состав": "75% полиамид, 15% эластан, 10% хлопок",
      "Уровень компрессии": "15-20 мм рт. ст.",
      "Усиление": "Пятка и мысок",
      "Цвет": "Белый"
    },
    "inStock": 18,
    "title": "Гетры компрессионные Matchday",
    "discountPercent": 19,
    "isAvailable": true
  },
  {
    "id": 12,
    "name": "Мяч футзальный Sala Pro",
    "category": "balls",
    "categoryName": "Мячи",
    "price": 5200,
    "oldPrice": 6000,
    "rating": 5,
    "isNew": false,
    "isPopular": false,
    "image": "images/ball.jpg",
    "imageResponsive": "ball",
    "description": "Специализированный мяч для мини-футбола и футзала с низким отскоком и зернистой полиуретановой поверхностью.",
    "specs": {
      "Размер": "4 (футзальный стандарт)",
      "Материал": "Полиуретан с микрорельефом",
      "Отскок": "Низкий (специальный наполнитель)",
      "Вес": "410-430 г"
    },
    "inStock": 11,
    "title": "Мяч футзальный Sala Pro",
    "discountPercent": 13,
    "isAvailable": true
  }
];

// Основной массив товаров
const products = INITIAL_PRODUCTS;

// Форматирование цены
function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) return '0 руб.';
    return `${price.toLocaleString('ru-RU')} руб.`;
}

// Расчёт суммы скидки
function calculateDiscount(price, discountPercent) {
    if (!price || !discountPercent) return 0;
    return Math.round((price * discountPercent) / 100);
}

// Расчёт цены со скидкой
function calculateFinalPrice(price, discountPercent) {
    return price - calculateDiscount(price, discountPercent);
}

// Статус наличия товара
function getProductStatus(product) {
    if (!product) return 'Неизвестно';
    return product.isAvailable ? 'В наличии' : 'Нет в наличии';
}

// Краткая сводка по товару
function createProductSummary(product) {
    if (!product) return '';
    const title = product.title || product.name;
    const cat = product.categoryName || product.category;
    return `${title} (${cat}) — ${formatPrice(product.price)} [${getProductStatus(product)}]`;
}

// Список названий товаров
function getProductTitles(items = products) {
    return items.map((product) => product.title || product.name);
}

// Товары в наличии
function getAvailableProducts(items = products) {
    return items.filter((product) => product.isAvailable);
}

// Поиск товаров по названию и описанию
function searchProducts(items = products, query = '') {
    if (!query || typeof query !== 'string') return items;
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return items;
    return items.filter((product) => {
        const title = (product.title || product.name || '').toLowerCase();
        const desc = (product.description || '').toLowerCase();
        return title.includes(cleanQuery) || desc.includes(cleanQuery);
    });
}

// Фильтрация товаров по категории
function filterProductsByCategory(items = products, category = 'all') {
    if (!category || category === 'all') return items;
    return items.filter((product) => product.category === category);
}

// Сортировка товаров по цене
function sortProductsByPrice(items = products, direction = 'asc') {
    const copy = [...items];
    return copy.sort((a, b) => {
        return direction === 'asc' ? a.price - b.price : b.price - a.price;
    });
}

// Сортировка товаров по названию
function sortProductsByName(items = products, direction = 'asc') {
    const copy = [...items];
    return copy.sort((a, b) => {
        const nameA = a.title || a.name || '';
        const nameB = b.title || b.name || '';
        return direction === 'asc'
            ? nameA.localeCompare(nameB, 'ru')
            : nameB.localeCompare(nameA, 'ru');
    });
}

// Поиск товара по id
function findProductById(items = products, id) {
    const numericId = Number(id);
    return items.find((product) => product.id === numericId);
}

// Расчёт общей стоимости
function calculateTotalPrice(items = products) {
    return items.reduce((total, product) => {
        const qty = product.quantity || 1;
        return total + (product.price * qty);
    }, 0);
}

// Подсчёт товаров в наличии
function countAvailableProducts(items = products) {
    return items.filter((product) => product.isAvailable).length;
}

// Расчёт средней цены
function calculateAveragePrice(items = products) {
    if (!items.length) return 0;
    return Math.round(calculateTotalPrice(items) / items.length);
}

// Фильтрация и сортировка товаров
function prepareProducts(items = products, options = {}) {
    const {
        search = '',
        category = 'all',
        sort = 'default',
        minPrice = 0,
        maxPrice = Infinity
    } = options;

    let result = [...items];

    if (search) {
        result = searchProducts(result, search);
    }

    if (category && category !== 'all') {
        result = filterProductsByCategory(result, category);
    }

    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (sort === 'price-asc') {
        result = sortProductsByPrice(result, 'asc');
    } else if (sort === 'price-desc') {
        result = sortProductsByPrice(result, 'desc');
    } else if (sort === 'name-asc') {
        result = sortProductsByName(result, 'asc');
    }

    return result;
}

// Загрузка товаров из JSON
async function loadProductsData() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) return INITIAL_PRODUCTS;
        const data = await response.json();
        return Array.isArray(data) && data.length > 0 ? data : INITIAL_PRODUCTS;
    } catch {
        // Резервный массив при открытии локально
        return INITIAL_PRODUCTS;
    }
}

// Экспорт в глобальную область видимости
window.STORAGE_KEYS = STORAGE_KEYS;
window.INITIAL_PRODUCTS = INITIAL_PRODUCTS;
window.products = products;
window.loadProductsData = loadProductsData;

window.formatPrice = formatPrice;
window.calculateDiscount = calculateDiscount;
window.calculateFinalPrice = calculateFinalPrice;
window.getProductStatus = getProductStatus;
window.createProductSummary = createProductSummary;

window.getProductTitles = getProductTitles;
window.getAvailableProducts = getAvailableProducts;
window.searchProducts = searchProducts;
window.filterProductsByCategory = filterProductsByCategory;
window.sortProductsByPrice = sortProductsByPrice;
window.sortProductsByName = sortProductsByName;
window.findProductById = findProductById;
window.calculateTotalPrice = calculateTotalPrice;
window.countAvailableProducts = countAvailableProducts;
window.calculateAveragePrice = calculateAveragePrice;
window.prepareProducts = prepareProducts;

window.ShopData = {
    formatPrice,
    calculateDiscount,
    calculateFinalPrice,
    getProductStatus,
    createProductSummary,
    getProductTitles,
    getAvailableProducts,
    searchProducts,
    filterProductsByCategory,
    sortProductsByPrice,
    sortProductsByName,
    findProductById,
    calculateTotalPrice,
    countAvailableProducts,
    calculateAveragePrice,
    prepareProducts
};
