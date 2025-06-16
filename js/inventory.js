/**
 * 게임 아이템 거래소 - 사용자별 독립적인 창고 페이지
 * inventory.js
 */

// 샘플 아이템 데이터 (실제 구현 시에는 데이터베이스나 API에서 가져옴)
const sampleItems = [
    {
        id: 1,
        name: "심연의 칼",
        type: "weapon",
        rarity: "epic",
        description: "어둠의 힘이 깃든 날카로운 검으로, 적에게 추가 어둠 피해를 입힙니다.",
        image: "/PNG/weapon/KakaoTalk_20250510_205732390_06.png",
        stats: {
            damage: 120,
            speed: 1.2
        },
        value: 1500
    },
    {
        id: 2,
        name: "철제 갑옷",
        type: "armor",
        rarity: "common",
        description: "기본적인 보호 기능을 제공하는 튼튼한 갑옷입니다.",
        image: "/PNG/armor/iron_armor.jpg",
        stats: {
            defense: 50,
            durability: 100
        },
        value: 300
    },
    {
        id: 3,
        name: "체력 회복 물약",
        type: "consumable",
        rarity: "uncommon",
        description: "마시면 즉시 체력이 30% 회복됩니다.",
        image: "/PNG/KakaoTalk_20250510_213329962.png",
        stats: {
            recovery: "30%"
        },
        value: 150
    },
    {
        id: 4,
        name: "행운의 목걸이",
        type: "accessory",
        rarity: "rare",
        description: "착용자의 행운을 증가시켜 더 좋은 아이템을 획득할 확률이 올라갑니다.",
        image: "/PNG/accessory/lucky_necklace.jpg",
        stats: {
            luck: "+15%"
        },
        value: 800
    },
    {
        id: 5,
        name: "비룡의 투구",
        type: "armor",
        rarity: "legendary",
        description: "전설적인 용의 비늘로 만든 투구로, 강력한 마법 저항력을 제공합니다.",
        image: "/PNG/armor/dragon_helmet.jpg",
        stats: {
            defense: 85,
            magicResist: 120
        },
        value: 2000
    }
];

// 전역 변수
let currentUser = null;
let userInventory = [];
let currentFilter = 'all';
let selectedItemForSell = null;

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 및 UI 업데이트
    checkLoginStatus();
    
    // 필터 버튼에 이벤트 리스너 추가
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성화된 필터 버튼 스타일 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 필터 적용
            currentFilter = this.dataset.filter;
            displayInventoryItems();
        });
    });
    
    // 사용자 인벤토리 로드 및 표시
    loadUserInventory();
    
    // 창고 통계 업데이트
    updateInventoryStats();
});

/**
 * 로그인 상태 확인 및 UI 업데이트
 */
