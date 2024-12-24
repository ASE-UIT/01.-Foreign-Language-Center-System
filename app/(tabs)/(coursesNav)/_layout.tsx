import React from 'react'
import { Stack } from 'expo-router';

const _layout = () => {
    return (
        <Stack screenOptions={{
           headerShown:false
        }
            
        }>
            <Stack.Screen name='index' options={{
                title:'Danh sách khóa học',
            }}/>
            <Stack.Screen name='(courseDetails)/[id]'/>


        </Stack>
       
    )
}

export default _layout