# API Instructions (Endpoints Only)

Base path is included in `BASE_URL` (should point to `/rest/v1`).

## Auth
- `POST /admin/login`
- `POST /buyer/login`
- `POST /seller/login`
- `GET /refresh`
- `POST /logout`

## Accounts
- `POST /account` (register)
- `GET /account` (admin list or by id in body)
- `PUT /account` (update self)
- `PATCH /account/:id/activate` (admin activate)
- `DELETE /account/:id` (admin deactivate)
- `DELETE /account` (self delete)

## Properties
- `POST /properties`
- `GET /properties`
- `GET /properties/:id`
- `PATCH /properties/:id`
- `DELETE /properties/:id`

## Inquiries
- `POST /properties/:id/inquiries`
- `GET /properties/:id/inquiries`
- `PATCH /properties/:id/inquiries/:inquiryId/contact`
- `PATCH /properties/:id/inquiries/:inquiryId/reschedule-request`
- `PATCH /properties/:id/inquiries/:inquiryId/close`
