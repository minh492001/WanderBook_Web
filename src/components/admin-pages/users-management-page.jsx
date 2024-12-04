import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllUsers, deleteUserById, deleteUserByEmail, updateUser } from '../utils/ApiFunctions'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO } from 'date-fns'

const UsersManagement = () => {
  
  const [users, setUsers] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState(null)
  const [editingUser, setEditingUser] = React.useState(null)
  const [originalUser, setOriginalUser] = React.useState(null)

  const handleEditUser = (user) => {
    setEditingUser(user);
    setOriginalUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      if (!originalUser) {
        throw new Error("The original user data was not found.");
      }
  
      if (!editingUser.id) {
        throw new Error("The user ID is not defined.");
      }
  
      const updatedUser = {};
      if (editingUser.email !== originalUser.email) {
        updatedUser.email = editingUser.email;
      }
      if (editingUser.phoneNo !== originalUser.phoneNo) {
        updatedUser.phoneNo = editingUser.phoneNo;
      }
      if (editingUser.dateOfBirth !== originalUser.dateOfBirth) {
        updatedUser.dateOfBirth = editingUser.dateOfBirth instanceof Date
          ? editingUser.dateOfBirth.getTime()
          : editingUser.dateOfBirth;
      }
  
      updatedUser.id = editingUser.id; 
  
      const response = await updateUser(updatedUser.id, updatedUser);
  
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === response.id ? { ...user, ...response } : user
        )
      );
  
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast.success("User has been updated successfully !.");
    } catch (error) {
      console.error("Error updating users:", error);
      toast.error(error.message ||"Failed to update user. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users. Please try again later.")
      }
    };

    fetchUsers();
  }, [toast]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
  
    try {
      let deletedUser;
      if (userToDelete.id) {
        deletedUser = await deleteUserById(userToDelete.id);
      } else if (userToDelete.email) {
        deletedUser = await deleteUserByEmail(userToDelete.email);
      }
  
      setUsers(users.map(user => 
        user.id === deletedUser.id ? { ...user, ...deletedUser } : user
      ));
      toast({
        title: "Successfully deleted user",
        description: "The user has been soft deleted successfully.",
      });
    } catch (error) {
      console.error("Error while deleting user:", error);
      toast({
        title: "Error",
        description: "Unable to delete user. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

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
    <> 
    <ToastContainer 
       position="top-right"  
       autoClose={5000}     
       hideProgressBar={false} 
       newestOnTop={false}   
       closeOnClick={true}   
       rtl={false}          
    />
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className={user.deletedAt ? 'line-through opacity-50' : ''}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.phoneNo}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{formatDate(user.dateOfBirth)}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{formatDate(user.deletedAt)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!user.deletedAt && (
                      <>
                        <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit user information</DialogTitle>
            <DialogDescription>
                Edit the user's information here. Click Save when finished.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                   Role
                </Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNo" className="text-right">
                  Phone No
                </Label>
                <Input
                  id="phoneNo"
                  value={editingUser.phoneNo}
                  onChange={(e) => setEditingUser({ ...editingUser, phoneNo: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={editingUser.address}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateUser}>
              Save Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action is reversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  )
}

export default UsersManagement;