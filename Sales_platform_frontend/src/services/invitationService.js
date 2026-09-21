import api from "./api";

export const createInvitation = (data) =>
  api.post("/api/admin/invitations", data);

export const getInvitationById = (id) =>
  api.get(`/api/admin/invitations/${id}`);

export const getInvitationsByManager = (managerId) =>
  api.get(`/api/admin/invitations/manager/${managerId}`);

export const updateInvitationStatus = (id, status) =>
  api.put(`/api/admin/invitations/${id}/status`, null, {
    params: { status },
  });

