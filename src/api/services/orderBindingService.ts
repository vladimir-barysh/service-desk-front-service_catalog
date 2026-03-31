import api from '../axios';
import { OrderBindingDTO } from '../dtos';

export const getOrderBindings = async (orderId: number | undefined) => {
    const { data } = await api.get(`/api/orderbinding/orders/${orderId}/files`);
    return data as OrderBindingDTO[];
};

export const downloadBinding = async (fileId: number) => {
    const response = await api.get(`/api/orderbinding/files/${fileId}`, {
        responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    window.open(url);

    window.URL.revokeObjectURL(url);
};

export const uploadBinding = async (
    orderId: number,
    file: File
) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
        `/api/orders/${orderId}/files`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data;
};