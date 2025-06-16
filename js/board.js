/**
 * 게시판 관련 JavaScript 기능
 */

// 게시글 ID 생성을 위한 카운터
let postIdCounter = 1;

// 게시글 목록 초기화
function initializeBoardPosts() {
    // localStorage에서 게시글 불러오기
    const posts = getPosts();
    
    // 게시글이 없으면 샘플 데이터 생성
    if (posts.length === 0) {
        const samplePosts = [
            {
                id: postIdCounter++,
                title: '게임 아이템 거래소 이용 규칙 안내',
                content: '안녕하세요, 게임 아이템 거래소입니다. 이용 규칙을 안내해 드립니다.\n\n1. 불법 아이템 거래 금지\n2. 욕설 및 비방 금지\n3. 허위 매물 등록 금지\n\n위 규칙을 어길 시 계정이 정지될 수 있습니다.',
                author: '운영자',
                category: 'notice',
                views: 1245,
                date: '2025-06-10',
                isNotice: true
            },
            {
                id: postIdCounter++,
                title: '6월 업데이트 안내 및 점검 일정',
                content: '6월 정기 점검 및 업데이트 일정을 안내드립니다.\n\n일시: 2025년 6월 15일 14:00~18:00\n내용: 새로운 아이템 추가 및 시스템 안정화',
                author: '운영자',
                category: 'notice',
                views: 982,
                date: '2025-06-08',
                isNotice: true
            }
        ];
        
        // 샘플 게시글 저장
        localStorage.setItem('boardPosts', JSON.stringify(samplePosts));
        localStorage.setItem('postIdCounter', postIdCounter.toString());
    } else {
        // 기존 ID 카운터 불러오기
        const savedCounter = localStorage.getItem('postIdCounter');
        if (savedCounter) {
            postIdCounter = parseInt(savedCounter);
        }
    }
    
    // 게시글 목록 표시
    displayPosts();
}

// 게시글 목록 가져오기
function getPosts() {
    const postsJson = localStorage.getItem('boardPosts');
    return postsJson ? JSON.parse(postsJson) : [];
}

