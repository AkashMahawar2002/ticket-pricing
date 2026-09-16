# Solution Reasoning — Ticket Pricing Engine

## 1. Problem Understanding

The application is designed to solve a real-world multiplex ticket pricing problem where the final amount depends on multiple independent factors:

- Multiple cinemas, screens, movies, and shows
- Different ticket tiers such as Silver, Gold, and Recliner
- Different prices for each ticket tier
- Limited inventory and sold-out ticket classes
- Festival discount
- Membership-based percentage discount with a maximum cap
- Per-ticket convenience fee
- GST
- Exact monetary calculations down to the paisa
- A clear line-by-line billing breakdown
- User authentication and booking history
- Importing and cleaning a messy seat-class price list

The main goal is to keep pricing correct, predictable, and independent from the user interface.

---

## 2. Overall Design Approach

I used a modular monolith architecture.

The application is divided into:

```text
Frontend
   ↓
API / Controllers
   ↓
Application Services
   ↓
Domain Logic
   ↓
Repositories / Database Models
   ↓
MongoDB