# Careflow implementation brief

## Product

Careflow is a clinic appointment management system for patients, staff, doctors, and administrators. The supplied SRS defines the complete target system. This brief turns it into an incremental delivery plan.

## Increment 1: Operations console

- Staff dashboard for daily appointment operations.
- Appointment request queue and searchable schedule.
- Responsive desktop/mobile experience.
- Local mock data with a replaceable API boundary.

## Increment 2: Identity and core data

- ASP.NET Core Web API, EF Core, and SQL Server.
- Users, roles, patients, doctors, services, availability, slots, appointments, consultation, appointment history, and refresh tokens.
- JWT access tokens, refresh-token rotation, secure password hashing, rate limiting, validation, and centralized exception handling.

## Increment 3: Booking integrity

- Appointment state machine: `REQUESTED`, `CONFIRMED`, `RESCHEDULED`, `CANCELLED`, `IN_PROGRESS`, `COMPLETED`, `REJECTED`, and `NO_SHOW`.
- Transactional slot reservation.
- Unique active booking constraint and concurrency handling.
- Audit trail for all appointment state changes.

## Increment 4: Delivery quality

- Unit tests for state transitions and policies.
- Integration tests for booking concurrency and authorization.
- API/system tests for patient and staff journeys.
- Security tests for authentication, authorization, password handling, token expiry, and sensitive data exposure.
- Acceptance tests for registration, booking, cancellation, rescheduling, consultation, and completion.

## Core access rules

Patients can only read or mutate their own patient profile and appointments. Staff can operate appointments according to assigned policy. Doctors can access consultations for their appointments. Administrators manage users, services, doctors, and availability. The API must enforce these rules server-side regardless of frontend state.

## Acceptance criteria for the first slice

- The app opens directly in a useful staff dashboard.
- The schedule, request queue, and appointment table render without external services.
- Patient search filters the table.
- The new appointment action opens a validated form and returns to the dashboard after submission.
- Navigation controls update the page context.
- Layout remains usable at desktop and mobile widths.
