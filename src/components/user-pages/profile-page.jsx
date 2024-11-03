import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import { getUserByEmail } from '../utils/ApiFunctions'
import { useToast } from "@/components/ui/use-toast"
import { format } from 'date-fns';

const UserProfile = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userEmail = sessionStorage.getItem('email')
        if (!userEmail) {
          throw new Error('User email not found')
        }
        const userData = await getUserByEmail(userEmail)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load user data. Please try again later.')
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const handleEditProfile = () => {
    navigate('/edit-profile') // Adjust this path as needed
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (!user) {
    return <div className="text-center py-8">No user data available</div>
  }

  const formatDate = (longTimestamp) => {
    console.log("Timestamp:", longTimestamp); // Kiểm tra giá trị longTimestamp
    if (!longTimestamp) return 'N/A';
    try {
      const milliseconds = Number(longTimestamp);
      const date = milliseconds.toString().length === 13 
        ? new Date(milliseconds)
        : new Date(milliseconds * 1000);
      return format(date, 'dd MM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" className="flex items-center" onClick={handleEditProfile}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  </div>
  )
}

export default UserProfile