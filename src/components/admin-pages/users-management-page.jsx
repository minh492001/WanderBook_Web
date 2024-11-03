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
import { useToast } from "@/components/ui/use-toast"
import { format } from 'date-fns';

const UsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState(null)
  const [editingUser, setEditingUser] = React.useState(null)

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updatedUser = await updateUser(editingUser.id, editingUser);
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast({
        title: "Successfully updated user",
        description: "User information has been updated.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Unable to update user information. Please try again later.",
        variant: "destructive",
      });
    }
  };

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [toast]);

  const formatDate = (longTimestamp) => {
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
              <TableHead>Date of Birth</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className={user.deletedAt ? 'line-through' : ''}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.phone_no}</TableCell>
                <TableCell>{user.address}</TableCell>
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
                <Label htmlFor="phone_no" className="text-right">
                  Phone No
                </Label>
                <Input
                  id="phone_no"
                  value={editingUser.phone_no}
                  onChange={(e) => setEditingUser({ ...editingUser, phone_no: e.target.value })}
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
  )
}

export default UsersManagement;