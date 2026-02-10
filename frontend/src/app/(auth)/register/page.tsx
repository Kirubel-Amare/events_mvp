"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Chrome, Github, CheckCircle, Loader2, Calendar, Users, Shield } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordScore, setPasswordScore] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user" as "user" | "organizer" | "admin",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Already logged in!")
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy")
      return
    }

    if (passwordScore < 2) {
      toast.error("Please use a stronger password")
      return
    }

    try {
      await register(formData)
      toast.success("Account created successfully!")
      router.push("/")
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Check username availability
    if (name === "username" && value.length >= 3) {
      checkUsernameAvailability(value)
    }

    // Calculate password strength
    if (name === "password") {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    setPasswordScore(score)
  }

  const checkUsernameAvailability = async (username: string) => {
    setCheckingUsername(true)
    // Simulate API call
    setTimeout(() => {
      const unavailableUsernames = ["admin", "test", "user", "demo", "eventhub"]
      const isAvailable = !unavailableUsernames.includes(username.toLowerCase())
      setUsernameAvailable(isAvailable)
      setCheckingUsername(false)
    }, 500)
  }

  const handleSocialRegister = (provider: string) => {
    toast.error(`${provider} registration not implemented yet`)
  }

  const benefits = [
    "Discover 500+ events monthly",
    "Create your own plans",
    "Connect with like-minded people",
    "Get personalized recommendations",
    "Join exclusive communities"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl" />

      <div className="container relative flex items-center justify-center min-h-screen py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full max-w-6xl">
          {/* Left Column - Hero */}
          <div className="hidden lg:block">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">EventHub</h1>
                  <p className="text-gray-600">Discover & Connect</p>
                </div>
              </div>

              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Join Our <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Community</span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Create your free account to start discovering amazing events,
                connect with like-minded people, and create unforgettable experiences.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-10">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Why Join EventHub?</h3>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-emerald-600">4.8</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="border border-gray-200 hover:shadow-xl transition-shadow backdrop-blur-sm bg-white/80">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Create Account</CardTitle>
                <CardDescription className="text-gray-600">
                  Join EventHub to discover and create amazing experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-gray-900">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 h-11 bg-gray-50 border-gray-300 focus:bg-white"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-gray-900">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="johndoe"
                        className="pl-10 h-11 bg-gray-50 border-gray-300 focus:bg-white"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                        minLength={3}
                        maxLength={30}
                      />
                    </div>
                    {formData.username.length >= 3 && (
                      <div className="flex items-center gap-2 text-xs">
                        {checkingUsername ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                            <span className="text-blue-600">Checking availability...</span>
                          </>
                        ) : usernameAvailable === true ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-600">Username available</span>
                          </>
                        ) : usernameAvailable === false ? (
                          <>
                            <span className="h-3 w-3 rounded-full bg-red-500" />
                            <span className="text-red-600">Username taken</span>
                          </>
                        ) : null}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      This will be your public username (3-30 characters)
                    </p>
                  </div>


                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-900">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 h-11 bg-gray-50 border-gray-300 focus:bg-white"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-gray-900">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11 bg-gray-50 border-gray-300 focus:bg-white"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {formData.password.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Password strength</span>
                          <span className={`font-medium ${passwordScore === 4 ? 'text-emerald-600' :
                            passwordScore >= 2 ? 'text-amber-600' :
                              'text-red-600'
                            }`}>
                            {passwordScore === 4 ? 'Strong' :
                              passwordScore >= 2 ? 'Good' :
                                'Weak'}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${passwordScore === 4 ? 'bg-emerald-500' :
                              passwordScore >= 2 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                            style={{ width: `${passwordScore * 25}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className={`h-1.5 w-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        At least 8 characters
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        One uppercase letter
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        One number
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className={`h-1.5 w-1.5 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        One special character
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      disabled={isLoading}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                      <p className="text-xs text-gray-500">
                        By creating an account, you agree to receive occasional updates about events and promotions.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group"
                    disabled={isLoading || !agreeToTerms || passwordScore < 2 || usernameAvailable === false}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Free Account
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white/80 px-3 text-sm text-gray-500">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="h-11 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                    onClick={() => handleSocialRegister("Google")}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="h-11 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                    onClick={() => handleSocialRegister("GitHub")}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-200 pt-6">
                <p className="text-center text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </Card>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Your Security is Our Priority</h4>
                  <p className="text-sm text-gray-600">
                    We use bank-level encryption and never share your personal information with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}