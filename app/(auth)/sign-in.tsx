import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [errors, setErrors] = React.useState({
        email: '',
        password: ''
    })

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            email: '',
            password: ''
        }

        if (!validateEmail(emailAddress)) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) return

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setIsLoading(false)
        }
    }, [isLoaded, emailAddress, password])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input, errors.email ? styles.inputError : null]}
                            value={emailAddress}
                            placeholder="Enter email"
                            placeholderTextColor="#666"
                            onChangeText={(text) => {
                                setEmailAddress(text)
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: '' }))
                                }
                            }}
                        />
                        {errors.email ? (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        ) : null}
                    </View>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input, errors.password ? styles.inputError : null]}
                            value={password}
                            placeholder="Enter password"
                            placeholderTextColor="#666"
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                setPassword(text)
                                if (errors.password) {
                                    setErrors(prev => ({ ...prev, password: '' }))
                                }
                            }}
                        />
                        {errors.password ? (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        ) : null}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onSignInPress}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/sign-up" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2A58BA',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    button: {
        backgroundColor: '#2A58BA',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    linkText: {
        color: '#2A58BA',
        fontSize: 14,
        fontWeight: '600',
    },
    inputWrapper: {
        marginBottom: 10,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginLeft: 4,
        marginBottom: 4,
        marginTop: -4
    },
    inputError: {
        borderColor: '#ff4444',
    },
})