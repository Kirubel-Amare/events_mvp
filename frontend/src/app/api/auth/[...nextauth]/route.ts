import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Mock authentication
                if (credentials?.email === "user@example.com" && credentials?.password === "password") {
                    return { id: "1", name: "User", email: "user@example.com", role: "user" }
                }
                if (credentials?.email === "organizer@example.com" && credentials?.password === "password") {
                    return { id: "2", name: "Organizer", email: "organizer@example.com", role: "organizer" }
                }
                // Allow any login for MVP testing
                if (credentials?.email) {
                    return { id: "3", name: "Test User", email: credentials.email, role: "user" }
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as { role?: string }).role = token.role as string
            }
            return session
        }
    }
})

export { handler as GET, handler as POST }
