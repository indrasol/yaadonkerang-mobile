import { apiBaseUrl } from '@/config';
import { supabase } from './supabaseClient';
import { detectDevice } from '@/lib/detectDevice';


export interface ColorizeResponse {
    request_id: string;
    status: 'processing' | 'complete' | 'failed';
    original_url?: string;
    colorized_url?: string;
    error_message?: string;
    created_at: string;
    updated_at: string;
}

export interface UploadResponse {
    request_id: string;
    status: 'processing';
    original_url: string;
    created_at: string;
}

export interface EphemeralResponse {
    original_base64: string;
    colorized_base64: string;
    expires_in: number;
}

export class ColorizationAPI {
    private static async getAuthHeaders(): Promise<HeadersInit> {
        const { data: { session } } = await supabase.auth.getSession();

        return {
            'Authorization': `Bearer ${session?.access_token || ''}`,
        };
    }

    static async uploadImage(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        // Get user info from Supabase
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        formData.append('user_id', user.id);
        formData.append('user_email', user.email || '');

        const headers = await this.getAuthHeaders();

        const response = await fetch(`${apiBaseUrl}/api/v1/colorize/upload`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Upload failed: ${response.status}`);
        }

        return response.json();
    }

    static async getStatus(requestId: string): Promise<ColorizeResponse> {
        const headers = await this.getAuthHeaders();

        const response = await fetch(`${apiBaseUrl}/api/v1/colorize/status/${requestId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Status check failed: ${response.status}`);
        }

        return response.json();
    }

    static async pollStatus(
        requestId: string,
        onUpdate: (status: ColorizeResponse) => void,
        onComplete: (result: ColorizeResponse) => void,
        onError: (error: string) => void,
        intervalMs: number = 1000,
        maxRetries: number = 60, // 60 attempts = 1 minute max
        timeoutMs: number = 60000 // 60 seconds total timeout
    ): Promise<void> {
        let retryCount = 0;
        const startTime = Date.now();

        const poll = async () => {
            try {
                // Check timeout
                if (Date.now() - startTime > timeoutMs) {
                    onError('Colorization timeout: Process took too long');
                    return;
                }

                // Check retry limit
                if (retryCount >= maxRetries) {
                    onError('Colorization timeout: Maximum retries reached');
                    return;
                }

                retryCount++;
                const status = await this.getStatus(requestId);
                onUpdate(status);

                if (status.status === 'complete') {
                    onComplete(status);
                    return;
                }

                if (status.status === 'failed') {
                    onError(status.error_message || 'Colorization failed');
                    return;
                }

                // Continue polling with timeout and retry checks
                setTimeout(poll, intervalMs);
            } catch (error) {
                onError(error instanceof Error ? error.message : 'Status check failed');
            }
        };

        poll();
    }

    /**
     * Colorizes an image for ephemeral (non-persistent) use.
     * @param file - React Native file object: { uri, name, type }
     * @returns EphemeralResponse
     */
    static async colorizeEphemeral(file: { uri: string; name: string; type: string }): Promise<EphemeralResponse> {
        if (!file || !file.uri || !file.name || !file.type) {
            throw new Error('Invalid file object. Must have uri, name, and type.');
        }
        const formData = new FormData();
        formData.append('file', file as any);
        formData.append('platform', detectDevice());

        // Attach user metadata if logged in
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.id) formData.append('user_id', user.id);
            if (user?.email) formData.append('user_email', user.email);
        } catch (_) { }

        const headers = await this.getAuthHeaders();

        const response = await fetch(`${apiBaseUrl}/api/v1/colorize/ephemeral`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Colorization failed: ${response.status}`);
        }

        return response.json();
    }
}
