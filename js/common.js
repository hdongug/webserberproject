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


