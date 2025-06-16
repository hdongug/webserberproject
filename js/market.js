/**
 * 거래소 필터링 및 검색 기능
 */

document.addEventListener('DOMContentLoaded', function() {
    // 카테고리 필터링 설정
    setupRarityFilters();
    setupCategoryFilters();
    setupSearch();
    setupItemButtons();
    
    // 사이드메뉴 토글 함수
    window.toggleMenu = function() {
        document.querySelector('.side-menu').classList.toggle('active');
    };
    
    window.closeMenu = function() {
        document.querySelector('.side-menu').classList.remove('active');
    };
});

/**
 * 아이템 등급 필터링 설정
 */
function setupRarityFilters() {
    const rarityChips = document.querySelectorAll('.filter-group:nth-child(1) .filter-chip');
    const itemCards = document.querySelectorAll('.item-card');
    
    rarityChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // 활성 필터 업데이트
            rarityChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const selectedRarity = this.textContent.trim();
            
            // 모든 아이템 카드 표시 여부 결정
            itemCards.forEach(card => {
                const rarityElement = card.querySelector('.item-rarity');
                if (!rarityElement) return;
                
                const itemRarity = rarityElement.textContent.trim();
                
                if (selectedRarity === '전체 등급' || itemRarity === selectedRarity) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // 카테고리 필터와 함께 적용
            applyCombinedFilters();
        });
    });
}

/**
 * 아이템 카테고리 필터링 설정
 */
function setupCategoryFilters() {
    const categoryChips = document.querySelectorAll('.filter-group:nth-child(2) .filter-chip');
    
    categoryChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // 활성 필터 업데이트
            categoryChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // 카테고리 필터와 함께 적용
            applyCombinedFilters();
        });
    });
}

/**
 * 검색 기능 설정
 */
function setupSearch() {
    const searchButton = document.querySelector('.search-box .btn');
    const searchInput = document.querySelector('.search-box input');
    
    // 검색 버튼 클릭 시
    searchButton.addEventListener('click', function() {
        applySearch(searchInput.value.trim().toLowerCase());
    });
    
    // Enter 키 입력 시
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applySearch(searchInput.value.trim().toLowerCase());
        }
    });
}

/**
 * 검색어 적용하기
 */
function applySearch(searchText) {
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        const title = card.querySelector('.item-title').textContent.trim().toLowerCase();
        const description = card.querySelector('.item-description')?.textContent.trim().toLowerCase() || '';
        
        // 검색어가 비어있거나, 제목 또는 설명에 검색어가 포함되어 있으면 표시
        if (searchText === '' || title.includes(searchText) || description.includes(searchText)) {
            card.dataset.matchesSearch = 'true';
        } else {
            card.dataset.matchesSearch = 'false';
        }
    });
    
    // 카테고리 및 등급 필터와 함께 적용
    applyCombinedFilters();
}

/**
 * 카테고리, 등급, 검색 필터 모두 적용
 */
function applyCombinedFilters() {
    const itemCards = document.querySelectorAll('.item-card');
    const selectedRarity = document.querySelector('.filter-group:nth-child(1) .filter-chip.active').textContent.trim();
    const selectedCategory = document.querySelector('.filter-group:nth-child(2) .filter-chip.active').textContent.trim();
    
    itemCards.forEach(card => {
        const rarityElement = card.querySelector('.item-rarity');
        if (!rarityElement) return;
        
        const itemRarity = rarityElement.textContent.trim();
        const itemSrc = card.querySelector('img').src.toLowerCase();
        const matchesSearch = card.dataset.matchesSearch !== 'false'; // 검색 필터가 적용되지 않았거나 검색어와 일치
        
        let matchesCategory = true;
        
        // 카테고리 필터 적용
        if (selectedCategory !== '전체 카테고리') {
            if (selectedCategory === '무기' && !itemSrc.includes('/weapon/')) {
                matchesCategory = false;
            } else if (selectedCategory === '방어구' && !itemSrc.includes('/armor/')) {
                matchesCategory = false;
            } else if (selectedCategory === '소모품' && !itemSrc.includes('213329962')) { // 체력회복 물약 이미지 파일명
                matchesCategory = false;
            } else if ((selectedCategory === '액세서리' || selectedCategory === '재료') && 
                      (!itemSrc.includes('/accessory/') && !itemSrc.includes('/material/'))) {
                matchesCategory = false;
            }
        }
        
        // 등급 필터 적용
        const matchesRarity = (selectedRarity === '전체 등급' || itemRarity === selectedRarity);
        
        // 모든 필터 조건을 충족하면 아이템 표시, 그렇지 않으면 숨김
        if (matchesRarity && matchesCategory && matchesSearch) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// 로그인 상태 확인
function checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        document.getElementById('login-status').textContent = userData.username;
        return true;
    } else {
        return false;
    }
}

// 아이템 세부 정보 보기
function viewItemDetails(itemName) {
    alert(`${itemName}의 상세 정보를 확인합니다.`);
}

/**
 * 아이템 버튼 설정
 */
function setupItemButtons() {
    // 구매하기 버튼 추가
    const buyButtons = document.querySelectorAll('.btn-buy');
    const detailButtons = document.querySelectorAll('.btn-details');
    
    // 구매하기 버튼 이벤트 추가
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemCard = this.closest('.item-card');
            const itemName = itemCard.querySelector('.item-title').textContent;
            const itemPrice = itemCard.querySelector('.item-price').textContent;
            buyItem(itemName, itemPrice);
        });
    });
    
    // 상세 정보 버튼 이벤트 추가
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemCard = this.closest('.item-card');
            const itemName = itemCard.querySelector('.item-title').textContent;
            viewItemDetails(itemName);
        });
    });
}

// 아이템 구매하기
function buyItem(itemName, price) {
    if (!checkLoginStatus()) {
        alert('로그인이 필요한 서비스입니다.');
        window.location.href = 'login.html';
        return;
    }
    
    if (confirm(`${itemName}을(를) ${price}에 구매하시겠습니까?`)) {
        alert(`${itemName} 구매가 완료되었습니다!`);
    }
}
