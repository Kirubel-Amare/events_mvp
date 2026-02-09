"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, User, Sparkles, ArrowRight, Github, Chrome } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement login logic
    setTimeout(() => setIsLoading(false), 1000)
  }

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
                Welcome Back to <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">EventHub</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Sign in to continue discovering amazing events, connect with like-minded people, and create unforgettable experiences.
              </p>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Join 10,000+ Members</h3>
                    <p className="text-gray-600">Be part of our vibrant community</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Exclusive Events</h3>
                    <p className="text-gray-600">Access premium events and experiences</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">4.8</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-emerald-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="border border-gray-200 hover:shadow-xl transition-shadow backdrop-blur-sm bg-white/80">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-900">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 h-11 bg-gray-50 border-gray-300 focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-gray-900">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11 bg-gray-50 border-gray-300 focus:bg-white"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-700">
                      Remember me for 30 days
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Signing in..."
                    ) : (
                      <>
                        Sign In
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
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    type="button" 
                    disabled={isLoading}
                    className="h-11 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    disabled={isLoading}
                    className="h-11 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-200 pt-6">
                <p className="text-center text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link 
                    href="/register" 
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Sign up free
                  </Link>
                </p>
              </CardFooter>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">Trusted by thousands of event organizers</p>
              <div className="flex items-center justify-center gap-6 opacity-60">
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}