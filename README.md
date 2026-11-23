# FixMate

## Project name

**FixMate** — a role-based home repair service marketplace.

## Purpose

FixMate connects customers with trusted local repair professionals. Customers can browse services, request repairs, manage bookings, and pay online. Technicians can manage their service listings and service requests, while admins can manage users, approve services, and monitor bookings, payments, and revenue.

## Live URL

[https://fixmateclient.vercel.app](https://fixmateclient.vercel.app)

## Demo admin credentials

| Role  | Email               | Password |
| ----- | ------------------- | -------- |
| Admin | `admin@fixmate.com` | `Abc123` |

Admin dashboard: `/dashboard/admin`

## Key features

- Role-based authentication with customer, technician, and admin dashboards
- Route protection and an unauthorized page for cross-role access attempts
- Public service marketplace with categories, service details, and repair requests
- Customer bookings, payment history, and profile management
- Technician service management with admin approval workflow and service requests
- Admin user management, role updates, service approval, bookings, transactions, and revenue overview
- Stripe checkout with success and cancel flows
- Safe post-login redirect to the originally requested page
- Responsive UI with Tailwind CSS, shadcn-style components, toasts, charts, and dark theme support

## Tech stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, tw-animate-css, shadcn-style components
- **Auth:** Better Auth with MongoDB adapter and JWT support
- **Database:** MongoDB
- **Payments:** Stripe
- **Icons:** Lucide React

## npm packages used

### Dependencies

| Package                      | Version    |
| ---------------------------- | ---------- |
| `@base-ui/react`             | `^1.9.0`   |
| `@better-auth/mongo-adapter` | `^1.7.26`  |
| `@shadcn/react`              | `^0.3.1`   |
| `@stripe/stripe-js`          | `^10.3.0`  |
| `better-auth`                | `^1.7.26`  |
| `class-variance-authority`   | `^0.7.1`   |
| `cmdk`                       | `^1.1.1`   |
| `cn`                         | `^0.5.2`   |
| `date-fns`                   | `^4.4.0`   |
| `embla-carousel-react`       | `^8.6.0`   |
| `input-otp`                  | `^1.5.0`   |
| `lucide-react`               | `^1.76.0`  |
| `mongodb`                    | `^7.9.0`   |
| `next`                       | `^16.4.6`  |
| `next-auth`                  | `^4.24.15` |
| `next-themes`                | `^0.4.6`   |
| `react`                      | `19.3.0`   |
| `react-day-picker`           | `^10.0.2`  |
| `react-dom`                  | `19.3.0`   |
| `react-resizable-panels`     | `^4.24.1`  |
| `recharts`                   | `^3.8.0`   |
| `shadcn`                     | `^4.23.0`  |
| `shiki`                      | `^4.6.0`   |
| `sonner`                     | `^2.0.8`   |
| `stripe`                     | `^23.2.0`  |
| `tw-animate-css`             | `^1.4.0`   |

### Dev dependencies

| Package                  | Version  |
| ------------------------ | -------- |
| `@tailwindcss/turbopack` | `4.3.3`  |
| `@types/node`            | `^20`    |
| `@types/react`           | `^19`    |
| `@types/react-dom`       | `^19`    |
| `eslint`                 | `^9`     |
| `eslint-config-next`     | `16.4.6` |
| `tailwindcss`            | `4.3.3`  |
| `typescript`             | `^5`     |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Required environment variables are defined in `.env`: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `NEXT_PUBLIC_IMGBB_KEY`, `NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
