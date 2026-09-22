# Careflow Clinic Appointment System

A dependency-free browser prototype for the Clinic Appointment Management System described in the supplied SRS. It presents the staff-facing workflow as a polished operations console and keeps the data/API boundary easy to replace with an ASP.NET Core service.

## Run locally

No build tools are required. Open [index.html](index.html) in a browser.

The current environment did not have Node.js/npm or the .NET SDK installed, so this version intentionally uses plain HTML, CSS, and JavaScript. The UI is responsive and includes:

- Staff overview dashboard with daily metrics
- Today's live agenda
- Booking request queue
- Searchable upcoming appointments table
- New appointment modal and form interaction
- Responsive mobile layout
- Navigation states for appointments, patients, availability, and settings

## Planned API boundary

The intended production implementation is ASP.NET Core Web API + Entity Framework Core + SQL Server. [openapi.yaml](openapi.yaml) defines the first set of authentication, services, doctors, slots, and appointment endpoints. The UI's data arrays in [app.js](app.js) are the local seam to replace with `fetch()` calls.

## Project map

- [index.html](index.html): application structure and accessible controls
- [styles.css](styles.css): responsive visual system
- [app.js](app.js): local data, rendering, filtering, navigation, and modal behavior
- [openapi.yaml](openapi.yaml): API contract starter
- [docs/SRS.md](docs/SRS.md): concise implementation requirements and delivery increments

## Production next steps

1. Create the ASP.NET Core solution using the contract and domain model in `docs/SRS.md`.
2. Add ASP.NET Core Identity or an equivalent secure password hasher, JWT access tokens, refresh-token rotation, and role policies.
3. Implement transactional slot reservation with a unique constraint on active appointment slots.
4. Replace local data with authenticated API requests and add unit, integration, security, and acceptance tests.
