import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen name="classes" options={{ headerShown: false }} />
            <Stack.Screen name="classDetail" options={{ headerShown: false }} />
        </Stack>
    );
};

export default _layout