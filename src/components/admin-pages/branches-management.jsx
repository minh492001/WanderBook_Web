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
  import { useToast } from "@/components/ui/use-toast"
  import { Checkbox } from '@/components/ui/checkbox';
  import { 
    getAllBranches, 
    addBranch, 
    deleteBranch, 
    getBranchById, 
    addServiceToBranch, 
    removeServiceFromBranch,
    getAllServices
  } from '../utils/ApiFunctions'

  const BranchesManagement = () => {
    const { toast } = useToast();
    const [branches, setBranches] = useState([]);
    const [services, setServices] = useState([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [newBranch, setNewBranch] = useState({
      branchName: '',
      address: '',
      city: '',
      serviceProvides: [],
    });
    const [editingBranch, setEditingBranch] = useState(null);
    const [branchToDelete, setBranchToDelete] = useState(null);

    useEffect(() => {
      fetchBranches();
      fetchServices();
    }, []);

    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        setBranches(data);
      } catch (error) {
        console.error("Detailed error in fetchBranches:", error);
        toast({
          title: "Error",
          description: `Failed to load branches: ${error.message}. Please check the console for more details.`,
          variant: "destructive",
        });
      }
    };



    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again later.",
          variant: "destructive",
        });
      }
    };

    const handleAddBranch = async () => {
      try {
        if (!newBranch.branchName || !newBranch.address || !newBranch.city) {
          toast({
            title: "Error",
            description: "Please fill in the branch information completely.",
            variant: "destructive",
          });
          return;
        }

        await addBranch(newBranch);
        setIsAddDialogOpen(false);
        fetchBranches();
        setNewBranch({ branchName: '', address: '', city: '', serviceProvides: [] });
        toast({
          title: "Success",
          description: "Branch added successfully.",
        });
      } catch (error) {
        console.error("Error adding branch:", error);
        toast({
          title: "Error",
          description: "Failed to add branch. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleEditBranch = async (branch) => {
      try {
        const branchData = await getBranchById(branch.id);
        setEditingBranch(branchData);
        setIsEditDialogOpen(true);
      } catch (error) {
        console.error("Error fetching branch details:", error);
        toast({
          title: "Error",
          description: "Failed to load branch details. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleUpdateBranch = async () => {
      try {
        await addBranch(editingBranch);
        setIsEditDialogOpen(false);
        fetchBranches();
        setEditingBranch(null);
        toast({
          title: "Success",
          description: "Branch updated successfully.",
        });
      } catch (error) {
        console.error("Error updating branch:", error);
        toast({
          title: "Error",
          description: "Failed to update branch. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleDeleteBranch = async () => {
      if (!branchToDelete) return;

      try {
        await deleteBranch(branchToDelete.id);
        fetchBranches();
        setIsDeleteDialogOpen(false);
        setBranchToDelete(null);
        toast({
          title: "Success",
          description: "Branch deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting branch:", error);
        toast({
          title: "Error",
          description: "Failed to delete branch. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleServiceChange = (service, checked) => {
      setNewBranch(prev => {
        const updatedServices = checked
          ? [...prev.serviceProvides, service]
          : prev.serviceProvides.filter(s => s.id !== service.id);
        
        return {
          ...prev,
          serviceProvides: updatedServices
        };
      });
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Branches Management</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Branch</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
                <DialogDescription>
                  Enter the details of the new branch here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="branchName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="branchName"
                    value={newBranch.branchName}
                    onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={newBranch.city}
                    onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label className="text-right">Services</Label>
                  <div className="col-span-3">
                  {services.map(service => (
                      <div key={service.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={newBranch.serviceProvides?.some(s => s.id === service.id) || false}
                          onCheckedChange={(checked) => handleServiceChange(service, checked)}
                        />
                        <Label
                          htmlFor={`service-${service.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {service.serviceName}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddBranch}>
                  Add Branch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.id}</TableCell>
                  <TableCell>{branch.branchName}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.city}</TableCell>
                  <TableCell>{branch.serviceProvides?.length || 0}</TableCell>
                  <TableCell>{branch.rooms?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditBranch(branch)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setBranchToDelete(branch);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
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
              <DialogTitle>Edit Branch</DialogTitle>
              <DialogDescription>
                Edit the branch details here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {editingBranch && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingBranch.name}
                    onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="edit-address"
                    value={editingBranch.address}
                    onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-city" className="text-right">
                    City
                  </Label>
                  <Input
                    id="edit-city"
                    value={editingBranch.city}
                    onChange={(e) => setEditingBranch({ ...editingBranch, city: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Services</Label>
                  <div className="col-span-3">
                    {services.map(service => (
                      <div key={service.id}>
                        <input
                          type="checkbox"
                          id={`edit-service-${service.id}`}
                          checked={editingBranch.serviceProvides.some(s => s.id === service.id)}
                          onChange={(e) => handleServiceChange(service.id, e.target.checked, editingBranch)}
                        />
                        <label htmlFor={`edit-service-${service.id}`}>{service.serviceName}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateBranch}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete Branch</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this branch? This action is reversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteBranch}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  export default BranchesManagement;