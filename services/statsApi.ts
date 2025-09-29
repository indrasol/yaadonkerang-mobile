// services/statsApi.ts
import Constants from 'expo-constants';

const getApiBaseUrl = () => {
    console.log('Environment variable EXPO_PUBLIC_API_BASE_URL:', process.env.EXPO_PUBLIC_API_BASE_URL);

    if (process.env.EXPO_PUBLIC_API_BASE_URL) {
        return process.env.EXPO_PUBLIC_API_BASE_URL;
    }
    return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

export interface StatsResponse {
    total_users: number;
    total_memories: number;
    last_updated: string;
}

export class StatsAPI {
    static async getStats(): Promise<StatsResponse> {
        try {
            const url = `${API_BASE_URL}/api/v1/stats/`;
            console.log('Fetching stats from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: StatsResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            // Return fallback values
            return {
                total_users: 20,
                total_memories: 108,
                last_updated: new Date().toISOString()
            };
        }
    }

    static formatNumber(num: number): string {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M+`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K+`;
        }
        return num.toString();
    }

    static formatDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Recently';
        }
    }
}