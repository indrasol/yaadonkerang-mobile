import React from 'react';

// RootStackParamList provides the route names used across the app for typing
export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Upload: undefined;
};

/**
 * Minimal AppNavigator placeholder
 *
 * Notes:
 * - This project uses `expo-router` and defines a root Stack in `app/_layout.tsx`.
 * - Several files import `RootStackParamList` and the default `AppNavigator` module.
 * - To keep the runtime simple and avoid duplicate NavigationContainers, this
 *   file exports a no-op component (you can replace it with an actual nested
 *   navigator later if desired).
 */
const AppNavigator: React.FC = () => {
  return null;
};

export default AppNavigator;
