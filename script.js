document.addEventListener('DOMContentLoaded', () => {
    const currentPagePath = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll('.menu a');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const bannerImage = document.querySelector('.banner-image img');
        const bannerText = document.querySelector('.banner-text');
    
        bannerImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        bannerText.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    });
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPagePath) {
            item.classList.add('active');
        }
    });

    let itemsPerPage = localStorage.getItem('itemsPerPage') ? parseInt(localStorage.getItem('itemsPerPage'), 10) : 10;
    let sortBy = localStorage.getItem('sortBy') || 'newest';
    let currentPageNumber = localStorage.getItem('currentPageNumber') ? parseInt(localStorage.getItem('currentPageNumber'), 10) : 1;

    document.getElementById('itemsPerPage').value = itemsPerPage;
    document.getElementById('sortBy').value = sortBy;

    const oddImagePath = 'media/odd-item.jpg';
    const evenImagePath = 'media/even-item.jpg';

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.data) && data.data.length > 0) {
                let items = data.data;

                function updateCards(data, page, perPage) {
                    const cardsContainer = document.getElementById('cards-container');
                    cardsContainer.innerHTML = '';
                
                    const start = (page - 1) * perPage;
                    const end = start + perPage;
                    const itemsToShow = data.slice(start, end);
                
                    itemsToShow.forEach((item, index) => {
                        if (item.title && item.published_at) {
                            const options = { day: 'numeric', month: 'long', year: 'numeric' };
                            const formattedDate = new Date(item.published_at).toLocaleDateString('id-ID', options);
                            
                            const imagePath = (index % 2 === 0) ? evenImagePath : oddImagePath;
                            
                            const card = document.createElement('div');
                            card.classList.add('card');
                            card.innerHTML = `
                                <img src="${imagePath}" alt="Item Image" class="card-image" loading="lazy">
                                <p>${formattedDate}</p>
                                <h2>${item.title}</h2>
                            `;
                            cardsContainer.appendChild(card);
                        }
                    });
                
                    updatePagination(data.length, page, perPage);
                    updateShowingText(page, perPage, data.length);
                }

                function updatePagination(totalItems, page, perPage) {
                    const pagination = document.getElementById('pagination');
                    pagination.innerHTML = '';
                    const totalPages = Math.ceil(totalItems / perPage);
                
                    const createButton = (innerHTML, className, disabled, eventListener) => {
                        const button = document.createElement('button');
                        button.innerHTML = innerHTML;
                        button.className = className;
                        button.disabled = disabled;
                        button.addEventListener('click', eventListener);
                        return button;
                    };
                
                    pagination.appendChild(createButton('&laquo;&laquo;', page === 1 ? 'disabled' : '', page === 1, () => {
                        if (page > 1) {
                            updateCards(items, 1, perPage);
                            localStorage.setItem('currentPageNumber', 1);
                        }
                    }));
                
                    pagination.appendChild(createButton('&laquo;', page === 1 ? 'disabled' : '', page === 1, () => {
                        if (page > 1) {
                            updateCards(items, page - 1, perPage);
                            localStorage.setItem('currentPageNumber', page - 1);
                        }
                    }));
                
                    for (let i = 1; i <= totalPages; i++) {
                        pagination.appendChild(createButton(i, i === page ? 'active' : '', false, () => {
                            updateCards(items, i, perPage);
                            localStorage.setItem('currentPageNumber', i);
                        }));
                    }
                
                    pagination.appendChild(createButton('&raquo;', page === totalPages ? 'disabled' : '', page === totalPages, () => {
                        if (page < totalPages) {
                            updateCards(items, page + 1, perPage);
                            localStorage.setItem('currentPageNumber', page + 1);
                        }
                    }));
                
                    pagination.appendChild(createButton('&raquo;&raquo;', page === totalPages ? 'disabled' : '', page === totalPages, () => {
                        if (page < totalPages) {
                            updateCards(items, totalPages, perPage);
                            localStorage.setItem('currentPageNumber', totalPages);
                        }
                    }));
                }

                function applySorting(items, sortBy) {
                    if (sortBy === 'newest') {
                        items.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
                    } else if (sortBy === 'oldest') {
                        items.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
                    } else if (sortBy === 'title') {
                        items.sort((a, b) => a.title.localeCompare(b.title));
                    }
                }

                function updateShowingText(page, perPage, totalItems) {
                    const startItem = (page - 1) * perPage + 1;
                    const endItem = Math.min(startItem + perPage - 1, totalItems);
                    const showingText = document.querySelector('.filter-bar > div:first-child');
                    showingText.textContent = `Showing ${startItem} - ${endItem} of ${totalItems}`;
                }

                applySorting(items, sortBy);
                updateCards(items, currentPageNumber, itemsPerPage);

                document.getElementById('sortBy').addEventListener('change', function () {
                    sortBy = this.value;
                    localStorage.setItem('sortBy', sortBy);
                    applySorting(items, sortBy);
                    updateCards(items, 1, itemsPerPage);
                });

                document.getElementById('itemsPerPage').addEventListener('change', function () {
                    itemsPerPage = parseInt(this.value, 10);
                    localStorage.setItem('itemsPerPage', itemsPerPage);
                    currentPageNumber = 1;
                    localStorage.setItem('currentPageNumber', currentPageNumber);
                    updateCards(items, currentPageNumber, itemsPerPage);
                });

            } else {
                console.error('Data.data is not an array or is empty.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            header.classList.add('hidden');
            header.classList.remove('visible');
        } else {
            header.classList.add('visible');
            header.classList.remove('hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});
