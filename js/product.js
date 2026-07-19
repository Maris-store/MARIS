function renderProduct() {
    const root = document.querySelector('#productRoot');

    if (!root) return;

    const id = new URLSearchParams(location.search).get('id') || 'aero-noir';
    const p = productById(id);

    document.title = `${p.name} — MARIS`;

    const gallery = [
        p.image,
    ];

    root.innerHTML = `
        <div class="product-detail">

            <div>

                <div class="gallery-main">
                    <img
                        id="mainImage"
                        src="${p.image}"
                        alt="${p.name} large product view">
                </div>

                <div class="thumbs">
                    ${gallery.map((g, i) => `
                        <button
                            class="thumb ${i === 0 ? 'active' : ''}"
                            data-img="${g}">

                            <img
                                src="${g}"
                                alt="${p.name} angle ${i + 1}">

                        </button>
                    `).join('')}
                </div>

            </div>

            <aside class="product-summary">

                <span class="pill">
                    ${p.category}
                </span>

                <h1>${p.name}</h1>

                <p class="muted">
                    ${p.desc}
                </p>

                <p class="price">
                    ${money(p.price)}
                </p>

                <p class="muted">
                    Availability: In stock · Ships across Pakistan
                </p>

                <div class="selector">

                    <h4>Color</h4>

                    <div class="option-row">

                        <button
                            class="choice active"
                            data-color="${p.color}">
                            ${p.color}
                        </button>

                        <button
                            class="choice"
                            data-color="Black">
                            Black
                        </button>

                        <button
                            class="choice"
                            data-color="Navy">
                            Navy
                        </button>

                    </div>

                </div>

                <div class="selector">

                    <h4>Size</h4>

                    <div class="option-row">
                        ${p.sizes.map((s, i) => `
                            <button
                                class="choice ${i === 1 ? 'active' : ''}"
                                data-size="${s}">
                                ${s}
                            </button>
                        `).join('')}
                    </div>

                </div>

                <div class="selector">

                    <h4>Quantity</h4>

                    <div class="qty">

                        <button data-qty="-1">
                            −
                        </button>

                        <input
                            id="qty"
                            value="1"
                            readonly>

                        <button data-qty="1">
                            +
                        </button>

                    </div>

                </div>

                <div class="hero-actions">

                    <button
                        class="btn primary"
                        id="addProduct">
                        <span>Add to Cart</span>
                    </button>

                    <a
                        class="btn"
                        id="waProduct"
                        target="_blank"
                        rel="noopener">
                        <span>Buy via WhatsApp</span>
                    </a>

                </div>

                <div class="accordion">

                    <details open>

                        <summary>Features</summary>

                        <ul>
                            <li>Premium sculpted silhouette</li>
                            <li>Cushioned daily comfort</li>
                            <li>Minimal MARIS signature details</li>
                        </ul>

                    </details>

                    <details>

                        <summary>Materials</summary>

                        <p>
                            Leather-touch upper, textile lining,
                            structured rubber outsole,
                            warm beige finishing.
                        </p>

                    </details>

                    <details>

                        <summary>Shipping Information</summary>

                        <p>
                            Nationwide Pakistan delivery.
                            WhatsApp confirmation before dispatch.
                        </p>

                    </details>

                    <details>

                        <summary>Return Policy</summary>

                        <p>
                            Size exchanges accepted on unused products
                            with original packaging.
                        </p>

                    </details>

                </div>

            </aside>

        </div>
    `;

    const updateWA = () => {

        const size =
            document.querySelector('[data-size].active')?.dataset.size ||
            p.sizes[0];

        const color =
            document.querySelector('[data-color].active')?.dataset.color ||
            p.color;

        const qty =
            Number(document.querySelector('#qty').value);

        document.querySelector('#waProduct').href =
            productWhatsApp(p, { size, color, qty });

        document.querySelector('#stickyWA').href =
            productWhatsApp(p, { size, color, qty });

    };

    root.addEventListener('click', e => {

        const th = e.target.closest('.thumb');
        const choice = e.target.closest('.choice');
        const q = e.target.closest('[data-qty]');

        if (th) {

            document.querySelector('#mainImage').src = th.dataset.img;

            document
                .querySelectorAll('.thumb')
                .forEach(x => x.classList.remove('active'));

            th.classList.add('active');
        }

        if (choice) {

            choice.parentElement
                .querySelectorAll('.choice')
                .forEach(x => x.classList.remove('active'));

            choice.classList.add('active');

            updateWA();
        }

        if (q) {

            const input = document.querySelector('#qty');

            input.value = Math.max(
                1,
                Number(input.value) + Number(q.dataset.qty)
            );

            updateWA();
        }

    });

    document.querySelector('#addProduct').onclick = () => {

        const size =
            document.querySelector('[data-size].active')?.dataset.size;

        const color =
            document.querySelector('[data-color].active')?.dataset.color;

        cartAdd(
            p.id,
            Number(document.querySelector('#qty').value),
            size,
            color
        );

    };

    document.querySelector('#stickyName').textContent = p.name;

    document.querySelector('#stickyAdd').onclick = () =>
        document.querySelector('#addProduct').click();

    updateWA();

    document.querySelector('#relatedGrid').innerHTML =
        MARIS_PRODUCTS
            .filter(x => x.id !== p.id)
            .slice(0, 4)
            .map(cardHTML)
            .join('');

    markWishButtons();
    revealInit();
}

document.addEventListener('DOMContentLoaded', () => {

    renderProduct();

    addEventListener(
        'scroll',
        () =>
            document
                .querySelector('.sticky-buy')
                ?.classList.toggle('show', scrollY > 700),
        {
            passive: true
        }
    );

});