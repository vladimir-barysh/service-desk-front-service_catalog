import api from './axios';
import { components } from '../types/api';

type ApproveUserResponse = components['schemas']['ApproveUserResponseDTO'];
type ApproveUserUpdateRequest = components['schemas']['ApproveUserUpdateRequestDTO'];
type ApproveUserUpdateIgnoredRequest = components['schemas']['ApproveUserUpdateIgnoredRequestDTO'];

export const approveUserApi = {
    getByApproveId: (approveId: number): Promise<ApproveUserResponse[]> =>
        api.get(`/api/approveuser?approveId=${approveId}`).then(res => res.data),
    getByOrderId: (orderId: number): Promise<ApproveUserResponse[]> =>
        api.get(`/api/approveuser/by-order?orderId=${orderId}`).then(res => res.data),
    updateSelf: (approveId: number, data: ApproveUserUpdateRequest): Promise<ApproveUserResponse> =>
        api.patch(`/api/approveuser/${approveId}/self`, data ).then(res => res.data),
    updateIgnored: (id: number, data: ApproveUserUpdateIgnoredRequest): Promise<ApproveUserResponse> =>
        api.patch(`/api/approveuser/${id}/ignore`, data ).then(res => res.data),
};