import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen name="mycourse" options={{ headerShown: false }} />
            <Stack.Screen name="(myCourseDetails)" options={{ headerShown: false }} />
        </Stack>
    )
}

export default _layout