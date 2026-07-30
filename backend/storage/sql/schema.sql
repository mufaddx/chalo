-- ============================================================================
-- Travel Marketplace — reference schema (validated against MySQL 8).
-- This file is a human-readable mirror of database/migrations/*.
-- It is not what the app runs off — Laravel migrations are the source of
-- truth — but it's useful for reviewing the whole schema in one place.
-- ============================================================================

SET NAMES utf8mb4;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(20) NULL,
  password VARCHAR(255) NULL,
  google_id VARCHAR(191) NULL,
  role ENUM('customer','agency','admin') NOT NULL DEFAULT 'customer',
  avatar_path VARCHAR(255) NULL,
  date_of_birth DATE NULL,
  gender ENUM('male','female','other') NULL,
  address VARCHAR(255) NULL,
  emergency_contact_name VARCHAR(150) NULL,
  emergency_contact_phone VARCHAR(20) NULL,
  email_verified_at TIMESTAMP NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY users_email_unique (email),
  KEY users_role_index (role)
) ENGINE=InnoDB;

CREATE TABLE agencies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  logo_path VARCHAR(255) NULL,
  cover_path VARCHAR(255) NULL,
  about TEXT NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(191) NULL,
  website VARCHAR(191) NULL,
  office_address VARCHAR(255) NULL,
  city VARCHAR(120) NULL,
  state VARCHAR(120) NULL,
  country VARCHAR(120) NULL DEFAULT 'India',
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  years_experience SMALLINT UNSIGNED NULL,
  social_links JSON NULL,
  status ENUM('pending','verified','rejected','suspended') NOT NULL DEFAULT 'pending',
  rejection_reason VARCHAR(255) NULL,
  verified_at TIMESTAMP NULL,
  rating_avg DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY agencies_slug_unique (slug),
  KEY agencies_status_index (status),
  CONSTRAINT agencies_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE agency_verifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agency_id BIGINT UNSIGNED NOT NULL,
  document_type ENUM('gst_certificate','pan_card','trade_license','other') NOT NULL,
  document_path VARCHAR(255) NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at TIMESTAMP NULL,
  remarks VARCHAR(255) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT agency_verifications_agency_id_foreign FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE CASCADE,
  CONSTRAINT agency_verifications_reviewed_by_foreign FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  icon VARCHAR(60) NULL,
  description VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY categories_slug_unique (slug)
) ENGINE=InnoDB;

CREATE TABLE destinations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  country VARCHAR(120) NOT NULL,
  image_path VARCHAR(255) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY destinations_slug_unique (slug)
) ENGINE=InnoDB;

CREATE TABLE tours (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agency_id BIGINT UNSIGNED NOT NULL,
  destination_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  duration_nights TINYINT UNSIGNED NOT NULL,
  duration_days TINYINT UNSIGNED NOT NULL,
  hotel_rating TINYINT UNSIGNED NOT NULL DEFAULT 3,
  transport JSON NOT NULL,
  meals_included TINYINT(1) NOT NULL DEFAULT 0,
  free_cancellation TINYINT(1) NOT NULL DEFAULT 0,
  instant_confirmation TINYINT(1) NOT NULL DEFAULT 0,
  highlights JSON NULL,
  inclusions JSON NULL,
  exclusions JSON NULL,
  things_to_carry JSON NULL,
  cancellation_policy TEXT NULL,
  status ENUM('draft','pending_approval','published','rejected','closed') NOT NULL DEFAULT 'draft',
  rejection_reason VARCHAR(255) NULL,
  approved_by BIGINT UNSIGNED NULL,
  approved_at TIMESTAMP NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  trending TINYINT(1) NOT NULL DEFAULT 0,
  views_count INT UNSIGNED NOT NULL DEFAULT 0,
  rating_avg DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY tours_slug_unique (slug),
  KEY tours_status_index (status),
  KEY tours_agency_id_index (agency_id),
  KEY tours_destination_id_index (destination_id),
  CONSTRAINT tours_agency_id_foreign FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE CASCADE,
  CONSTRAINT tours_destination_id_foreign FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE RESTRICT,
  CONSTRAINT tours_approved_by_foreign FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE tour_categories (
  tour_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (tour_id, category_id),
  CONSTRAINT tour_categories_tour_id_foreign FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE,
  CONSTRAINT tour_categories_category_id_foreign FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tour_images (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  path VARCHAR(255) NOT NULL,
  type ENUM('image','video') NOT NULL DEFAULT 'image',
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY tour_images_tour_id_index (tour_id),
  CONSTRAINT tour_images_tour_id_foreign FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE itinerary_days (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  day_number SMALLINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  meals JSON NULL,
  stay_name VARCHAR(180) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY itinerary_days_tour_day_unique (tour_id, day_number),
  CONSTRAINT itinerary_days_tour_id_foreign FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tour_dates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NULL,
  seats_total SMALLINT UNSIGNED NOT NULL,
  seats_available SMALLINT UNSIGNED NOT NULL,
  price_override DECIMAL(10,2) NULL,
  status ENUM('open','closed','full') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY tour_dates_tour_id_index (tour_id),
  KEY tour_dates_departure_date_index (departure_date),
  CONSTRAINT tour_dates_tour_id_foreign FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_number VARCHAR(20) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  tour_id BIGINT UNSIGNED NOT NULL,
  tour_date_id BIGINT UNSIGNED NOT NULL,
  agency_id BIGINT UNSIGNED NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(191) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_city VARCHAR(120) NULL,
  adults TINYINT UNSIGNED NOT NULL DEFAULT 1,
  children TINYINT UNSIGNED NOT NULL DEFAULT 0,
  special_request VARCHAR(500) NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('unpaid','partial','paid','refunded') NOT NULL DEFAULT 'unpaid',
  status ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  agency_notes VARCHAR(500) NULL,
  cancelled_reason VARCHAR(255) NULL,
  cancelled_at TIMESTAMP NULL,
  confirmed_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY bookings_booking_number_unique (booking_number),
  KEY bookings_user_id_index (user_id),
  KEY bookings_agency_id_index (agency_id),
  KEY bookings_status_index (status),
  CONSTRAINT bookings_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT bookings_tour_id_foreign FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE RESTRICT,
  CONSTRAINT bookings_tour_date_id_foreign FOREIGN KEY (tour_date_id) REFERENCES tour_dates (id) ON DELETE RESTRICT,
  CONSTRAINT bookings_agency_id_foreign FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE booking_travellers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  age TINYINT UNSIGNED NULL,
  gender ENUM('male','female','other') NULL,
  passport_number VARCHAR(40) NULL,
  is_lead_traveller TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT booking_travellers_booking_id_foreign FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  tour_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  agency_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  review_text TEXT NULL,
  images JSON NULL,
  status ENUM('published','hidden') NOT NULL DEFAULT 'published',
  agency_reply TEXT NULL,
  agency_replied_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY reviews_booking_id_unique (booking_id),
  KEY reviews_tour_id_index (tour_id),
  KEY reviews_agency_id_index (agency_id),
  CONSTRAINT reviews_booking_id_foreign FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE,
  CONSTRAINT reviews_tour_id_foreign FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE,
  CONSTRAINT reviews_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT reviews_agency_id_foreign FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE CASCADE,
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE TABLE wishlists (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  tour_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY wishlists_user_tour_unique (user_id, tour_id),
  CONSTRAINT wishlists_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT wishlists_tour_id_foreign FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE compare_tours (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  tour_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY compare_tours_user_tour_unique (user_id, tour_id),
  CONSTRAINT compare_tours_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT compare_tours_tour_id_foreign FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(80) NOT NULL,
  title VARCHAR(180) NOT NULL,
  body VARCHAR(500) NULL,
  data JSON NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  KEY notifications_user_id_index (user_id),
  CONSTRAINT notifications_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE support_tickets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  category ENUM('booking','payment','agency','technical','other') NOT NULL DEFAULT 'other',
  status ENUM('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  assigned_to BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY support_tickets_user_id_index (user_id),
  KEY support_tickets_status_index (status),
  CONSTRAINT support_tickets_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT support_tickets_assigned_to_foreign FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE support_ticket_replies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT support_ticket_replies_ticket_id_foreign FOREIGN KEY (ticket_id) REFERENCES support_tickets (id) ON DELETE CASCADE,
  CONSTRAINT support_ticket_replies_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE blogs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  excerpt VARCHAR(300) NULL,
  content LONGTEXT NOT NULL,
  cover_image VARCHAR(255) NULL,
  category ENUM('travel_tips','destination_guide','visa_articles','adventure') NOT NULL DEFAULT 'travel_tips',
  tags JSON NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  meta_title VARCHAR(180) NULL,
  meta_description VARCHAR(255) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY blogs_slug_unique (slug),
  CONSTRAINT blogs_author_id_foreign FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  content LONGTEXT NOT NULL,
  meta_title VARCHAR(180) NULL,
  meta_description VARCHAR(255) NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY pages_slug_unique (slug)
) ENGINE=InnoDB;

CREATE TABLE coupons (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL,
  type ENUM('flat','percent') NOT NULL DEFAULT 'percent',
  value DECIMAL(10,2) NOT NULL,
  min_booking_amount DECIMAL(10,2) NULL,
  max_discount DECIMAL(10,2) NULL,
  usage_limit INT UNSIGNED NULL,
  used_count INT UNSIGNED NOT NULL DEFAULT 0,
  valid_from DATE NULL,
  valid_until DATE NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  applicable_agency_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY coupons_code_unique (code),
  CONSTRAINT coupons_applicable_agency_id_foreign FOREIGN KEY (applicable_agency_id) REFERENCES agencies (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE banners (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NULL,
  image_path VARCHAR(255) NOT NULL,
  link_url VARCHAR(255) NULL,
  position ENUM('homepage_hero','homepage_secondary','category_page') NOT NULL DEFAULT 'homepage_hero',
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  starts_at TIMESTAMP NULL,
  ends_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL,
  value TEXT NULL,
  `group` VARCHAR(60) NOT NULL DEFAULT 'general',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY settings_key_unique (`key`)
) ENGINE=InnoDB;

CREATE TABLE activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  subject_type VARCHAR(100) NULL,
  subject_id BIGINT UNSIGNED NULL,
  description VARCHAR(255) NULL,
  properties JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  KEY activity_logs_user_id_index (user_id),
  KEY activity_logs_subject_index (subject_type, subject_id),
  CONSTRAINT activity_logs_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  gateway VARCHAR(20) NOT NULL DEFAULT 'sabpaisa',
  gateway_order_id VARCHAR(191) NOT NULL,
  gateway_payment_id VARCHAR(191) NULL,
  gateway_signature VARCHAR(255) NULL,
  checkout_url TEXT NULL,
  expires_at TIMESTAMP NULL,
  amount INT UNSIGNED NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  status ENUM('created','paid','failed','refunded') NOT NULL DEFAULT 'created',
  failure_reason TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY payments_gateway_order_id_unique (gateway_order_id),
  UNIQUE KEY payments_gateway_payment_id_unique (gateway_payment_id),
  KEY payments_booking_status_index (booking_id, status),
  CONSTRAINT payments_booking_id_foreign FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Laravel Sanctum's own table (token auth) — required for every login/register call to work.
CREATE TABLE personal_access_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tokenable_type VARCHAR(191) NOT NULL,
  tokenable_id BIGINT UNSIGNED NOT NULL,
  name TEXT NOT NULL,
  token VARCHAR(64) NOT NULL,
  abilities TEXT NULL,
  last_used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY personal_access_tokens_token_unique (token),
  KEY personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id),
  KEY personal_access_tokens_expires_at_index (expires_at)
) ENGINE=InnoDB;
