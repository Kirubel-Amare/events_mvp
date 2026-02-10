"use client"

import { useEffect, useState } from "react"
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Shield,
    User as UserIcon,
    Calendar,
    Mail,
    CheckCircle2,
    XCircle,
    Loader2,
    Edit,
    Trash2
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { adminApi } from "@/lib/api/admin"
import { User } from "@/types"
import toast from "react-hot-toast"

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const data = await adminApi.getUsers(roleFilter === "all" ? undefined : roleFilter)
            setUsers(data)
        } catch (error) {
            console.error("Failed to fetch users:", error)
            toast.error("Failed to load users")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [roleFilter])

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            await adminApi.updateUserRole(userId, newRole)
            toast.success(`User role updated to ${newRole}`)
            fetchUsers()
        } catch (error) {
            toast.error("Failed to update user role")
        }
    }

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5"><Shield className="h-3 w-3 mr-1" /> Admin</Badge>
            case "organizer":
                return <Badge className="bg-purple-100 text-purple-700 border-none px-2 py-0.5"><Calendar className="h-3 w-3 mr-1" /> Organizer</Badge>
            default:
                return <Badge className="bg-blue-100 text-blue-700 border-none px-2 py-0.5"><UserIcon className="h-3 w-3 mr-1" /> User</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h2>
                    <p className="text-gray-500">Manage user accounts, roles and permissions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">Export Data</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Add New User</Button>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-0 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name, email or username..."
                                className="pl-10 bg-gray-50 border-gray-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400 mr-1" />
                            <select
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="organizer">Organizers</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="text-gray-500">Loading user database...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                            <div className="bg-gray-100 p-4 rounded-full">
                                <Users className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">No users found</p>
                                <p className="text-gray-500">Try adjusting your search or filters.</p>
                            </div>
                            <Button variant="outline" onClick={() => { setSearchQuery(""); setRoleFilter("all") }}>Clear Filters</Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[300px]">User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Email Status</TableHead>
                                    <TableHead>Joined Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-gray-100">
                                                    <AvatarImage src={user.personalProfile?.profilePhoto || ""} />
                                                    <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                                                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 text-sm">{user.name || "N/A"}</span>
                                                    <span className="text-xs text-gray-500">@{user.username || "username"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getRoleBadge(user.role || "user")}
                                        </TableCell>
                                        <TableCell>
                                            {user.isVerified ? (
                                                <div className="flex items-center text-emerald-600 text-xs font-medium">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-gray-400 text-xs font-medium">
                                                    <XCircle className="h-3 w-3 mr-1" /> Unverified
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                                {user.id ? "Feb 10, 2026" : "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 shadow-lg border-gray-100">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Edit className="h-4 w-4 mr-2" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Mail className="h-4 w-4 mr-2" /> Message User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel className="text-xs text-gray-500">Change Role</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer font-medium"
                                                        disabled={user.role === 'admin'}
                                                        onClick={() => handleRoleUpdate(user.id, 'admin')}
                                                    >
                                                        <Shield className="h-4 w-4 mr-2 text-emerald-600" /> Make Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer font-medium"
                                                        disabled={user.role === 'organizer'}
                                                        onClick={() => handleRoleUpdate(user.id, 'organizer')}
                                                    >
                                                        <Calendar className="h-4 w-4 mr-2 text-purple-600" /> Make Organizer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer font-medium"
                                                        disabled={user.role === 'user'}
                                                        onClick={() => handleRoleUpdate(user.id, 'user')}
                                                    >
                                                        <UserIcon className="h-4 w-4 mr-2 text-blue-600" /> Make Regular User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
