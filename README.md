# FixMate: Smart Device & Home Appliance Repair Service Platform

FixMate connects customers with trusted repair technicians. Customers browse approved services and request a repair, technicians manage services and jobs, and admins moderate the whole platform. Payment is done online with Stripe after the job is completed.

- **Live site:** https://fixmate-client-nine.vercel.app
- **Server API:** https://fixmate-server-theta.vercel.app
- **Client repo:** https://github.com/aahaabiib/fixmate-client
- **Server repo:** https://github.com/aahaabiib/fixmate-server

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | fixmate@admin.com | `Admin@123` |
| Technician | rafiq.tech@fixmate.dev | `Tech@custom` |
| Technician | nusrat.tech@fixmate.dev | `Tech@custom` |
| Technician | tanvir.tech@fixmate.dev | `Tech@custom` |
| Customer | sadia.customer@fixmate.dev | `Tech@custom` |
| Customer | imran.customer@fixmate.dev | `Tech@custom` |

These are demo accounts with demo data. Seeded transaction IDs are not real Stripe payments.

**Stripe test card:** `4242 4242 4242 4242`, any future expiry date, any CVC.

## Key Features

- Three roles (customer, technician, admin) with a separate dashboard and role-protected routes
- Sign up allows only customer or technician. The admin role is blocked on the server too
- Public services page with server-side search, category and mode filter, sort and pagination
- Technicians add services with image upload (ImgBB). Every new or edited service needs admin approval
- Job pipeline enforced on the server: requested, accepted, in-progress, completed (or rejected / cancelled)
- Duplicate active requests are blocked. A technician cannot request their own service
- Stripe Checkout payment only for completed and unpaid jobs, with a webhook that never saves a payment twice
- Admin can manage users and roles, approve or reject services, view all bookings and transactions
- Profile page with photo upload
- Light and dark mode, loading skeletons, custom 404 page, error boundary, toasts, empty states and confirmation modals
- Fully responsive layout

## Tech Stack

**Client:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, BetterAuth, MongoDB
**Server:** Express, MongoDB, JWT (jose), Stripe
**Deploy:** Vercel (client and server)

## npm Packages

**Client:** `next`, `react`, `react-dom`, `better-auth`, `mongodb`, `@vercel/functions`, `tailwindcss`, `shadcn/ui` (Radix UI), `next-themes`, `sonner`, `recharts`, `lucide-react`

**Server:** `express`, `mongodb`, `jose`, `cors`, `dotenv`, `stripe`



## Environment Variables

Never commit real secrets.