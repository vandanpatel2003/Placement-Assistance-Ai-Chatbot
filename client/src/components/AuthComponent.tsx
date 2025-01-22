import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../services/api'
import Logo from '../assets/logo.png'

export default function AuthComponent() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { login } = useAuth()

    async function onSubmit(event: React.FormEvent, type: 'login' | 'register') {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData(event.target as HTMLFormElement)
            const data = Object.fromEntries(formData)

            let response
            if (type === 'login') {
                response = await loginUser(data.email as string, data.password as string)
            } else {
                response = await registerUser(
                    data.name as string,
                    data.email as string,
                    data.password as string
                )
            }

            login(response.token)
            navigate('/chat')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Tabs defaultValue="login" className="w-[400px]">
                <div>
                    <img src={Logo} alt={'parul logo'}/>
                </div>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                {error && (
                    <div className="mt-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Enter your email and password to login to your account.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={(e) => onSubmit(e, 'login')}>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" required />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Create a new account to get started.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={(e) => onSubmit(e, 'register')}>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" type="text" required />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" required />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creating account..." : "Create account"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}