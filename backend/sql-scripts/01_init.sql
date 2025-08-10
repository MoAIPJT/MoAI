CREATE DATABASE IF NOT EXISTS mydatabase;
USE backend_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    provider_type VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(500),
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS study_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    hash_id VARCHAR(100) NULL UNIQUE, -- 스터디 주소
    max_capacity INT NOT NULL, -- 최대 수용 인원
    notice TEXT, -- 스터디 공지사항
    image_url VARCHAR(500),
    created_by INT,
    created_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    study_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_datetime DATETIME NOT NULL, -- 시작 날짜 시간
    end_datetime DATETIME NOT NULL, -- 끝 날짜 시간
    memo VARCHAR(500),
    FOREIGN KEY (study_id) REFERENCES study_groups(id)
);

CREATE TABLE IF NOT EXISTS study_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    study_id INT NOT NULL,
    role ENUM('ADMIN','DELEGATE','MEMBER') NOT NULL,
    status ENUM('PENDING','APPROVED','LEFT','REJECTED') NOT NULL,
    joined_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (study_id) REFERENCES study_groups(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    study_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (study_id) REFERENCES study_groups(id)
);

CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    study_id INT NOT NULL,
    category_id INT NOT NULL,
    uploader_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT, -- 공부(원본) 자료 설명
    file_path VARCHAR(1000) NOT NULL,
    update_date DATETIME NOT NULL,
    FOREIGN KEY (study_id) REFERENCES study_groups(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (uploader_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ai_summaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    model_type VARCHAR(100),
    prompt_type VARCHAR(100),
    file_path VARCHAR(1000),
    created_at DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ai_summary_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    summary_id BIGINT NOT NULL,
    document_id INT NOT NULL,
    created_at DATETIME, -- 생성 시간
    FOREIGN KEY (summary_id) REFERENCES ai_summaries(id),
    FOREIGN KEY (document_id) REFERENCES documents(id)
);