function checkLoginStatus() {
    const currentUserData = localStorage.getItem('currentUser');
    const loginSection = document.getElementById('loginSection');
    const loginMenu = document.getElementById('loginMenu');
    const registerMenu = document.getElementById('registerMenu');
    
    if (currentUserData) {
        currentUser = JSON.parse(currentUserData);
        
        // 로그인 섹션 업데이트
        loginSection.innerHTML = `
            <div class="user-welcome">
                안녕하세요, <strong>${currentUser.nickname || currentUser.username}</strong>님!
                <div class="user-actions">
                    <button onclick="location.href='profile.html'" class="btn-small">프로필</button>
                    <button onclick="logout()" class="btn-small">로그아웃</button>
                </div>
            </div>
        `;
        
        // 메뉴 업데이트
        loginMenu.textContent = '로그아웃';
        loginMenu.href = '#';
        loginMenu.onclick = function(e) {
            e.preventDefault();
            logout();
        };
        registerMenu.style.display = 'none';
    } else {
        // 로그인 필요 알림 및 리다이렉션
        showNotification('로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

/**
 * 사용자 인벤토리 로드
 */
function loadUserInventory() {
    if (!currentUser) return;
    
    // 로컬 스토리지에서 인벤토리 데이터 가져오기
    const inventoryData = localStorage.getItem(`inventory_${currentUser.username}`);
    
    // 인벤토리가 없으면 샘플 데이터로 초기화 (실제 서비스에서는 사용자별 데이터를 서버에서 가져와야 함)
    if (!inventoryData) {
        // 사용자별 초기 인벤토리는 샘플 아이템 중 2개만 랜덤하게 제공
        const randomItems = [...sampleItems]
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
        
        userInventory = randomItems;
        saveInventory();
    } else {
        userInventory = JSON.parse(inventoryData);
    }
    
    // 인벤토리 아이템 표시
    displayInventoryItems();
    
    // 창고 통계 업데이트
    updateInventoryStats();
}

/**
 * 인벤토리 저장 (로컬 스토리지)
 */
function saveInventory() {
    if (!currentUser) return;
    localStorage.setItem(`inventory_${currentUser.username}`, JSON.stringify(userInventory));
    updateInventoryStats();
}

/**
 * 인벤토리 아이템 표시
 */
function displayInventoryItems() {
    const inventoryContainer = document.getElementById('inventoryItems');
    inventoryContainer.innerHTML = '';
    
    // 필터링된 아이템 목록
    let filteredItems = userInventory;
    if (currentFilter !== 'all') {
        filteredItems = userInventory.filter(item => item.type === currentFilter);
    }
    
    // 아이템이 없는 경우 안내 메시지 표시
    if (filteredItems.length === 0) {
        inventoryContainer.innerHTML = `
            <div class="empty-inventory">
                <i class="fas fa-box-open"></i>
                <h3>아이템이 없습니다</h3>
                <p>${currentFilter === 'all' ? '창고에 아이템이 없습니다.' : '이 유형의 아이템이 없습니다.'}</p>
                <a href="market.html" class="btn">거래소 방문하기</a>
            </div>
        `;
        return;
    }
    
    // 아이템 카드 생성 및 추가
    filteredItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        // 아이템 희귀도 표시 색상 클래스
        const rarityClass = `rarity-${item.rarity || 'common'}`;
        const rarityText = getRarityText(item.rarity || 'common');
        
        // 아이템 통계 정보 생성
        let statsHtml = '<div class="item-stats">';
        for (const [key, value] of Object.entries(item.stats || {})) {
            statsHtml += `<div class="item-stat"><span>${getStatName(key)}:</span> <span>${value}</span></div>`;
        }
        statsHtml += '</div>';
        
        // 아이템 카드 내용 설정
        itemCard.innerHTML = `
            <div class="item-image">
                <img src="${item.image || 'img/default-item.png'}" alt="${item.name}">
            </div>
            <span class="item-rarity ${rarityClass}">${rarityText}</span>
            <div class="item-content">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                ${statsHtml}
                <div class="item-value"><i class="fas fa-coins"></i> ${item.value.toLocaleString()} 골드</div>
                <div class="item-action-buttons">
                    <button class="btn-sell" onclick="openSellModal(${item.id})">판매</button>
                    ${item.type === 'consumable' ? `<button class="btn-use" onclick="useItem(${item.id})">사용</button>` : ''}
                    <button class="btn-details" onclick="viewItemDetails(${item.id})">상세</button>
                </div>
            </div>
        `;
        
        inventoryContainer.appendChild(itemCard);
    });
}

/**
 * 창고 통계 업데이트
 */
function updateInventoryStats() {
    const totalItemsElement = document.getElementById('totalItems');
    const totalValueElement = document.getElementById('totalValue');
    
    const totalItems = userInventory.length;
    const totalValue = userInventory.reduce((sum, item) => sum + (item.value || 0), 0);
    
    totalItemsElement.textContent = totalItems;
    totalValueElement.textContent = totalValue.toLocaleString();
}

/**
 * 판매 모달 열기
 */
function openSellModal(itemId) {
    selectedItemForSell = userInventory.find(item => item.id === itemId);
    if (!selectedItemForSell) return;
    
    const modalItemDetails = document.getElementById('modalItemDetails');
    const rarityClass = `rarity-${selectedItemForSell.rarity || 'common'}`;
    const rarityText = getRarityText(selectedItemForSell.rarity || 'common');
    
    // 모달에 아이템 정보 표시
    modalItemDetails.innerHTML = `
        <div class="modal-item-image">
            <img src="${selectedItemForSell.image || 'img/default-item.png'}" alt="${selectedItemForSell.name}">
        </div>
        <div class="modal-item-info">
            <div class="modal-item-name">${selectedItemForSell.name}</div>
            <span class="modal-item-rarity ${rarityClass}">${rarityText}</span>
            <div class="item-description">${selectedItemForSell.description}</div>
            <div class="item-value"><i class="fas fa-coins"></i> 기본 가치: ${selectedItemForSell.value.toLocaleString()} 골드</div>
        </div>
    `;
    
    // 가격 입력 필드 초기화 및 설정
    const sellPriceInput = document.getElementById('sellPrice');
    sellPriceInput.value = selectedItemForSell.value;
    sellPriceInput.min = Math.floor(selectedItemForSell.value * 0.5);
    sellPriceInput.max = Math.ceil(selectedItemForSell.value * 2);
    
    // 모달 표시
    const sellModal = document.getElementById('sellModal');
    sellModal.style.display = 'block';
}

/**
 * 판매 모달 닫기
 */
function closeSellModal() {
    const sellModal = document.getElementById('sellModal');
    sellModal.style.display = 'none';
    selectedItemForSell = null;
}

/**
 * 아이템 판매 확인
 */
function confirmSell() {
    if (!selectedItemForSell || !currentUser) return;
    
    const sellPrice = parseInt(document.getElementById('sellPrice').value);
    if (isNaN(sellPrice) || sellPrice <= 0) {
        showNotification('유효한 판매 가격을 입력해주세요.');
        return;
    }
    
    // 거래소에 아이템 등록 (로컬 스토리지에 저장)
    const marketItems = JSON.parse(localStorage.getItem('marketItems') || '[]');
    
    // 판매 아이템 정보 생성
    const marketItem = {
        ...selectedItemForSell,
        seller: currentUser.username,
        sellerNickname: currentUser.nickname || currentUser.username,
        price: sellPrice,
        listingDate: new Date().toISOString()
    };
    
    // 거래소 아이템 목록에 추가
    marketItems.push(marketItem);
    localStorage.setItem('marketItems', JSON.stringify(marketItems));
    
    // 사용자 인벤토리에서 아이템 제거
    userInventory = userInventory.filter(item => item.id !== selectedItemForSell.id);
    saveInventory();
    
    // 알림 표시 및 모달 닫기
    showNotification(`"${selectedItemForSell.name}" 아이템을 ${sellPrice.toLocaleString()} 골드에 거래소에 등록했습니다.`);
    closeSellModal();
    
    // 인벤토리 화면 새로고침
    displayInventoryItems();
}

/**
 * 아이템 사용하기
 */
function useItem(itemId) {
    const item = userInventory.find(item => item.id === itemId);
    if (!item) return;
    
    // 소비 아이템이 아니면 사용 불가
    if (item.type !== 'consumable') {
        showNotification('이 아이템은 사용할 수 없습니다.');
        return;
    }
    
    // 아이템 사용 효과 적용 (실제 구현에서는 사용자 스탯에 영향을 줄 수 있음)
    let effectMessage = '';
    
    switch (item.name) {
        case '체력 회복 물약':
            effectMessage = '체력이 회복되었습니다!';
            break;
        case '마나 회복 물약':
            effectMessage = '마나가 회복되었습니다!';
            break;
        default:
            effectMessage = `${item.name}을(를) 사용했습니다!`;
    }
    
    // 인벤토리에서 아이템 제거 및 알림 표시
    userInventory = userInventory.filter(i => i.id !== item.id);
    saveInventory();
    showNotification(effectMessage);
    
    // 인벤토리 화면 새로고침
    displayInventoryItems();
}

/**
 * 아이템 상세 정보 보기
 */
function viewItemDetails(itemId) {
    const item = userInventory.find(item => item.id === itemId);
    if (!item) return;
    
    // 상세 정보 모달 구현 (나중에 추가)
    alert(`${item.name}\n\n${item.description}\n\n희귀도: ${getRarityText(item.rarity)}`);
}

/**
 * 희귀도 텍스트 가져오기
 */
function getRarityText(rarity) {
    const rarityMap = {
        common: '일반',
        uncommon: '고급',
        rare: '희귀',
        epic: '영웅',
        legendary: '전설',
        mythic: '신화',
        unique: '고유'
    };
    
    return rarityMap[rarity] || '일반';
}

/**
 * 스탯 이름 가져오기
 */
function getStatName(stat) {
    const statMap = {
        damage: '공격력',
        defense: '방어력',
        speed: '공격 속도',
        durability: '내구도',
        recovery: '회복량',
        luck: '행운',
        magicResist: '마법 저항'
    };
    
    return statMap[stat] || stat;
}

/**
 * 알림 메시지 표시
 */
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * 로그아웃 처리
 */
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// 30분마다 추천 아이템 표시 (인덱스 페이지에서 구현될 예정)
