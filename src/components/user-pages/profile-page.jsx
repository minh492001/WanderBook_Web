import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit, Cake, RectangleEllipsis   } from 'lucide-react'
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

    useEffect(() => {
      fetchUserData()
    }, [navigate, toast]) 

  const handleEditProfile = () => {
    navigate('/edit-profile') 
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

  const backToHomePage = () => {
    navigate('/')
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    try {
      let date;
      if (typeof dateValue === 'string') {
        // Try parsing as ISO string
        date = parseISO(dateValue);
      } else if (typeof dateValue === 'number') {
        // Assume it's a timestamp
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        throw new Error('Invalid date format');
      }
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      return format(date, 'dd/MM/yyyy');
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
                <p className="font-medium">{user.phoneNo}</p>
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
          <div className="flex items-center space-x-4">
              <Cake className="text-gray-400" />
              <div>
                <Label className="text-sm text-gray-500">Date Of Birth</Label>
                <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
              </div>
          </div>
          <div className='flex items-center space-x-4'>
              <RectangleEllipsis className="text-gray-400" />
              <p className="font-medium" onClick={() => navigate('/change-password')}>Change Password</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={backToHomePage}>Back To Home</Button>
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