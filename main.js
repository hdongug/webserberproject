/**
 * 게임 아이템 거래소 - 정적 페이지 JavaScript
 * 톰캣 서버용 정적 HTML 페이지의 필터링, 검색 및 UI 기능
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * 1. 햄버거 메뉴 및 사이드바 기능
     */
    const menuToggle = document.getElementById('menuToggle') || document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('overlay');

    // 사이드바 닫기 함수
    function closeSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // 메뉴 토글 클릭 이벤트
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            console.log('Menu button clicked');
            sidebar.classList.toggle('active');
            if (overlay) {
                overlay.classList.toggle('active');
            }
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }

    // 사이드바 닫기 버튼 클릭 이벤트
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    // 오버레이 클릭 이벤트
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // ESC 키로 사이드바 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    /**
     * 2. 폼 검증 및 알림 기능
     */
    const loginForm = document.getElementById('loginForm');
    
    // 알림 메시지 표시 함수
    function showAlert(message, type) {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        const form = document.querySelector('.login-card form');
        if (form) {
            form.insertBefore(alert, form.firstChild);
            
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }
    
    // 로그인 폼 검증
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = document.getElementById('username');
            const password = document.getElementById('password');
            
            if (!username.value.trim()) {
                e.preventDefault();
                showAlert('아이디를 입력해주세요.', 'error');
                username.focus();
                return;
            }
            
            if (!password.value.trim()) {
                e.preventDefault();
                showAlert('비밀번호를 입력해주세요.', 'error');
                password.focus();
                return;
            }
        });
    }

    /**
     * 3. 입력 필드 애니메이션 및 버튼 로딩 상태
     */
    // 입력 필드 애니메이션
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // 버튼 로딩 상태 관리
    const submitButtons = document.querySelectorAll('.btn-primary');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리중...';
                
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = this.dataset.originalText || '로그인';
                }, 3000);
            }
        });
    });

    /**
     * 4. 아이템 필터링 및 검색 기능
     */
    // 필터 및 검색 요소 가져오기
    const searchInput = document.getElementById('searchInput');
    const filterChips = document.querySelectorAll('.filter-chip');
    const itemCards = document.querySelectorAll('.item-card');
    
    let activeFilters = {
        rarity: [],
        category: []
    };
    
    // 필터 칩 클릭 이벤트
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filterType = this.dataset.type; // 'rarity' 또는 'category'
            const filterValue = this.dataset.value;
            
            // 필터 활성화 토글
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                // 필터 추가
                if (!activeFilters[filterType].includes(filterValue)) {
                    activeFilters[filterType].push(filterValue);
                }
            } else {
                // 필터 제거
                const index = activeFilters[filterType].indexOf(filterValue);
                if (index > -1) {
                    activeFilters[filterType].splice(index, 1);
                }
            }
            
            // 필터 적용
            applyFilters();
        });
    });
    
    // 검색 이벤트
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
    
    // 필터와 검색을 적용하는 함수
    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        itemCards.forEach(card => {
            let showByRarity = true;
            let showByCategory = true;
            let showBySearch = true;
            
            // 희귀도 필터 적용
            if (activeFilters.rarity.length > 0) {
                const itemRarity = card.querySelector('.item-rarity').textContent.toLowerCase();
                showByRarity = activeFilters.rarity.some(rarity => {
                    if (rarity === 'common') return itemRarity === '일반';
                    if (rarity === 'rare') return itemRarity === '레어';
                    if (rarity === 'epic') return itemRarity === '에픽';
                    if (rarity === 'legendary') return itemRarity === '전설';
                    if (rarity === 'mythic') return itemRarity === '신화';
                    return false;
                });
            }
            
            // 카테고리 필터 적용 (이미지 경로 기반으로 구분)
            if (activeFilters.category.length > 0) {
                const imgSrc = card.querySelector('.item-image img').getAttribute('src').toLowerCase();
                showByCategory = activeFilters.category.some(category => {
                    if (category === 'weapon') return imgSrc.includes('weapon');
                    if (category === 'armor') return imgSrc.includes('armor');
                    if (category === 'accessory') return imgSrc.includes('accessory');
                    if (category === 'potion') return !imgSrc.includes('weapon') && 
                                                     !imgSrc.includes('armor') && 
                                                     !imgSrc.includes('accessory');
                    return false;
                });
            }
            
            // 검색어 적용
            if (searchTerm) {
                const title = card.querySelector('.item-title').textContent.toLowerCase();
                const description = card.querySelector('.item-description').textContent.toLowerCase();
                const effects = card.querySelector('.item-effects') ? 
                    card.querySelector('.item-effects').textContent.toLowerCase() : '';
                    
                showBySearch = title.includes(searchTerm) || 
                              description.includes(searchTerm) || 
                              effects.includes(searchTerm);
            }
            
            // 모든 필터 조건을 만족하는 경우에만 표시
            if (showByRarity && showByCategory && showBySearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        
        // 필터링 결과에 따라 '결과 없음' 메시지 표시 여부 결정
        const visibleItems = document.querySelectorAll('.item-card[style="display: flex;"]');
        const noResultsMsg = document.querySelector('.no-results') || createNoResultsMessage();
        
        if (visibleItems.length === 0) {
            const itemsGrid = document.querySelector('.items-grid');
            if (itemsGrid && !document.querySelector('.no-results')) {
                itemsGrid.appendChild(noResultsMsg);
            }
        } else if (document.querySelector('.no-results')) {
            document.querySelector('.no-results').remove();
        }
    }
    
    // '결과 없음' 메시지 생성
    function createNoResultsMessage() {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = '해당 조건에 맞는 아이템이 없습니다.';
        noResults.style.width = '100%';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '2rem';
        noResults.style.fontSize = '1.2rem';
        noResults.style.color = '#666';
        return noResults;
    }
});
