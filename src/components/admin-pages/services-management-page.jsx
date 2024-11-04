import React, { useState, useEffect } from 'react'
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getAllServices, addService, saveService, deleteService } from '../utils/ApiFunctions'

const ServicesManagement = () => {
  const [services, setServices] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newService, setNewService] = useState({ id: 0, serviceName: '', description: '', price: '' })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchServices()
  }, [])

  const showNotification = (message, type) => {
    toast({
      title: type === "success" ? "Success" : "Error",
      description: message,
      variant: type === "success" ? "default" : "destructive",
    });
  };

  const fetchServices = async () => {
    try {
      const data = await getAllServices()
      setServices(data)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error)
      showNotification("Lỗi khi lấy danh sách dịch vụ", "error")
    }
  }

  const handleAddService = async () => {
    try {
      const serviceToAdd = {
        ...newService,
        price: newService.price === '' ? 0 : Number(newService.price)
      };
      await addService(serviceToAdd)
      setIsAddDialogOpen(false)
      fetchServices()
      setNewService({ id: 0, serviceName: '', description: '', price: '' })
      showNotification("Dịch vụ đã được thêm thành công", "success")
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error)
      showNotification(error.response?.data?.message || "Lỗi khi thêm dịch vụ", "error")
    }
  }

  const handleEditService = (service) => {
    setEditingService(service)
    setNewService(service)
    setIsAddDialogOpen(true)
  }

  const handleUpdateService = async () => {
    try {
      await saveService(editingService.id, newService)
      setIsAddDialogOpen(false)
      fetchServices()
      setNewService({ id: 0, serviceName: '', description: '', price: '' })
      setEditingService(null)
      showNotification("Dịch vụ đã được cập nhật thành công", "success")
    } catch (error) {
      console.error("Lỗi khi cập nhật dịch vụ:", error)
      showNotification(error.response?.data?.message || "Lỗi khi cập nhật dịch vụ", "error")
    }
  }

  const handleDeleteService = async () => {
    if(!serviceToDelete) return;

    try {
      const result = await deleteService(serviceToDelete.id);
      if (result.success) {
        showNotification(result.message, "success");
        fetchServices(); // Cập nhật lại danh sách dịch vụ
      } else {
        throw new Error(result.message || "Không thể xóa dịch vụ");
      }
    } catch (error) {
      console.error("Lỗi khi xóa dịch vụ:", error);
      showNotification(error.message, "error");
    } finally {
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              <DialogDescription>
                {editingService ? 'Edit the details of the service here.' : 'Enter the details of the new service here.'} Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceName" className="text-right">
                  Name
                </Label>
                <Input
                  id="serviceName"
                  value={newService.serviceName}
                  onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newService.price === '' ? '' : newService.price}
                  onChange={(e) => {
                    const price = e.target.value === '' ? '' : Number(e.target.value);
                    setNewService({ ...newService, price: isNaN(price) ? '' : price })
                  }}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={editingService ? handleUpdateService : handleAddService}>
                {editingService ? 'Update Service' : 'Add Service'}
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
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.id}</TableCell>
                <TableCell>{service.serviceName}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell>
                <div className="flex justify-stretch gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditService(service)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setServiceToDelete(service);
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
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa dịch vụ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này có thể đảo ngược.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ServicesManagement;