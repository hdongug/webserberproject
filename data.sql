-- 초기 카테고리 데이터
INSERT INTO categories (name, description, display_order, active, created_at, updated_at) VALUES
('무기', '게임 내 무기 아이템', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('방어구', '게임 내 방어구 아이템', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('액세서리', '게임 내 액세서리 아이템', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('소모품', '게임 내 소모품 아이템', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('재료', '게임 내 제작 재료', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('기타', '기타 게임 아이템', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 세부 카테고리 추가
INSERT INTO subcategories (name, category_id) VALUES
('검', 1),
('도끼', 1),
('활', 1),
('스태프', 1),
('단검', 1),
('갑옷', 2),
('장갑', 2),
('투구', 2),
('물약', 4);

-- 초기 관리자 사용자 데이터
INSERT INTO users (username, password, email, nickname, role, enabled, created_at, updated_at, credit_score, transaction_count) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin@gamemarket.com', '관리자', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 100, 0),
('testuser', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'test@gamemarket.com', '테스트유저', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50, 0);

-- 새로운 아이템 데이터 (유저가 제공한 정보)
INSERT INTO items (name, description, price, stats, effect, rarity, category_id, subcategory_id, image_url, created_at, updated_at) VALUES
-- 무기 카테고리
('마법 스태프', '마법 협회에서 마법사들의 마력을 보조를 해주기 우이나 기본 아이템이다.', 1000, '마력 +10 마나 회복: 5%', NULL, 'common', 1, 4, '/PNG/weapon/KakaoTalk_20250510_205732390_01.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('제국 도끼', '어느 제국의 근접전을 쓰는 이반 병사들의 무기이다.', 1000, '공격력 +15 체력 +100', NULL, 'common', 1, 2, '/PNG/weapon/KakaoTalk_20250510_205732390_05.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('제국의 활', '아르카 제국의 궁수들이 사용하던 무기이다.', 1000, '공격력 +10 치명타 데미지 5%', NULL, 'common', 1, 3, '/PNG/weapon/KakaoTalk_20250510_205732390_02.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('심연의 칼', '공호한 심연속에 있는 이름 모를 어느 황제 의 검이다.', 125000, '공격력 +250 공격 속도 +75%', '평타를 5번 이상 때리면 광폭화로 방마저가 10%깝이는 대신 공격력 이 200%증가한다. 공격력이 750 이상일 경우 공격력을 추가적으로 500을 더 얻는다.', 'legendary', 1, 1, '/PNG/weapon/KakaoTalk_20250510_205732390_06.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('칠흑의 양날 도끼', '옥 어느 제국 국가에서 장군이 쓰던 도끼이다.', 100000, '공격력 +100 체력 + 450 스킬 감소 25%', '스킬 및 평타를 떠리면 방어력이 감소한다.(중첩횟수 5회, 최대 방어력 감소 25% 감소)', 'epic', 1, 2, '/PNG/weapon/KakaoTalk_20250510_205732390_03.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('천공의 활', '천공 제국 대장장이가 제작한 아이템이다.', 100000, '공격력 +75 치명타 확률 +50 치명타 추가 데미지 25%', '치명타가 터지면 5초 동안 공격속도가 200% 증가한다.', 'epic', 1, 3, '/PNG/weapon/KakaoTalk_20250510_205732390_04.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('사무라이의 검', '베르는 제국의 권력층 사무라이들이 쓰던 검이다.', 5000, '공격력 +50 공격속도 5% 치명타 +10%', NULL, 'rare', 1, 1, '/PNG/weapon/KakaoTalk_20250510_205732390_07.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('다르킨 단검', '이 아이템은 악마의 아이템으로 검으로 다르킨이라는 장비로 무기에 따라 특수 능력을 사용을 할 수 있다.', 125000, '공격력 +1,500 공격속도 +250% 스킬 감속 +100', '1중첩당 공격력의 10% 추가적으로 출혈 데미지와 최대 중첩까지 쌓으면 공격력을 25% 추가적으로 얻을 수 있다. 출 수 있다(최대 중첩 5회 + 최대 출혈 데미지 50% )', 'mythic', 1, 5, '/PNG/weapon/KakaoTalk_20250510_205732390_08.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('아르테미스의 활', '아르테미스가 주로 쓰던 활이다.', 500000, '공격력 + 2,000 공격속도 +200% 치명타 확률 +75 치명타 데미지 200%', '치명타로 데미지 입을 시 1.5초간 출혈효과가 생긴다 (출혈 데미지 공격력 10%) 25% 확률로 관통을 해서 뒤에 있는 몬스터도 맞출수 있다.', 'mythic', 1, 3, '/PNG/weapon/KakaoTalk_20250510_205732390_09.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('갑옷', '어느 제국의 갑옷이다.', 1000, '방어력 +10 체력 +10', NULL, 'common', 2, 6, '/PNG/armor/KakaoTalk_20250510_205715529_01.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('에테르 장갑', '마검사들이 좋아하는 장갑이다.', 50000, '방어력 +50 공격력 +50 체력 +50 공격속도 50% 마력 50%', '공격력인 아이템을 마력으로 치환된다. 에테르 장갑 + 에테르 후드 착용시 마력 100추가, 마력 100 추가', 'rare', 2, 7, '/PNG/armor/KakaoTalk_20250510_205715529_03.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('에테르 후드', '마검사들이 좋아하는 후드갑옷이다.', 50000, '방어력 +150 체력 +450 마력 50%', '스킬 감속 +20% 마력 +100 에테르 장갑 + 에테르 후드 착용시 마력 100추가, 마력 100 추가', 'rare', 2, 6, '/PNG/armor/KakaoTalk_20250510_205715529.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('체력회복', '일반 물약이다.', 2500, NULL, '10초 동안 전체 체력의 5%씩 체력을 회복을 한다.', 'common', 4, 9, '/PNG/KakaoTalk_20250510_213329962.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