// 게시글 목록 표시
function displayPosts(category = 'all') {
    const posts = getPosts();
    const tableBody = document.querySelector('.board-table tbody');
    
    // 테이블 내용 초기화
    tableBody.innerHTML = '';
    
    // 공지사항 먼저 표시
    const noticePosts = posts.filter(post => post.isNotice);
    
    // 카테고리에 맞는 일반 게시글 필터링
    let regularPosts = [];
    if (category === 'all') {
        regularPosts = posts.filter(post => !post.isNotice);
    } else {
        regularPosts = posts.filter(post => !post.isNotice && post.category === category);
    }
    
    // 공지사항 표시
    noticePosts.forEach(post => {
        const row = createPostRow(post, true);
        tableBody.appendChild(row);
    });
    
    // 일반 게시글 표시
    if (regularPosts.length > 0) {
        regularPosts.forEach(post => {
            const row = createPostRow(post, false);
            tableBody.appendChild(row);
        });
    } else {
        // 게시글이 없는 경우
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="5" class="no-posts">등록된 게시글이 없습니다.</td>`;
        tableBody.appendChild(emptyRow);
    }
}

// 게시글 행 생성
function createPostRow(post, isNotice) {
    const row = document.createElement('tr');
    if (isNotice) row.classList.add('notice');
    
    // 현재 날짜 기준 3일 이내 게시글은 NEW 표시
    const isNew = isRecentPost(post.date);
    const newTag = isNew ? '<span class="new-tag">NEW</span>' : '';
    
    row.innerHTML = `
        <td class="center">${isNotice ? '<span style="color: #4527a0; font-weight: bold;">공지</span>' : post.id}</td>
        <td><a href="#" onclick="viewPost(${post.id}); return false;">${post.title}</a> ${newTag}</td>
        <td class="center">${post.author}</td>
        <td class="center">${post.date}</td>
        <td class="center">${post.views.toLocaleString()}</td>
    `;
    
    return row;
}

// 최근 게시글 여부 확인 (3일 이내)
function isRecentPost(dateString) {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
}

// 게시글 보기
function viewPost(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        // 조회수 증가
        post.views++;
        localStorage.setItem('boardPosts', JSON.stringify(posts));
        
        // 게시판 숨기기
        document.querySelector('.board-container').style.display = 'none';
        
        // 상세 보기 컨테이너 생성 또는 가져오기
        let postDetailContainer = document.querySelector('.post-detail');
        if (!postDetailContainer) {
            postDetailContainer = document.createElement('div');
            postDetailContainer.className = 'post-detail';
            document.querySelector('.container').appendChild(postDetailContainer);
        }
        
        // 상세 내용 채우기
        postDetailContainer.innerHTML = `
            <div class="post-header">
                <h2>${post.title}</h2>
                <div class="post-actions">
                    <a href="#" class="btn" onclick="showBoardList(); return false;">목록</a>
                </div>
            </div>
            <div class="post-meta">
                <div>작성자: ${post.author}</div>
                <div>작성일: ${post.date} | 조회수: ${post.views.toLocaleString()}</div>
            </div>
            <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
        `;
        
        // 상세 보기 표시
        postDetailContainer.style.display = 'block';
        
        // 제목 변경
        document.title = `${post.title} - 게시판 | 게임 아이템 거래소`;
    }
}

// 게시판 목록으로 돌아가기
function showBoardList() {
    // 상세 보기 숨기기
    const postDetailContainer = document.querySelector('.post-detail');
    if (postDetailContainer) {
        postDetailContainer.style.display = 'none';
    }
    
    // 글쓰기 폼 숨기기
    const postFormContainer = document.querySelector('.post-form');
    if (postFormContainer) {
        postFormContainer.style.display = 'none';
    }
    
    // 게시판 표시
    document.querySelector('.board-container').style.display = 'block';
    
    // 게시글 목록 새로고침
    displayPosts();
    
    // 제목 변경
    document.title = '게시판 - 게임 아이템 거래소';
}

// 글쓰기 폼 표시
function showPostForm() {
    // 로그인 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('로그인 후 이용해주세요.');
        window.location.href = 'login.html';
        return;
    }
    
    // 게시판 숨기기
    document.querySelector('.board-container').style.display = 'none';
    
    // 상세 보기 숨기기
    const postDetailContainer = document.querySelector('.post-detail');
    if (postDetailContainer) {
        postDetailContainer.style.display = 'none';
    }
    
    // 글쓰기 폼 생성 또는 가져오기
    let postFormContainer = document.querySelector('.post-form');
    if (!postFormContainer) {
        postFormContainer = document.createElement('div');
        postFormContainer.className = 'post-form';
        document.querySelector('.container').appendChild(postFormContainer);
    }
    
    // 현재 로그인한 사용자 정보
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const username = currentUser ? currentUser.nickname || currentUser.username : '익명';
    
    // 폼 내용 채우기
    postFormContainer.innerHTML = `
        <h2>글쓰기</h2>
        <div id="postAlert" class="alert"></div>
        <form id="postForm">
            <div class="form-group">
                <label for="postCategory">카테고리</label>
                <select id="postCategory" class="form-control" required>
                    <option value="free">자유</option>
                    <option value="info">정보</option>
                    <option value="trade">거래</option>
                    <option value="qna">문의</option>
                </select>
            </div>
            <div class="form-group">
                <label for="postTitle">제목</label>
                <input type="text" id="postTitle" class="form-control" placeholder="제목을 입력하세요" required>
            </div>
            <div class="form-group">
                <label for="postContent">내용</label>
                <textarea id="postContent" class="form-control" placeholder="내용을 입력하세요" required></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn" onclick="showBoardList()">취소</button>
                <button type="button" class="btn" onclick="submitPost()">등록</button>
            </div>
        </form>
    `;
    
    // 폼 표시
    postFormContainer.style.display = 'block';
    
    // 제목 변경
    document.title = '글쓰기 - 게시판 | 게임 아이템 거래소';
}

// 게시글 등록
function submitPost() {
    const category = document.getElementById('postCategory').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    // 유효성 검사
    if (!title.trim() || !content.trim()) {
        showAlert('제목과 내용을 모두 입력해주세요.', 'danger');
        return;
    }
    
    // 현재 로그인한 사용자 정보
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('로그인 후 이용해주세요.');
        window.location.href = 'login.html';
        return;
    }
    
    const author = currentUser.nickname || currentUser.username;
    
    // 현재 날짜 생성
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // 게시글 객체 생성
    const newPost = {
        id: postIdCounter++,
        title: title,
        content: content,
        author: author,
        category: category,
        views: 0,
        date: dateString,
        isNotice: false
    };
    
    // 게시글 저장
    const posts = getPosts();
    posts.push(newPost);
    localStorage.setItem('boardPosts', JSON.stringify(posts));
    localStorage.setItem('postIdCounter', postIdCounter.toString());
    
    // 성공 메시지 표시
    showAlert('게시글이 등록되었습니다.', 'success');
    
    // 게시판으로 돌아가기 (1초 후)
    setTimeout(() => {
        showBoardList();
    }, 1000);
}

// 알림 메시지 표시
function showAlert(message, type) {
    const alertDiv = document.getElementById('postAlert');
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.display = 'block';
    
    // 3초 후 알림 숨기기
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 3000);
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 게시글 초기화
    initializeBoardPosts();
    
    // 탭 클릭 이벤트
    const tabContainer = document.querySelector('.tab-container');
    if (tabContainer) {
        tabContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab')) {
                const tabs = document.querySelectorAll('.tab');
                tabs.forEach(tab => tab.classList.remove('active'));
                
                e.target.classList.add('active');
                
                const category = e.target.getAttribute('data-tab');
                displayPosts(category);
            }
        });
    }
    
    // 글쓰기 버튼 이벤트
    const writeBtn = document.querySelector('.board-header .btn');
    if (writeBtn) {
        writeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPostForm();
        });
    }
});
