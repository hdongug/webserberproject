/* 햄버거 메뉴 및 사이드바 JavaScript */
document.addEventListener('DOMContentLoaded', function() {
    // 메뉴 토글 버튼 가져오기 - ID를 두 가지 가능성 모두 확인(기존 menuToggle 및 menuToggleBtn)
    const menuToggle = document.getElementById('menuToggle') || document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('overlay');

    console.log('Menu toggle button:', menuToggle);
    console.log('Sidebar element:', sidebar);

    // 메뉴 토글 버튼 클릭
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

    // 사이드바 닫기 버튼 클릭
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    // 오버레이 클릭
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // ESC 키로 사이드바 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 폼 검증
    const loginForm = document.getElementById('loginForm');
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

    // 알림 메시지 표시
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

    // 로딩 상태 관리
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
});

