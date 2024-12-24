import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="classes" />
            <Stack.Screen name="classDetail" />
        </Stack >
    );
};

export default _layout