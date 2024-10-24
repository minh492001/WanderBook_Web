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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for bookings
const initialBookings = [
  { id: 1, guestName: 'John Doe', roomNumber: '101', checkIn: '2023-06-01', checkOut: '2023-06-05', status: 'Confirmed' },
  { id: 2, guestName: 'Jane Smith', roomNumber: '102', checkIn: '2023-06-03', checkOut: '2023-06-07', status: 'Checked In' },
  { id: 3, guestName: 'Bob Johnson', roomNumber: '103', checkIn: '2023-06-05', checkOut:  '2023-06-10', status: 'Pending' },
]

const BookingsManagement = () => {
  const [bookings, setBookings] = React.useState(initialBookings)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newBooking, setNewBooking] = React.useState({ guestName: '', roomNumber: '', checkIn: '', checkOut: '', status: 'Pending' })
  const [editingBooking, setEditingBooking] = React.useState(null)

  const handleAddBooking = () => {
    setBookings([...bookings, { id: bookings.length + 1, ...newBooking }])
    setNewBooking({ guestName: '', roomNumber: '', checkIn: '', checkOut: '', status: 'Pending' })
    setIsAddDialogOpen(false)
  }

  const handleEditBooking = (booking) => {
    setEditingBooking(booking)
    setNewBooking(booking)
    setIsAddDialogOpen(true)
  }

  const handleUpdateBooking = () => {
    setBookings(bookings.map(booking => booking.id === editingBooking.id ? newBooking : booking))
    setNewBooking({ guestName: '', roomNumber: '', checkIn: '', checkOut: '', status: 'Pending' })
    setEditingBooking(null)
    setIsAddDialogOpen(false)
  }

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Bookings Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBooking ? 'Edit Booking' : 'Add New Booking'}</DialogTitle>
              <DialogDescription>
                {editingBooking ? 'Edit the details of the booking here.' : 'Enter the details of the new booking here.'} Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="guestName" className="text-right">
                  Guest Name
                </Label>
                <Input
                  id="guestName"
                  value={newBooking.guestName}
                  onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomNumber" className="text-right">
                  Room Number
                </Label>
                <Input
                  id="roomNumber"
                  value={newBooking.roomNumber}
                  onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkIn" className="text-right">
                  Check-in Date
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={newBooking.checkIn}
                  onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkOut" className="text-right">
                  Check-out Date
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={newBooking.checkOut}
                  onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newBooking.status}
                  onValueChange={(value) => setNewBooking({ ...newBooking, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select booking status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Checked In">Checked In</SelectItem>
                    <SelectItem value="Checked Out">Checked Out</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={editingBooking ? handleUpdateBooking : handleAddBooking}>
                {editingBooking ? 'Update Booking' : 'Add Booking'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead>Room Number</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.guestName}</TableCell>
                <TableCell>{booking.roomNumber}</TableCell>
                <TableCell>{booking.checkIn}</TableCell>
                <TableCell>{booking.checkOut}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditBooking(booking)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteBooking(booking.id)}>
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

export default BookingsManagement;