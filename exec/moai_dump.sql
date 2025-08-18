-- =====================================================================
-- Demo/Dummy Data Dump (MySQL 8.0+)
-- Assumes schema already created and `USE backend_db;` is in effect
-- =====================================================================

SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

USE backend_db;

-- 성능/무결성: 일괄 삽입 동안 FK 검사 비활성화
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1) users
-- ---------------------------------------------------------------------
DELETE FROM users;

INSERT INTO users (id, name, email, provider_type, profile_image_url, password, refresh_token, is_verified, created_at) VALUES
(1, 'Kimssafy', 'ssafykim13@naver.com', 'LOCAL', NULL, '$2a$10$8vYUXduIqbgzoFBKkVe9oe6yx.Xb9Z24JxrPI2nAZgNg5uxDUGMTS', NULL, 1, '2025-08-01 09:00:00'),
(2, 'Ahnssafy', 'ahnssafy@gmail.com', 'GOOGLE', NULL, '$2a$10$/QhCagJNiAr1CoJqVpKDfuKy42WygobXxoTBxbMMOuymzEo9McC7.', NULL, 1, '2025-08-02 10:10:10'),
(3, 'Ohssafy', 'ohh5safy@gmail.com', 'GOOGLE', NULL, '$2a$10$ucq8oFJvrFWWFz0xBFYxNeS40nyVy0sgwfDLI9bA5pTniPQLj6gZa', NULL, 1, '2025-08-03 11:11:11'),
(4, 'Leessafy', 'leessafy@naver.com', 'LOCAL', NULL, '$2a$10$8wswBD.BmXJGzwkwvXc/g.6IfLs1fTkuKGdcSj7IjwwRga/1jZGxm', NULL, 1, '2025-08-09 00:00:00'),
(5, 'Choissafy', 'choissafy@naver.com', 'LOCAL', NULL, '$2a$10$Glf5eeUy9UXzIivkEMJ0IeXKF3ZK7KgVzUNzTlMplfa6ap.7HoIiy', NULL, 1, '2025-08-04 12:34:56'),
(6, 'Heossafy', 'heossafy@gmail.com', 'GOOGLE', NULL, '$2a$10$JcCoINhN.jWZhI49G5u8HOLcIdVCltk7E/cF5Ox8imP35dDOhY1Q6', NULL, 1, '2025-08-05 08:20:00');

-- ---------------------------------------------------------------------
-- 2) study_groups
-- ---------------------------------------------------------------------
DELETE FROM study_groups;

INSERT INTO study_groups (id, name, description, hash_id, max_capacity, notice, image_url, created_by, created_at) VALUES
(1, '알고리즘 스터디', '문제 풀이 + 코드 설명 스터디', '6xAMqAGN', 8, '매주 화/목요일 20시 온라인 코드리뷰', NULL, 1, '2025-08-06 09:00:00'),
(2, 'CS study', '운영체제/네트워크/소프트웨어', 'yZORVONp', 8, '매주 수요일 19시 반에 발표', NULL, 1, '2025-08-06 09:30:00'),
(3, 'AI 지식탐구', 'AI에 관한 흥미로운 지식 공유', 'pJBDbPjr', 6, '논문, 사이트 등 다 들고오세요', NULL, 1, '2025-08-06 10:00:00');

-- ---------------------------------------------------------------------
-- 3) schedules
-- ---------------------------------------------------------------------
DELETE FROM schedules;

INSERT INTO schedules (id, study_id, title, start_datetime, end_datetime, memo) VALUES
(1, 1, '순열/조합/부분집합 1주차', '2025-08-19 20:00:00', '2025-08-19 21:30:00', 'N과 M 1'),
(2, 1, '순열/조합/부분집합 1주차 2', '2025-08-21 20:00:00', '2025-08-21 21:30:00', 'N과 M 2'),
(3, 2, 'CS 온라인 스터디', '2025-08-20 19:30:00', '2025-08-21 21:30:00', '운영체제 1주차 내용 공유'),
(4, 2, 'CS 온라인 스터디', '2025-08-27 19:30:00', '2025-08-21 21:30:00', '운영체제 2주차 내용 공유'),
(5, 2, 'CS 온라인 스터디', '2025-09-03 19:30:00', '2025-08-21 21:30:00', '운영체제 3주차 내용 공유'),
(6, 1, '분야 선택', '2025-08-21 19:00:00', '2025-08-21 19:10:00', '각자 조사하고 싶은 분야 선택하기');


-- ---------------------------------------------------------------------
-- 4) study_memberships
-- ---------------------------------------------------------------------
DELETE FROM study_memberships;

INSERT INTO study_memberships (id, user_id, study_id, role, status, joined_at) VALUES
-- 알고리즘 스터디(1)
(1, 1, 1, 'ADMIN',    'APPROVED', '2025-08-06 09:05:00'),
(2, 5, 1, 'DELEGATE', 'APPROVED', '2025-08-06 09:10:00'),
(3, 2, 1, 'MEMBER',   'APPROVED', '2025-08-06 09:15:00'),
(4, 4, 1, 'MEMBER',   'PENDING',  NULL),
-- CS study(2)
(5, 1, 2, 'ADMIN',    'APPROVED', '2025-08-06 09:35:00'),
(6, 2, 2, 'MEMBER',   'APPROVED', '2025-08-06 09:40:00'),
-- AI 지식탐구(3)
(7, 1, 3, 'ADMIN',    'APPROVED', '2025-08-06 10:05:00'),
(8, 3, 3, 'MEMBER',   'APPROVED', '2025-08-06 10:10:00'),
(9, 3, 6, 'MEMBER',   'APPROVED', '2025-08-06 10:10:00');

-- ---------------------------------------------------------------------
-- 5) categories
-- ---------------------------------------------------------------------
DELETE FROM categories;

INSERT INTO categories (id, study_id, name) VALUES
(1, 1, '이론공부자료'),
(2, 1, '문제풀이'),
(3, 1, '요약'),
(4, 2, '운영체제'),
(5, 2, '네트워크'),
(6, 3, 'AI윤리'),
(7, 3, '생성형 AI'),
(8, 3, 'AI트렌드');

-- 6) documents
DELETE FROM documents;

-- 7) document_categories
DELETE FROM document_categories;

-- 8) ai_summaries
DELETE FROM ai_summaries;

-- 9) ai_summary_documents
DELETE FROM ai_summary_documents;

-- 일괄 작업 종료: FK 검사 복원
SET FOREIGN_KEY_CHECKS = 1;
