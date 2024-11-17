import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { updateUser, getUserByEmail, loginUser } from '../utils/ApiFunctions'
import { useNavigate } from 'react-router-dom'
import { format, parse, isValid } from 'date-fns'

const EditProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    address: "",
    joinDate: "",
    avatar: "",
    dateOfBirth: ""
  })
  const [originalData, setOriginalData] = useState({})
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userEmail = sessionStorage.getItem('email') 
        if (!userEmail) {
          throw new Error('User email not found')
        }
        const userData = await getUserByEmail(userEmail)
        setFormData({
          ...userData,
          dateOfBirth: formatDateForInput(userData.dateOfBirth)
        })
        setOriginalData({
          ...userData,
          dateOfBirth: formatDateForInput(userData.dateOfBirth)
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error('Failed to load user data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }    

    fetchUserData()
  }, [toast])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value || '' 
    }));
  };
  

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
      const formDataToSend = new FormData()
  
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) { // So sánh trường đã thay đổi
          if (key === 'dateOfBirth') {
            const timestamp = parseDateToTimestamp(formData[key])
            formDataToSend.append(key, timestamp ? timestamp.toString() : '')
          } else {
            formDataToSend.append(key, formData[key])
          }
        }
      })

      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }
  
      const updatedUser = await updateUser(formData.id, formDataToSend)
      if (updatedUser) {
        setFormData(prevData => ({
          ...updatedUser,
          dateOfBirth: formatDateForInput(updatedUser.dateOfBirth),
        }))
        setOriginalData(prevData => ({
          ...updatedUser,
          dateOfBirth: formatDateForInput(updatedUser.dateOfBirth),
        }))
  
        sessionStorage.setItem('email', updatedUser.email)
  
        const oldPassword = formData.password
        await loginUser(updatedUser.email, oldPassword)

        toast.success("Profile updated successfully !")
        navigate('/profile');

        const userEmail = sessionStorage.getItem('email')
        const userData = await getUserByEmail(userEmail)
        setFormData({
          ...userData,
          dateOfBirth: formatDateForInput(userData.dateOfBirth)
        })
        setOriginalData({
          ...userData,
          dateOfBirth: formatDateForInput(userData.dateOfBirth)
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile. Please try again later.") 
    }
  }
  

  const formatDateForInput = (longTimestamp) => {
    if (!longTimestamp) return ''
    try {
      const date = new Date(Number(longTimestamp))
      return isValid(date) ? format(date, 'yyyy-MM-dd') : ''
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  const parseDateToTimestamp = (dateString) => {
    if (!dateString) return null
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date())
      return isValid(date) ? date.getTime() : null
    } catch (error) {
      console.error('Error parsing date:', error)
      return null
    }
  }

  const backToProfilePage = () => {
    navigate('/profile')
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <>
    <ToastContainer 
       position="top-right"  
       autoClose={5000}      
       hideProgressBar={false} 
       newestOnTop={false}   
       closeOnClick={true}   
       rtl={false}           
    />
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
                <AvatarImage src={formData.avatar} alt={formData.fullName} />
                <AvatarFallback>
                  {(formData.fullName || '').split(' ').map(n => n[0]).join('') || '?'}
                </AvatarFallback>
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
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
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
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone</Label>
                <Input
                  id="phoneNo"
                  name="phoneNo"
                  type="tel"
                  value={formData.phoneNo}
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
          <CardFooter className="flex justify-between">
            <Button type="button" onClick={backToProfilePage}>
              Back
            </Button>
            <Button type="submit" className="bg-blue-600 text-white">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </>
  )
}

export default EditProfile
