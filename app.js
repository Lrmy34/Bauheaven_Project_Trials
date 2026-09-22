const appointments = [
  { patient: 'Maya Thompson', initials: 'MT', avatar: 'avatar-peach', doctor: 'Dr. Elena Ruiz', service: 'General consultation', time: '09:00 AM', date: 'Today, 09:00 AM', status: 'Confirmed', statusClass: 'status-confirmed' },
  { patient: 'James Wilson', initials: 'JW', avatar: 'avatar-slate', doctor: 'Dr. Marcus Chen', service: 'Follow-up visit', time: '09:30 AM', date: 'Today, 09:30 AM', status: 'In progress', statusClass: 'status-progress' },
  { patient: 'Sofia Patel', initials: 'SP', avatar: 'avatar-yellow', doctor: 'Dr. Elena Ruiz', service: 'Dental consultation', time: '10:15 AM', date: 'Today, 10:15 AM', status: 'Confirmed', statusClass: 'status-confirmed' },
  { patient: 'Noah Williams', initials: 'NW', avatar: 'avatar-lilac', doctor: 'Dr. Marcus Chen', service: 'General consultation', time: '11:00 AM', date: 'Today, 11:00 AM', status: 'Awaiting confirmation', statusClass: 'status-pending' },
  { patient: 'Olivia Brown', initials: 'OB', avatar: 'avatar-peach', doctor: 'Dr. Elena Ruiz', service: 'Follow-up visit', time: '12:30 PM', date: 'Today, 12:30 PM', status: 'Confirmed', statusClass: 'status-confirmed' }
];
const requests = [
  { patient: 'Noah Williams', initials: 'NW', avatar: 'avatar-lilac', detail: 'General consultation', time: '12 min ago' },
  { patient: 'Ethan Davis', initials: 'ED', avatar: 'avatar-slate', detail: 'Dental consultation', time: '28 min ago' },
  { patient: 'Grace Miller', initials: 'GM', avatar: 'avatar-yellow', detail: 'Follow-up visit', time: '41 min ago' }
];
const avatar = item => `<span class="avatar ${item.avatar}">${item.initials}</span>`;
function renderAgenda() {
  document.querySelector('#agenda-list').innerHTML = appointments.slice(0, 4).map(item => `<div class="agenda-row"><span class="agenda-time">${item.time}</span><div class="agenda-person">${avatar(item)}<span><strong>${item.patient}</strong><small>${item.doctor}</small></span></div><span class="appointment-type">${item.service}</span></div>`).join('');
}
function renderRequests() {
  document.querySelector('#request-list').innerHTML = requests.map(item => `<div class="request-row">${avatar(item)}<span class="request-info"><strong>${item.patient}</strong><small>${item.detail}</small></span><span class="request-time">${item.time}</span></div>`).join('');
}
function renderTable(query = '') {
  const filtered = appointments.filter(item => item.patient.toLowerCase().includes(query.toLowerCase()));
  document.querySelector('#appointment-table').innerHTML = filtered.map(item => `<tr><td><div class="patient-cell">${avatar(item)}<strong>${item.patient}</strong></div></td><td class="doctor-cell">${item.doctor}</td><td class="service-cell">${item.service}</td><td>${item.date}</td><td><span class="status ${item.statusClass}">${item.status}</span></td><td><button class="row-menu" type="button" aria-label="More options">•••</button></td></tr>`).join('') || '<tr><td colspan="6">No appointments found.</td></tr>';
}
function setView(view) {
  const labels = { overview: ['Overview', 'Good morning, Alex.', 'Here is what needs your attention today.'], appointments: ['Appointments', 'Appointment schedule.', 'Keep every visit moving with confidence.'], patients: ['Patients', 'Patient directory.', 'A clear view of the people in your care.'], availability: ['Availability', 'Doctor availability.', 'Manage consultation capacity at a glance.'], settings: ['Settings', 'Workspace settings.', 'Configure your clinic operations.'] };
  const [label, title, subtitle] = labels[view] || labels.overview;
  document.querySelector('#page-label').textContent = label;
  document.querySelector('#view-title').textContent = title;
  document.querySelector('#view-subtitle').textContent = subtitle;
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('is-active', item.dataset.view === view));
  if (view !== 'overview') document.querySelector('.page-wrap').scrollIntoView({ behavior: 'smooth' });
}
function openModal() { document.querySelector('#modal').hidden = false; document.querySelector('input[name="patient"]').focus(); }
function closeModal() { document.querySelector('#modal').hidden = true; }
renderAgenda(); renderRequests(); renderTable();
document.querySelectorAll('[data-view]').forEach(item => item.addEventListener('click', () => setView(item.dataset.view)));
document.querySelector('#appointment-search').addEventListener('input', event => renderTable(event.target.value));
document.querySelector('#new-appointment').addEventListener('click', openModal);
document.querySelector('#modal-close').addEventListener('click', closeModal);
document.querySelector('#modal').addEventListener('click', event => { if (event.target.id === 'modal') closeModal(); });
document.querySelector('#appointment-form').addEventListener('submit', event => { event.preventDefault(); closeModal(); const button = document.querySelector('#new-appointment'); button.innerHTML = '<span>✓</span> Request added'; setTimeout(() => { button.innerHTML = '<span>+</span> New appointment'; }, 2200); });
