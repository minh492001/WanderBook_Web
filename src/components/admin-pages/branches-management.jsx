import React from 'react'
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
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for branches
const initialBranches = [
  { id: 1, name: 'Downtown Branch', total_rooms: 50, available_services: ['WiFi', 'Parking', 'Restaurant'] },
  { id: 2, name:  'Airport Branch', total_rooms: 30, available_services: ['WiFi',   'Shuttle'] },
  { id: 3, name: 'Beach Resort', total_rooms: 100, available_services: ['WiFi', 'Spa', 'Restaurant', 'Pool'] },
]

const allServices = ['WiFi', 'Parking', 'Restaurant', 'Shuttle', 'Spa', 'Pool']

const BranchesManagement = () => {
  const [branches, setBranches] = React.useState(initialBranches)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newBranch, setNewBranch] = React.useState({ id: 0, name: '', total_rooms: 0, available_services: [] })
  const [editingBranch, setEditingBranch] = React.useState(null)

  const handleAddBranch = () => {
    setBranches([...branches, { ...newBranch, id: branches.length + 1 }])
    setNewBranch({ id: 0, name: '', total_rooms: 0, available_services: [] })
    setIsAddDialogOpen(false)
  }

  const handleEditBranch = (branch) => {
    setEditingBranch(branch)
    setNewBranch(branch)
    setIsAddDialogOpen(true)
  }

  const handleUpdateBranch = () => {
    setBranches(branches.map(branch => branch.id === editingBranch.id ? newBranch : branch))
    setNewBranch({ id: 0, name: '', total_rooms: 0, available_services: [] })
    setEditingBranch(null)
    setIsAddDialogOpen(false)
  }

  const handleDeleteBranch = (id) => {
    setBranches(branches.filter(branch => branch.id !== id))
  }

  const handleServiceChange = (service) => {
    if (newBranch.available_services.includes(service)) {
      setNewBranch({
        ...newBranch,
        available_services: newBranch.available_services.filter(s => s !== service)
      })
    } else {
      setNewBranch({
        ...newBranch,
        available_services: [...newBranch.available_services, service]
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Branches Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
              <DialogDescription>
                {editingBranch ? 'Edit the details of the branch here.' : 'Enter the details of the new branch here.'} Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_rooms" className="text-right">
                  Total Rooms
                </Label>
                <Input
                  id="total_rooms"
                  type="number"
                  value={newBranch.total_rooms}
                  onChange={(e) => setNewBranch({ ...newBranch, total_rooms: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Services
                </Label>
                <div className="col-span-3 space-y-2">
                  {allServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={newBranch.available_services.includes(service)}
                        onCheckedChange={() => handleServiceChange(service)}
                      />
                      <label
                        htmlFor={service}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={editingBranch ? handleUpdateBranch : handleAddBranch}>
                {editingBranch ? 'Update Branch' : 'Add Branch'}
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
              <TableHead>Total Rooms</TableHead>
              <TableHead>Available Services</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.id}</TableCell>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.total_rooms}</TableCell>
                <TableCell>{branch.available_services.join(', ')}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditBranch(branch)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteBranch(branch.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default BranchesManagement;