import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href={'/'} />
    }

    return <Stack
        screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' },
            animation: 'fade',
        }}
    >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
    </Stack>
}