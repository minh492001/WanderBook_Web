import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { updateUser, getUserByEmail } from '../utils/ApiFunctions'
import { useNavigate } from 'react-router-dom'

export default function EditProfile() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    joinDate: "",
    avatar: "",
    dateOfBirth: ""
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userEmail = sessionStorage.getItem('userEmail')
        if (!userEmail) {
          throw new Error('User email not found')
        }
        const userData = await getUserByEmail(userEmail)
        setFormData(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setFormData(prevData => ({
        ...prevData,
        avatar: URL.createObjectURL(file)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Create a new FormData object
      const formDataToSend = new FormData()

      // Append all form fields to the FormData object
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key])
      })

      // Append the avatar file if it exists
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }

      // Call the updateUser API function
      const updatedUser = await updateUser(formData.id, formDataToSend)

      // Update the local state with the response from the server
      setFormData(updatedUser)

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const backToProfilePage = () => {
    navigate('/profile')
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Edit Profile</CardTitle>
            <CardDescription className="text-center">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={formData.avatar} alt={formData.name} />
                <AvatarFallback>{formData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                    <Upload className="w-4 h-4" />
                    <span>Upload new avatar</span>
                  </div>
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Birth Day</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={backToProfilePage}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}