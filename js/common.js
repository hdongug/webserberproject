/**
 * 게임 아이템 거래소 공통 JavaScript
 */

// 사이드 메뉴 토글 함수
function toggleMenu() {
    const sideMenu = document.querySelector('.side-menu');
    sideMenu.classList.toggle('open');
}

// 사이드 메뉴 닫기
function closeMenu() {
    const sideMenu = document.querySelector('.side-menu');
    sideMenu.classList.remove('open');
}

// 페이지 로드 시 현재 페이지에 해당하는 메뉴 아이템 활성화
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.endsWith(href)) {
            item.classList.add('active');
        }
        
        // 메뉴 아이템 클릭 이벤트 추가
        item.addEventListener('click', function(e) {
            // 클릭 후 사이드 메뉴 닫기
            closeMenu();
        });
    });

    // 로그인 상태 확인 및 UI 업데이트
    checkLoginStatus();
    
    // 추천 아이템 갱신 타이머 (30분마다)
    if (document.querySelector('.recommended-items')) {
        updateRecommendedItems();
        setInterval(updateRecommendedItems, 30 * 60 * 1000); // 30분마다 갱신
    }
});

// 로그인 상태 확인 및 UI 업데이트
function checkLoginStatus() {
    // 슬토리지에서 현재 유저 정보 가져오기
    const currentUser = localStorage.getItem('currentUser');
    const isLoggedIn = currentUser !== null;
    
    // 사이드 메뉴 업데이트
    updateSideMenuByLoginStatus(isLoggedIn);
    
    // 로그인 섹션 업데이트
    const loginSection = document.querySelector('.login-section');
    if (!loginSection) return;
    
    if (isLoggedIn) {
        const userData = JSON.parse(currentUser);
        const userNickname = userData.nickname || userData.username;
        
        loginSection.innerHTML = `
            <div class="logged-user">
                <p>안녕하세요, <strong>${userNickname}</strong>님!</p>
                <div class="user-menu">
                    <a href="profile.html" class="btn">프로필</a>
                    <button onclick="logout()" class="btn btn-secondary">로그아웃</button>
                </div>
            </div>
        `;
    } else {
        loginSection.innerHTML = `
            <div class="login-box">
                <h3>로그인</h3>
                <div class="login-buttons">
                    <a href="login.html" class="btn">로그인</a>
                    <a href="register.html" class="btn btn-secondary">회원가입</a>
                </div>
            </div>
        `;
    }
    
    return isLoggedIn;
}

// 로그인 상태에 따라 사이드 메뉴 업데이트
function updateSideMenuByLoginStatus(isLoggedIn) {
    const sideMenu = document.querySelector('.side-menu');
    if (!sideMenu) return;
    
    // 프로필 메뉴 아이템 찾기
    const profileMenuItem = sideMenu.querySelector('a[href="profile.html"]');
    
    if (profileMenuItem) {
        if (isLoggedIn) {
            // 로그인 상태이면 프로필 메뉴 표시
            profileMenuItem.style.display = 'block';
        } else {
            // 로그인하지 않은 상태이면 프로필 메뉴 숨김
            profileMenuItem.style.display = 'none';
        }
    }
}

// 로그아웃 함수
function logout() {
    // 기존 로그인 상태 정보 삭제
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userNickname');
    
    // 현재 사용자 정보 삭제
    localStorage.removeItem('currentUser');
    
    alert('로그아웃 되었습니다.');
    window.location.href = 'index.html';
}

// 추천 아이템 갱신 함수
function updateRecommendedItems() {
    const recommendedItemsContainer = document.querySelector('.recommended-items-list');
    if (!recommendedItemsContainer) return;
    
    // 실제로는 서버에서 데이터를 가져와야 하지만, 템플릿으로 대체
    const timestamp = new Date().toLocaleTimeString();
    // 랜덤 아이템 추가
    const allItems = [
        { id: 1, name: '강화된 마법 검', price: '25,000', image: 'https://via.placeholder.com/100x100?text=Item1' },
        { id: 2, name: '전설 방패', price: '120,000', image: 'https://via.placeholder.com/100x100?text=Item2' },
        { id: 3, name: '영웅의 반지', price: '45,000', image: 'https://via.placeholder.com/100x100?text=Item3' },
        { id: 4, name: '스피드 부츠', price: '38,000', image: 'https://via.placeholder.com/100x100?text=Item4' },
        { id: 5, name: '드래곤 갑옷', price: '85,000', image: 'https://via.placeholder.com/100x100?text=Item5' },
        { id: 6, name: '불궁포', price: '65,000', image: 'https://via.placeholder.com/100x100?text=Item6' },
        { id: 7, name: '중력 하는 마법서', price: '50,000', image: 'https://via.placeholder.com/100x100?text=Item7' },
        { id: 8, name: '무한의 화살', price: '15,000', image: 'https://via.placeholder.com/100x100?text=Item8' },
    ];
    
    // 랜덤하게 4개만 선택
    const items = [];
    const usedIndices = new Set();
    
    while (items.length < 4 && usedIndices.size < allItems.length) {
        const randomIndex = Math.floor(Math.random() * allItems.length);
        
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            items.push(allItems[randomIndex]);
        }
    }
    
    // 현재 시간을 표시하여 갱신 시간을 보여줌
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    document.querySelector('.refresh-time').textContent = `${timeString} 갱신됨`;
    
    // 추천 아이템 목록 업데이트
    let html = '';
    dummyItems.forEach(item => {
        html += `
            <div class="item">
                <div class="item-image">
                    <img src="${item.image || 'img/default-item.png'}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">${item.price.toLocaleString()}원</p>
                </div>
            </div>
        `;
    });
    
    recommendedItemsContainer.innerHTML = html;
}
