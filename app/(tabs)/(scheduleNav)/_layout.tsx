import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen name="schedule" options={{ headerShown: false }} />
        </Stack>
    )
}

export default _layout