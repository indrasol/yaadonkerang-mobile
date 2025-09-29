// services/colorizationApi.ts
import { getErrorMessage, logError } from '@/utils/errorHandler';
import { apiBaseUrl } from '@/config';

// const API_BASE_URL = "https://rangmantra-gmg4dvardeddfzay.eastus-01.azurewebsites.net";

export const ColorizationAPI = {
    uploadImage: async (imageUri: string): Promise<{ request_id: string }> => {
        try {
            const fileInfo = {
                uri: imageUri,
                name: `photo_${Date.now()}.jpg`,
                type: 'image/jpeg',
            };

            const formData = new FormData();
            formData.append('file', fileInfo as any);

            const response = await fetch(`${apiBaseUrl}/colorize`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed with status: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            // Re-throw with proper typing
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(String(error));
        }
    },

    checkStatus: async (requestId: string): Promise<any> => {
        try {
            const response = await fetch(`${apiBaseUrl}/status/${requestId}`);

            if (!response.ok) {
                throw new Error(`Status check failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(String(error));
        }
    },
};