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
import { Switch } from "@/components/ui/switch"
import { getAllRooms, addNewRoom, updateRoom, deleteRoom } from '../utils/ApiFunctions'; 



const RoomsManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newRoom, setNewRoom] = useState({ id: 0, room_type: '', room_price: '', is_booked: false, photo: null });
    const [editingRoom, setEditingRoom] = useState(null);

  const fetchRooms = async () => {
    try {
        const roomsData = await getAllRooms();
        setRooms(roomsData);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchRooms();
}, []);

 // Hàm thêm phòng mới
 const handleAddRoom = async () => {
  try {
      const addedRoom = await addNewRoom(newRoom); // Gọi API để thêm phòng
      setRooms((prevRooms) => [...prevRooms, addedRoom]); // Cập nhật danh sách phòng
      resetNewRoom(); // Reset thông tin phòng mới
      setIsAddDialogOpen(false); // Đóng dialog thêm phòng
  } catch (err) {
      setError(err.message);
  }
};

  // Hàm chỉnh sửa phòng
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setNewRoom(room); // Thiết lập thông tin phòng để chỉnh sửa
    setIsAddDialogOpen(true); // Mở dialog chỉnh sửa
};

// Hàm cập nhật phòng
const handleUpdateRoom = async () => {
    try {
        await updateRoom(editingRoom.id, newRoom); // Gọi API để cập nhật phòng
        setRooms((prevRooms) =>
            prevRooms.map((room) => (room.id === editingRoom.id ? { ...newRoom } : room))
        ); // Cập nhật danh sách phòng
        resetNewRoom(); // Reset thông tin phòng mới
        setEditingRoom(null); // Reset thông tin chỉnh sửa
        setIsAddDialogOpen(false); // Đóng dialog chỉnh sửa
    } catch (err) {
        setError(err.message);
    }
};
   // Hàm xóa phòng
   const handleDeleteRoom = async (id) => {
    try {
        await deleteRoom(id); // Gọi API để xóa phòng
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id)); // Cập nhật danh sách phòng
    } catch (err) {
        setError(err.message);
    }
};

   // Hàm reset thông tin phòng mới
   const resetNewRoom = () => {
    setNewRoom({ id: 0, room_type: '', room_price: '', is_booked: false, photo: null });
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Rooms Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Edit the details of the room here.' : 'Enter the details of the new room here.'} Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room_type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newRoom.room_type}
                  onValueChange={(value) => setNewRoom({ ...newRoom, room_type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room_price" className="text-right">
                  Price
                </Label>
                <Input
                  id="room_price"
                  type="number"
                  value={newRoom.room_price}
                  onChange={(e) => setNewRoom({ ...newRoom, room_price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_booked" className="text-right">
                  Booked
                </Label>
                <Switch
                  id="is_booked"
                  checked={newRoom.is_booked}
                  onCheckedChange={(checked) => setNewRoom({ ...newRoom, is_booked: checked })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo" className="text-right">
                  Photo
                </Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewRoom({ ...newRoom, photo: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={editingRoom ? handleUpdateRoom : handleAddRoom}>
                {editingRoom ? 'Update Room' : 'Add Room'}
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
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Booked</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.id}</TableCell>
                <TableCell>{room.room_type}</TableCell>
                <TableCell>${room.room_price}</TableCell>
                <TableCell>{room.is_booked ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {room.photo ? (
                    <img src={room.photo} alt={`Room ${room.id}`} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">No image</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditRoom(room)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteRoom(room.id)}>
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

export default RoomsManagement;