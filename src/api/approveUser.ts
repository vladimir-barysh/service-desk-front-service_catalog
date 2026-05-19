import api from './axios';
import { components } from '../types/api';

type ApproveUserResponse = components['schemas']['ApproveUserResponseDTO'];

export const approveUserApi = {
    getByApproveId: (approveId: number): Promise<ApproveUserResponse[]> =>
        api.get(`/api/approveuser?approveId=${approveId}`).then(res => res.data),
};