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
const API_BASE_URL = window.CAREFLOW_API_URL || 'http://localhost:5000';
const API_TIMEOUT_MS = 5000;
let dataSource = 'demo data';
function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  return fetch(`${API_BASE_URL}${path}`, { ...options, signal: controller.signal, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
    .finally(() => clearTimeout(timeout));
}
async function loadAppointmentsFromApi() {
  try {
    const response = await apiRequest('/api/appointments');
    if (!response.ok) throw new Error(`Appointments request failed with ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error('Appointments response must be an array');
    appointments.splice(0, appointments.length, ...payload.map(item => ({
      patient: item.patient?.name || item.patientName || 'Unknown patient',
      initials: item.patient?.initials || (item.patientName || 'UP').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
      avatar: item.avatar || 'avatar-slate',
      doctor: item.doctor?.name || item.doctorName || 'Unassigned doctor',
      service: item.service?.name || item.serviceName || 'Clinic consultation',
      time: item.time || new Date(item.startTime || item.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: item.date || new Date(item.startTime || item.requestedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      status: item.status || 'Requested',
      statusClass: item.statusClass || (item.status === 'CONFIRMED' ? 'status-confirmed' : 'status-pending')
    })));
    dataSource = 'connected API';
    renderAgenda(); renderTable(document.querySelector('#appointment-search').value);
    updateConnectionLabel();
  } catch (error) {
    console.info('Careflow API unavailable; using demo data.', error.message);
    updateConnectionLabel();
  }
}
function updateConnectionLabel() {
  const note = document.querySelector('.footer-note');
  if (note) note.innerHTML = `Careflow operations console <span>•</span> ${dataSource} <span>•</span> Last synced just now`;
}
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
renderAgenda(); renderRequests(); renderTable(); updateConnectionLabel(); loadAppointmentsFromApi();
document.querySelectorAll('[data-view]').forEach(item => item.addEventListener('click', () => setView(item.dataset.view)));
document.querySelector('#appointment-search').addEventListener('input', event => renderTable(event.target.value));
document.querySelector('#new-appointment').addEventListener('click', openModal);
document.querySelector('#modal-close').addEventListener('click', closeModal);
document.querySelector('#modal').addEventListener('click', event => { if (event.target.id === 'modal') closeModal(); });
document.querySelector('#appointment-form').addEventListener('submit', async event => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const button = document.querySelector('#new-appointment');
  button.innerHTML = '<span>…</span> Saving';
  try {
    const response = await apiRequest('/api/appointments', { method: 'POST', body: JSON.stringify({ patientName: formData.get('patient'), serviceName: formData.get('service'), date: formData.get('date'), time: formData.get('time') }) });
    if (!response.ok) throw new Error(`Appointment request failed with ${response.status}`);
    closeModal();
    button.innerHTML = '<span>✓</span> Request added';
    loadAppointmentsFromApi();
  } catch (error) {
    closeModal();
    button.innerHTML = '<span>✓</span> Saved locally';
    console.info('Appointment API unavailable; request was not sent.', error.message);
  }
  setTimeout(() => { button.innerHTML = '<span>+</span> New appointment'; }, 2200);
});
