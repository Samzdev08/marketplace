-- ============================================================
--  BAZAR — Schéma de base de données
--  Marketplace de démonstration
-- ============================================================

-- Activer les clés étrangères (SQLite) ou laisser pour MySQL/PostgreSQL
-- PRAGMA foreign_keys = ON;

-- ============================================================
--  TABLE : users
-- ============================================================

CREATE DATABASE Marketplace;

USE Marketplace;
CREATE TABLE users (
    id            INT           PRIMARY KEY AUTO_INCREMENT,
    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,           -- bcrypt / argon2
    avatar_url    VARCHAR(500)  DEFAULT NULL,
    bio           TEXT          DEFAULT NULL,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
--  TABLE : categories
-- ============================================================
CREATE TABLE categories (
    id    INT          PRIMARY KEY AUTO_INCREMENT,
    name  VARCHAR(50)  NOT NULL UNIQUE  -- Électronique, Mode, Sport, Maison, Art, Livres, Autre
);

INSERT INTO categories (name) VALUES
    ('Électronique'),
    ('Mode'),
    ('Sport'),
    ('Maison'),
    ('Art'),
    ('Livres'),
    ('Autre');

-- ============================================================
--  TABLE : listings  (annonces)
-- ============================================================
CREATE TABLE listings (
    id           INT             PRIMARY KEY AUTO_INCREMENT,
    seller_id    INT             NOT NULL,
    category_id  INT             NOT NULL,
    title        VARCHAR(200)    NOT NULL,
    description  TEXT            DEFAULT NULL,
    price        DECIMAL(10, 2)  NOT NULL CHECK (price > 0),
    image_url    VARCHAR(500)    DEFAULT NULL,
    status       ENUM('active', 'sold', 'archived') NOT NULL DEFAULT 'active',
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_listing_seller   FOREIGN KEY (seller_id)   REFERENCES users(id)      ON DELETE CASCADE,
    CONSTRAINT fk_listing_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_listings_seller   ON listings (seller_id);
CREATE INDEX idx_listings_category ON listings (category_id);
CREATE INDEX idx_listings_status   ON listings (status);
CREATE INDEX idx_listings_price    ON listings (price);
CREATE INDEX idx_listings_created  ON listings (created_at DESC);

-- ============================================================
--  TABLE : orders  (achats)
-- ============================================================
CREATE TABLE orders (
    id          INT             PRIMARY KEY AUTO_INCREMENT,
    listing_id  INT             NOT NULL,
    buyer_id    INT             NOT NULL,
    amount      DECIMAL(10, 2)  NOT NULL,           -- prix au moment de l'achat
    status      ENUM('pending', 'confirmed', 'shipped', 'completed', 'cancelled')
                NOT NULL DEFAULT 'pending',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE RESTRICT,
    CONSTRAINT fk_order_buyer   FOREIGN KEY (buyer_id)   REFERENCES users(id)    ON DELETE RESTRICT
);

CREATE INDEX idx_orders_buyer   ON orders (buyer_id);
CREATE INDEX idx_orders_listing ON orders (listing_id);

-- ============================================================
--  TABLE : messages  (conversations entre acheteur et vendeur)
-- ============================================================
CREATE TABLE messages (
    id          INT      PRIMARY KEY AUTO_INCREMENT,
    listing_id  INT      NOT NULL,
    sender_id   INT      NOT NULL,
    receiver_id INT      NOT NULL,
    content     TEXT     NOT NULL,
    is_read     BOOLEAN  NOT NULL DEFAULT FALSE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_msg_listing  FOREIGN KEY (listing_id)  REFERENCES listings(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender   FOREIGN KEY (sender_id)   REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users(id)    ON DELETE CASCADE
);

CREATE INDEX idx_messages_listing  ON messages (listing_id);
CREATE INDEX idx_messages_sender   ON messages (sender_id);
CREATE INDEX idx_messages_receiver ON messages (receiver_id);

-- ============================================================
--  TABLE : favorites  (articles sauvegardés)
-- ============================================================
CREATE TABLE favorites (
    user_id    INT      NOT NULL,
    listing_id INT      NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, listing_id),
    CONSTRAINT fk_fav_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_fav_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- ============================================================
--  TABLE : reviews  (évaluations après transaction)
-- ============================================================
CREATE TABLE reviews (
    id          INT      PRIMARY KEY AUTO_INCREMENT,
    order_id    INT      NOT NULL UNIQUE,           -- 1 avis par commande
    reviewer_id INT      NOT NULL,
    reviewee_id INT      NOT NULL,
    rating      TINYINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT     DEFAULT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_order    FOREIGN KEY (order_id)    REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id)  ON DELETE CASCADE
);

-- ============================================================
--  VUES UTILES
-- ============================================================

-- Annonces actives avec infos vendeur et catégorie
CREATE VIEW v_active_listings AS
SELECT
    l.id,
    l.title,
    l.description,
    l.price,
    l.image_url,
    l.created_at,
    c.name  AS category,
    u.full_name  AS seller_name,
    u.avatar_url AS seller_avatar
FROM listings l
JOIN users      u ON u.id = l.seller_id
JOIN categories c ON c.id = l.category_id
WHERE l.status = 'active'
ORDER BY l.created_at DESC;

-- Statistiques par utilisateur (annonces publiées, achats effectués)
CREATE VIEW v_user_stats AS
SELECT
    u.id,
    u.full_name,
    u.email,
    COUNT(DISTINCT l.id)              AS listings_count,
    COUNT(DISTINCT o.id)              AS purchases_count,
    ROUND(AVG(r.rating), 1)           AS avg_rating
FROM users u
LEFT JOIN listings l ON l.seller_id = u.id AND l.status != 'archived'
LEFT JOIN orders   o ON o.buyer_id  = u.id AND o.status = 'completed'
LEFT JOIN reviews  r ON r.reviewee_id = u.id
GROUP BY u.id, u.full_name, u.email;

-- ============================================================
--  DONNÉES DE DÉMONSTRATION
-- ============================================================

INSERT INTO users (full_name, email, password_hash, avatar_url, bio) VALUES
    ('Sophie Martin',    'sophie.martin@exemple.com',  '$2b$12$HASH_PLACEHOLDER_1', 'https://i.pravatar.cc/150?img=47', 'Passionnée de design et objets vintage.'),
    ('Luc Bernard',      'luc.bernard@exemple.com',    '$2b$12$HASH_PLACEHOLDER_2', 'https://i.pravatar.cc/150?img=12', 'Amateur de cyclisme et de hi-fi.'),
    ('Marie Antoinette', 'marie.a@exemple.com',        '$2b$12$HASH_PLACEHOLDER_3', 'https://i.pravatar.cc/150?img=32', NULL);

INSERT INTO listings (seller_id, category_id, title, description, price, image_url) VALUES
    (1, 5, 'Aquarelle originale — Lac Léman',     'Peinture originale, format A3, encadrée.',       200.00, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80'),
    (1, 6, 'Collection Harry Potter complète',     'Tomes 1 à 7 en très bon état.',                   55.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'),
    (1, 1, 'Appareil photo vintage Minolta X-700', 'Livré avec objectif 50mm f/1.4.',                120.00, 'https://images.unsplash.com/photo-1452457807411-4979b707c5be?w=600&q=80'),
    (2, 4, 'Vélo de ville hollandais',             'Cadre aluminium, 7 vitesses, antivol inclus.',   320.00, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80'),
    (2, 4, 'Lampe de bureau mid-century',          'Design années 60, ampoule LED fournie.',          65.00, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'),
    (3, 2, 'Veste en cuir véritable',              'Taille M, très bon état, couleur noire.',         85.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUKLFCm6I7Jbte7PfL5FtXvhOuevJnccJVPA&s');

-- Marquer les articles achetés par Sophie comme vendus
UPDATE listings SET status = 'sold' WHERE id IN (4, 5);

INSERT INTO orders (listing_id, buyer_id, amount, status, created_at) VALUES
    (4, 1, 320.00, 'completed', '2025-02-24 10:00:00'),
    (5, 1,  65.00, 'completed', '2025-02-20 14:30:00');