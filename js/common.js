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
    // 로그인/회원가입 메뉴 아이템 찾기
    const loginMenuItem = sideMenu.querySelector('a[href="login.html"]');
    const registerMenuItem = sideMenu.querySelector('a[href="register.html"]');
    
    // 로그아웃 메뉴 아이템 생성 또는 가져오기
    let logoutMenuItem = sideMenu.querySelector('.logout-menu-item');
    if (!logoutMenuItem && isLoggedIn) {
        // 로그아웃 메뉴가 없으면 생성
        logoutMenuItem = document.createElement('a');
        logoutMenuItem.href = '#';
        logoutMenuItem.className = 'menu-item logout-menu-item';
        logoutMenuItem.textContent = '로그아웃';
        logoutMenuItem.onclick = function(e) {
            e.preventDefault();
            logout();
        };
        
        // 사이드 메뉴에 추가 (회원가입 아이템 앞에)
        if (registerMenuItem && registerMenuItem.parentNode) {
            sideMenu.insertBefore(logoutMenuItem, registerMenuItem);
        } else {
            sideMenu.appendChild(logoutMenuItem);
        }
    }
    
    // 로그인 상태에 따라 메뉴 표시/숨김 설정
    if (isLoggedIn) {
        // 로그인 상태
        if (profileMenuItem) profileMenuItem.style.display = 'block';
        if (loginMenuItem) loginMenuItem.style.display = 'none';
        if (registerMenuItem) registerMenuItem.style.display = 'none';
        if (logoutMenuItem) logoutMenuItem.style.display = 'block';
    } else {
        // 비로그인 상태
        if (profileMenuItem) profileMenuItem.style.display = 'none';
        if (loginMenuItem) loginMenuItem.style.display = 'block';
        if (registerMenuItem) registerMenuItem.style.display = 'block';
        if (logoutMenuItem) logoutMenuItem.style.display = 'none';
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


