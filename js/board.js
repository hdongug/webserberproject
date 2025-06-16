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
    
    // 정렬된 일반 게시글 (내림차순)
    regularPosts.sort((a, b) => b.id - a.id);
    
    // 순번 카운터 (일반 게시글용)
    let displayNumber = regularPosts.length;
    
    // 공지사항 표시
    noticePosts.forEach(post => {
        const row = createPostRow(post, true, 0);
        tableBody.appendChild(row);
    });
    
    // 일반 게시글 표시
    if (regularPosts.length > 0) {
        regularPosts.forEach(post => {
            const row = createPostRow(post, false, displayNumber--);
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
function createPostRow(post, isNotice, displayNumber) {
    const row = document.createElement('tr');
    if (isNotice) row.classList.add('notice');
    
    // 현재 날짜 기준 3일 이내 게시글은 NEW 표시
    const isNew = isRecentPost(post.date);
    const newTag = isNew ? '<span class="new-tag">NEW</span>' : '';
    
    // 공지는 "공지"로 표시, 일반 게시글은 리스트에서의 순번으로 표시
    const numberDisplay = isNotice ? 
        '<span style="color: #4527a0; font-weight: bold;">공지</span>' : 
        displayNumber;
    
    row.innerHTML = `
        <td class="center">${numberDisplay}</td>
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
        
        // 현재 로그인한 사용자 정보 가져오기
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        const isAuthor = currentUser.nickname === post.author || currentUser.username === post.author;
        
        // 상세 내용 채우기
        postDetailContainer.innerHTML = `
            <div class="post-header">
                <h2>${post.title}</h2>
                <div class="post-actions">
                    <a href="#" class="btn" onclick="showBoardList(); return false;">목록</a>
                    <a href="#" class="btn" onclick="window.history.back(); return false;">뒤로가기</a>
                    ${isAuthor ? `
                    <a href="#" class="btn btn-edit" onclick="showEditPostForm(${post.id}); return false;">수정</a>
                    <a href="#" class="btn btn-delete" onclick="confirmDeletePost(${post.id}); return false;">삭제</a>
                    ` : ''}
                </div>
            </div>
            <div class="post-meta">
                <div>작성자: ${post.author}</div>
                <div>작성일: ${post.date} | 조회수: ${post.views.toLocaleString()}</div>
            </div>
            <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
            
            <div class="post-comments">
                <h3>댓글 <span id="comment-count">${getComments(post.id).length}</span></h3>
                <div class="comments-container" id="comments-container-${post.id}">
                    ${renderComments(post.id)}
                </div>
                
                <div class="comment-form">
                    ${localStorage.getItem('isLoggedIn') === 'true' ? `
                    <textarea id="comment-text" placeholder="댓글을 입력하세요"></textarea>
                    <button class="btn" onclick="addComment(${post.id}); return false;">댓글 등록</button>
                    ` : `
                    <p class="login-needed">댓글을 남기려면 <a href="login.html">로그인</a>하세요.</p>
                    `}
                </div>
            </div>
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

// 댓글 관련 기능 -------------------

// 댓글 저장소 초기화
function initializeComments() {
    if (!localStorage.getItem('postComments')) {
        localStorage.setItem('postComments', JSON.stringify({}));
    }
}

// 댓글 가져오기
function getComments(postId) {
    const commentsStore = JSON.parse(localStorage.getItem('postComments') || '{}');
    return commentsStore[postId] || [];
}

// 댓글 렌더링
function renderComments(postId) {
    const comments = getComments(postId);
    
    if (comments.length === 0) {
        return '<p class="no-comments">등록된 댓글이 없습니다.</p>';
    }
    
    return comments.map((comment, index) => {
        // 현재 사용자가 댓글 작성자인지 확인
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        const isAuthor = currentUser.nickname === comment.author || currentUser.username === comment.author;
        
        return `
            <div class="comment" id="comment-${postId}-${index}">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${comment.date}</span>
                    ${isAuthor ? `<button class="btn-delete-comment" onclick="deleteComment(${postId}, ${index}); return false;">삭제</button>` : ''}
                </div>
                <div class="comment-content">${comment.content.replace(/\n/g, '<br>')}</div>
            </div>
        `;
    }).join('');
}

// 댓글 추가
function addComment(postId) {
    // 로그인 확인
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('로그인 후 이용해주세요.');
        return;
    }
    
    const commentText = document.getElementById('comment-text').value.trim();
    
    if (commentText === '') {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    
    // 현재 로그인한 사용자 정보
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const author = currentUser.nickname || currentUser.username;
    
    // 현재 날짜 생성
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    // 새 댓글 객체
    const newComment = {
        author: author,
        content: commentText,
        date: dateString
    };
    
    // 기존 댓글 가져오기
    const commentsStore = JSON.parse(localStorage.getItem('postComments') || '{}');
    const comments = commentsStore[postId] || [];
    
    // 댓글 추가
    comments.push(newComment);
    commentsStore[postId] = comments;
    
    // 댓글 저장
    localStorage.setItem('postComments', JSON.stringify(commentsStore));
    
    // 댓글 목록 갱신
    document.getElementById(`comments-container-${postId}`).innerHTML = renderComments(postId);
    document.getElementById('comment-count').textContent = comments.length;
    
    // 댓글 입력창 초기화
    document.getElementById('comment-text').value = '';
}

// 댓글 삭제
function deleteComment(postId, commentIndex) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    
    // 기존 댓글 가져오기
    const commentsStore = JSON.parse(localStorage.getItem('postComments') || '{}');
    let comments = commentsStore[postId] || [];
    
    // 댓글 삭제
    comments.splice(commentIndex, 1);
    commentsStore[postId] = comments;
    
    // 댓글 저장
    localStorage.setItem('postComments', JSON.stringify(commentsStore));
    
    // 댓글 목록 갱신
    document.getElementById(`comments-container-${postId}`).innerHTML = renderComments(postId);
    document.getElementById('comment-count').textContent = comments.length;
}

// 게시물 수정 & 삭제 관련 기능 -------------------

// 게시물 수정 폼 표시
function showEditPostForm(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // 현재 로그인한 사용자 정보 가져오기
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const isAuthor = currentUser.nickname === post.author || currentUser.username === post.author;
    
    // 작성자 확인
    if (!isAuthor) {
        alert('게시물 작성자만 수정할 수 있습니다.');
        return;
    }
    
    // 게시판, 상세 보기 숨기기
    document.querySelector('.board-container').style.display = 'none';
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
    
    // 폼 내용 채우기
    postFormContainer.innerHTML = `
        <h2>게시글 수정</h2>
        <div id="postAlert" class="alert"></div>
        <form id="postForm">
            <input type="hidden" id="postId" value="${post.id}">
            <div class="form-group">
                <label for="postCategory">카테고리</label>
                <select id="postCategory" class="form-control" required>
                    <option value="free"${post.category === 'free' ? ' selected' : ''}>자유</option>
                    <option value="info"${post.category === 'info' ? ' selected' : ''}>정보</option>
                    <option value="trade"${post.category === 'trade' ? ' selected' : ''}>거래</option>
                    <option value="qna"${post.category === 'qna' ? ' selected' : ''}>문의</option>
                </select>
            </div>
            <div class="form-group">
                <label for="postTitle">제목</label>
                <input type="text" id="postTitle" class="form-control" value="${post.title}" required>
            </div>
            <div class="form-group">
                <label for="postContent">내용</label>
                <textarea id="postContent" class="form-control" required>${post.content}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn" onclick="viewPost(${post.id})">취소</button>
                <button type="button" class="btn" onclick="updatePost()">수정</button>
            </div>
        </form>
    `;
    
    // 폼 표시
    postFormContainer.style.display = 'block';
    
    // 제목 변경
    document.title = '게시글 수정 - 게시판 | 게임 아이템 거래소';
}

// 게시글 수정
function updatePost() {
    const postId = parseInt(document.getElementById('postId').value);
    const category = document.getElementById('postCategory').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    // 유효성 검사
    if (!title.trim() || !content.trim()) {
        showAlert('제목과 내용을 모두 입력해주세요.', 'danger');
        return;
    }
    
    // 게시글 찾기
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return;
    
    // 현재 로그인한 사용자 정보 가져오기
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const isAuthor = currentUser.nickname === posts[postIndex].author || currentUser.username === posts[postIndex].author;
    
    // 작성자 확인
    if (!isAuthor) {
        showAlert('게시글 작성자만 수정할 수 있습니다.', 'danger');
        return;
    }
    
    // 게시글 수정
    posts[postIndex].category = category;
    posts[postIndex].title = title;
    posts[postIndex].content = content;
    
    // 게시글 저장
    localStorage.setItem('boardPosts', JSON.stringify(posts));
    
    // 성공 메시지 표시
    showAlert('게시글이 수정되었습니다.', 'success');
    
    // 게시글 상세 보기로 돌아가기 (1초 후)
    setTimeout(() => {
        viewPost(postId);
    }, 1000);
}

// 게시글 삭제 확인
function confirmDeletePost(postId) {
    if (confirm('게시글을 삭제하시겠습니까?')) {
        deletePost(postId);
    }
}

// 게시글 삭제
function deletePost(postId) {
    // 게시글 찾기
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return;
    
    // 현재 로그인한 사용자 정보 가져오기
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const isAuthor = currentUser.nickname === posts[postIndex].author || currentUser.username === posts[postIndex].author;
    
    // 작성자 확인
    if (!isAuthor) {
        alert('게시글 작성자만 삭제할 수 있습니다.');
        return;
    }
    
    // 게시글 삭제
    posts.splice(postIndex, 1);
    
    // 게시글 저장
    localStorage.setItem('boardPosts', JSON.stringify(posts));
    
    // 게시판으로 돌아가기
    alert('게시글이 삭제되었습니다.');
    showBoardList();
    
    // 해당 게시글의 댓글 모두 삭제
    const commentsStore = JSON.parse(localStorage.getItem('postComments') || '{}');
    delete commentsStore[postId];
    localStorage.setItem('postComments', JSON.stringify(commentsStore));
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 게시글 초기화
    initializeBoardPosts();
    
    // 댓글 저장소 초기화
    initializeComments();
    
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
