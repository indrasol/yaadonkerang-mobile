// utils/errorHandler.ts

/**
 * Safely extracts error message from unknown error type
 */
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    } else if (typeof error === 'string') {
        return error;
    } else if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    } else if (error && typeof error === 'object' && 'statusText' in error) {
        return String(error.statusText);
    }
    return 'Unknown error occurred';
};

/**
 * Logs error with context
 */
export const logError = (error: unknown, context?: string): void => {
    const errorMessage = getErrorMessage(error);
    if (context) {
        console.error(`[${context}]`, errorMessage, error);
    } else {
        console.error(errorMessage, error);
    }
};