import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    joinDate: "January 1, 2023",
    avatar: "/placeholder.svg?height=100&width=100"
  })

  useEffect(() => {
    // Fetch user data from an API
    // This is a placeholder for where you would typically fetch user data
    const fetchUserData = async () => {
      try {
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        // setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleEditProfile = () => {
    navigate('/edit-profile') // Adjust this path as needed
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
          <CardDescription>User Profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-500">Phone</Label>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <MapPin className="text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-500">Address</Label>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-500">Joined</Label>
                  <p className="font-medium">{user.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="flex items-center" onClick={() => navigate('/edit-profile')}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UserProfile