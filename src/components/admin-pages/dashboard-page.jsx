import React from 'react'
import { Bell, BedDouble, Calendar, Users, Menu, LogOut, HomeIcon, Briefcase } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import RoomsManagement from './rooms-management-pages.jsx';
import BookingsManagement from './bookings-management-page.jsx';
import UsersManagement from './users-management-page.jsx';
import BranchesManagement from './branches-management.jsx';
import ServicesManagement from './services-management-page.jsx'

const menuItems = [
  { icon: BedDouble, label: 'Rooms', component: RoomsManagement },
  { icon: Calendar, label: 'Bookings', component: BookingsManagement },
  { icon: Users, label: 'Users', component: UsersManagement },
  { icon: HomeIcon, label: 'Branches', component: BranchesManagement },
  { icon: Briefcase, label: 'Services', component: ServicesManagement },
]

const Dashboard = () => {
  const [activeItem, setActiveItem] = React.useState('Rooms')

  const ActiveComponent = menuItems.find(item => item.label === activeItem)?.component || RoomsManagement

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 bg-white shadow-md lg:block">
        <div className="flex h-20 items-center justify-center border-b">
          <h2 className="text-2xl font-bold text-gray-800">Hotel Admin</h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center px-6 py-3 text-gray-700 hover:bg-gray-100",
                activeItem === item.label && "bg-gray-100 text-blue-600"
              )}
              onClick={() => setActiveItem(item.label)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden absolute left-4 top-4">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="flex h-20 items-center justify-center border-b">
            <h2 className="text-2xl font-bold text-gray-800">Hotel Admin</h2>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex w-full items-center px-6 py-3 text-gray-700 hover:bg-gray-100",
                  activeItem === item.label && "bg-gray-100 text-blue-600"
                )}
                onClick={() => {
                  setActiveItem(item.label)
                  document.body.click() // Close the sheet on mobile after selection
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b bg-white px-6">
          <h1 className="text-2xl font-semibold text-gray-800">{activeItem}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  )
}

export default Dashboard