# DevChat Backend

## Setup Instructions

1. Copy `application-example.properties` to `application.properties`
2. Update the database credentials in `application.properties`:
    - `spring.datasource.url`
    - `spring.datasource.username`
    - `spring.datasource.password`
3. Set superadmin credentials:
    - `superadmin.email`
    - `superadmin.password`

## Environment Variables (Alternative)

You can also use environment variables:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SUPERADMIN_EMAIL`
- `SUPERADMIN_PASSWORD`