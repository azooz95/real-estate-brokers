// ============================================================================
// API client — thin fetch wrapper + typed endpoint stubs.
//
// >>> FOR CLAUDE CODE (backend) <<<
// Every function here currently resolves MOCK data from ../data/fixtures.js so
// the frontend runs standalone. Replace each mock branch with the real fetch()
// call (already written, just flip USE_MOCK to false and implement the routes).
//
// Domain model (see README for full ERD):
//   Project (community) 1───* Unit
//   Broker (marketer) — owns tracking links; attributed on each Reservation
//   Reservation: { client, unit, broker, deposit, status, paymentMethod }
//   Admin creates a tracking link → Broker shares it → Client reserves a Unit
//   → Reservation records BOTH client and attributed broker.
// ============================================================================

import * as mock from '../data/fixtures.js';

const USE_MOCK = false;
const BASE = '/api';

async function http(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status === 204 ? null : res.json();
}

const delay = (v, ms = 250) => new Promise((r) => setTimeout(() => r(v), ms));

export const api = {
  // ---- Auth (admin / marketer) ----
  // POST /api/auth/login  { email, password } -> { token, user }
  login: (body) => USE_MOCK ? delay(mock.session) : http('/auth/login', { method: 'POST', body }),
  // POST /api/auth/logout -> 204 (clears the session cookie)
  logout: () => USE_MOCK ? delay(null) : http('/auth/logout', { method: 'POST' }),
  // POST /api/auth/forgot { email } -> 204
  forgotPassword: (body) => USE_MOCK ? delay(null) : http('/auth/forgot', { method: 'POST', body }),
  // GET /api/auth/me -> { id, name, email, role }
  getMe: () => USE_MOCK ? delay(mock.session.user) : http('/auth/me'),
  // PUT /api/auth/account { currentPassword, newEmail?, newPassword? } -> { user }
  updateAccount: (body) => USE_MOCK ? delay({ user: mock.session.user }) : http('/auth/account', { method: 'PUT', body }),

  // ---- Catalog (client-facing) ----
  // GET /api/projects -> Project[]
  listProjects: () => USE_MOCK ? delay(mock.projects) : http('/projects'),
  // GET /api/projects/:id/units?type= -> Unit[]
  listUnits: (projectId, params = {}) =>
    USE_MOCK ? delay(mock.units) : http(`/projects/${projectId}/units?${new URLSearchParams(params)}`),
  // GET /api/units/:id -> Unit (full detail)
  getUnit: (unitId) => USE_MOCK ? delay(mock.unitDetail) : http(`/units/${unitId}`),
  // GET /api/brokers/:id -> { id, name, mobile } (public lookup for the "dedicated rep" banner)
  getBroker: (brokerId) => USE_MOCK ? delay(mock.brokers.find((b) => b.id === brokerId) ?? null) : http(`/brokers/${brokerId}`),

  // ---- Reservation flow ----
  // POST /api/reservations { unitId, brokerRef, client:{name,phone}, paymentMethod }
  //   -> Reservation { id, status:'confirmed', receiptUrl }
  // brokerRef comes from the tracking link the broker shared (?ref=ID-xxxx).
  createReservation: (body) =>
    USE_MOCK ? delay(mock.reservationResult) : http('/reservations', { method: 'POST', body }),
  // GET /api/reservations/:id -> Reservation (same shape as createReservation's result)
  getReservation: (id) => USE_MOCK ? delay(mock.reservationResult) : http(`/reservations/${id}`),

  // ---- Admin: marketers / brokers ----
  // GET /api/brokers -> Broker[]
  listBrokers: () => USE_MOCK ? delay(mock.brokers) : http('/brokers'),
  // POST /api/brokers { fullName, mobile } -> Broker { id, trackingUrl }
  createBroker: (body) => USE_MOCK ? delay(mock.brokers[0]) : http('/brokers', { method: 'POST', body }),
  // PATCH /api/brokers/:id { mobile?, status? } -> Broker (edit phone / suspend / reactivate)
  updateBroker: (id, body) => USE_MOCK ? delay({ id, ...body }) : http(`/brokers/${id}`, { method: 'PATCH', body }),
  // DELETE /api/brokers/:id -> 204
  deleteBroker: (id) => USE_MOCK ? delay(null) : http(`/brokers/${id}`, { method: 'DELETE' }),

  // ---- Admin: inventory & dashboard ----
  // GET /api/inventory -> Unit[]   GET /api/dashboard -> { kpis, activity, inventoryStatus }
  listInventory: () => USE_MOCK ? delay(mock.inventory) : http('/inventory'),
  // GET /api/inventory/:code -> rich unit detail (holder, gallery, timeline) for the override modal
  getUnitAdminDetail: (code) => USE_MOCK ? delay(mock.unitAdminDetail?.(code)) : http(`/inventory/${code}`),
  getDashboard: () => USE_MOCK ? delay(mock.dashboard) : http('/dashboard'),
  // PATCH /api/units/:code/status { status, reason } -> Unit   (admin holds / releases a unit)
  setUnitStatus: (code, status, reason) =>
    USE_MOCK ? delay({ code, status }) : http(`/units/${code}/status`, { method: 'PATCH', body: { status, reason } }),

  // ---- Admin: transactions ----
  // GET /api/transactions -> Reservation[] (audit ledger)
  listTransactions: () => USE_MOCK ? delay(mock.transactions) : http('/transactions'),

  // ---- Admin: settings ----
  // GET /api/settings -> Settings   PUT /api/settings { ... } -> Settings
  getSettings: () => USE_MOCK ? delay(mock.settings) : http('/settings'),
  saveSettings: (body) => USE_MOCK ? delay(body) : http('/settings', { method: 'PUT', body }),
};
