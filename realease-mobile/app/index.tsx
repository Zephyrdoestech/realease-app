// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // This makes login the first screen
  return <Redirect href="/login" />;
}