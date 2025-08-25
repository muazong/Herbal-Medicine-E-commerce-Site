# Herbal Medicine E-commerce Site

---

### Frontend

Tech: Next.js

- Client:
  - [ ] Login page
  - [ ] Home page
  - [ ] Products page
  - [ ] Contact page
  - [ ] About page
- Admin:

### Backend

Tech: NestJS

- [ ] Auth
- [ ] Users
- [ ] Products

### Database

Tech: PostgreSQL

#### Tables

1. Users

| Attribute  | Data Type         | Description                                |
| ---------- | ----------------- | ------------------------------------------ |
| id         | UUID              | Primary key, unique for each user          |
| username   | VARCHAR(50)       | Login name, unique                         |
| email      | VARCHAR(100)      | User email, unique                         |
| password   | VARCHAR(255)      | Password (hashed)                          |
| full_name  | VARCHAR(100)      | Full name of the user                      |
| avatar     | VARCHAR           | User's avatar URL                          |
| role       | ENUM              | User role (Admin, User, Moderator, etc.)   |
| status     | ENUM              | Account status (active, blocked, inactive) |
| created_at | TIMESTAMP WITH TZ | Date the user was created                  |
| updated_at | TIMESTAMP WITH TZ | Date the user was last updated             |

2. Carts

| Attribute  | Data Type         | Description                        |
| ---------- | ----------------- | ---------------------------------- |
| id         | UUID              | Primary key, unique for each cart  |
| user_id    | UUID              | Reference to the user (one-to-one) |
| created_at | TIMESTAMP WITH TZ | Date the cart was created          |
| updated_at | TIMESTAMP WITH TZ | Date the cart was last updated     |

3. Cart Items

| Attribute  | Data Type         | Description                         |
| ---------- | ----------------- | ----------------------------------- |
| id         | UUID              | Primary key for each cart item      |
| cart_id    | UUID              | Reference to the cart               |
| product_id | UUID              | Reference to the product            |
| quantity   | INT               | Quantity of the product in the cart |
| added_at   | TIMESTAMP WITH TZ | Date item was added                 |

4. Products

| Attribute   | Data Type         | Description                                        |
| ----------- | ----------------- | -------------------------------------------------- |
| id          | UUID              | Primary key, unique for each product               |
| category_id | UUID              | Reference to category (many products → 1 category) |
| name        | VARCHAR(100)      | Product name                                       |
| description | TEXT              | Optional description                               |
| price       | NUMERIC(10,2)     | Product price                                      |
| stock       | INT               | Available quantity                                 |
| created_at  | TIMESTAMP WITH TZ | Date product was created                           |
| updated_at  | TIMESTAMP WITH TZ | Date product was last updated                      |

5. Categories

| Attribute   | Data Type         | Description                      |
| ----------- | ----------------- | -------------------------------- |
| id          | UUID              | Primary key, unique for category |
| name        | VARCHAR(100)      | Category name                    |
| description | TEXT              | Optional description             |
| created_at  | TIMESTAMP WITH TZ | Date category was created        |
| updated_at  | TIMESTAMP WITH TZ | Date category was last updated   |

6. Comments

| Attribute         | Data Type         | Description                                |
| ----------------- | ----------------- | ------------------------------------------ |
| id                | UUID              | Primary key, unique for each comment       |
| product_id        | UUID              | Reference to the product                   |
| user_id           | UUID              | Reference to the user who made the comment |
| content           | TEXT              | Comment text                               |
| rating            | INT               | Optional rating (1-5 stars)                |
| created_at        | TIMESTAMP WITH TZ | Date the comment was created               |
| updated_at        | TIMESTAMP WITH TZ | Date the comment was last updated          |
| parent_comment_id | UUID              | Optional, for threaded replies             |

7. Orders

| Attribute    | Data Type         | Description                                              |
| ------------ | ----------------- | -------------------------------------------------------- |
| id           | UUID              | Primary key, unique for each order                       |
| user_id      | UUID              | Reference to the user who placed the order               |
| total_amount | NUMERIC(10,2)     | Total price of the order                                 |
| status       | ENUM              | Order status (pending, processing, completed, cancelled) |
| created_at   | TIMESTAMP WITH TZ | Date the order was created                               |
| updated_at   | TIMESTAMP WITH TZ | Date the order was last updated                          |

8. Order Items

| Attribute  | Data Type     | Description                           |
| ---------- | ------------- | ------------------------------------- |
| id         | UUID          | Primary key for each order item       |
| order_id   | UUID          | Reference to the order                |
| product_id | UUID          | Reference to the product              |
| quantity   | INT           | Quantity of the product               |
| price      | NUMERIC(10,2) | Price of the product at time of order |

9. User Order History

| Attribute    | Data Type         | Description                                               |
| ------------ | ----------------- | --------------------------------------------------------- |
| id           | UUID              | Primary key, unique for each record                       |
| user_id      | UUID              | Reference to the user                                     |
| order_id     | UUID              | Reference to the order                                    |
| product_id   | UUID              | Reference to the product                                  |
| quantity     | INT               | Quantity of the product in the order                      |
| price        | NUMERIC(10,2)     | Price of the product at the time of order                 |
| status       | ENUM              | Status of the product in the order (completed, cancelled) |
| purchased_at | TIMESTAMP WITH TZ | Date the product was purchased / order completed          |

10. Product Images

| Attribute  | Data Type         | Description              |
| ---------- | ----------------- | ------------------------ |
| id         | UUID              | Primary key              |
| product_id | UUID              | Reference to the product |
| url        | VARCHAR           | Image URL                |
| alt_text   | VARCHAR           | Optional description     |
| created_at | TIMESTAMP WITH TZ | Date added               |
