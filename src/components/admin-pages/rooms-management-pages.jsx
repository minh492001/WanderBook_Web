import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  getAllRoomsWithFutureBookings,
  addNewRoom,
  updateRoom,
  deleteRoom,
  getRoomTypes 
} from '../utils/ApiFunctions';

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogData, setDialogData] = useState(null); // Manage dialog state (add or edit).
  const [roomTypes, setRoomTypes] = useState([]);
 

  // Fetch all rooms.
  useEffect(() => {
    const fetchRoomsAndTypes = async () => {
      setLoading(true);
      try {
          const roomsData = await getAllRoomsWithFutureBookings();
          setRooms(roomsData);

          const typesData = await getRoomTypes(); 
          setRoomTypes(typesData); // Lưu room types vào state
      } catch (err) {
          setError('Failed to fetch data.');
          console.error("Error fetching data:", err);
      } finally {
          setLoading(false);
      }
  };
  fetchRoomsAndTypes();
}, []);

  // Handle Add or Update Room.
  const handleSaveRoom = async () => {
    try {
        const roomData = {
            branchId: dialogData.data.branchId,
            roomNumber: dialogData.data.roomNumber,
            roomType: dialogData.data.roomType,
            pricePerNight: Number(dialogData.data.pricePerNight),
            maxOccupancy: Number(dialogData.data.maxOccupancy),
            description: dialogData.data.description,
            photo: dialogData.data.photo || null
        };

        console.log('Room Data:', roomData);
        console.log('Room ID:', dialogData.data.id); // Log roomId

        if (dialogData.editing) {
            if (!dialogData.data.id) {
                throw new Error('Room ID is missing for update');
            }
            const updatedRoom = await updateRoom(dialogData.data.id, roomData);
            setRooms((prevRooms) => prevRooms.map((room) => (room.id === dialogData.data.id ? updatedRoom : room)));
            toast.success('Room updated successfully!');
        } else {
            const newRoom = await addNewRoom(roomData);
            setRooms((prevRooms) => [...prevRooms, newRoom]);
            toast.success('Room added successfully!');
        }
        closeDialog();
    } catch (err) {
        console.error('Error saving room:', err);
        toast.error('Failed to save room.');
    }
};

  // Handle Delete Room.
  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
      toast.success('Room deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete room.');
    }
  };

  // Open dialog for adding or editing.
  const initializeRoomData = (room = null) => {
    return {
        id: room ? room.id : null,
        branchId: room ? room.branchId : '', 
        roomNumber: room ? room.roomNumber : '',
        roomType: room ? room.roomType : '',
        pricePerNight: room ? room.pricePerNight : 0,
        maxOccupancy: room ? room.maxOccupancy : 1,
        description: room ? room.description : '',
        photo: room ? room.photo : null,
    };
};

const openDialog = (room = null) => {
  console.log("Opening dialog for room:", room); // Debugging line
  setDialogData({
      editing: !!room,
      data: initializeRoomData(room),
  });
};

// Close dialog
const closeDialog = () => setDialogData(null);


  // Handle file upload and convert to base64.
const handleFileUpload = (file) => {
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1]; // Lấy phần base64 không có metadata

            const formData = new FormData();
            formData.append('photo', base64Data); // Gửi đúng base64 không phải Blob

            // Kiểm tra dữ liệu formData
            for (let pair of formData.entries()) {
                console.log(pair[0]+ ': ' + pair[1]);
            }

            fetch("https://localhost:8080/api/v2/rooms/upload", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log("Upload thành công", data);
            })
            .catch(error => {
                console.error("Lỗi khi upload ảnh:", error);
            });
        };
        reader.readAsDataURL(file);  // Chuyển file thành base64
    }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Rooms Management</h2>
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-5" /> Add Room
        </Button>
      </div>
      
      {/* Display rooms */}
      <div>
        {Array.isArray(rooms) && rooms.length > 0 ? (
            rooms.map((room) => (
                <div key={room.id}>
                    <h3>{room.room_number}</h3>
                    <p>{room.description}</p>
                </div>
            ))
        ) : (
            <p>No rooms available</p>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error: {error}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Room Number</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Max Occupancy</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.id}</TableCell>
            <TableCell>{room.roomNumber}</TableCell> 
            <TableCell>${room.pricePerNight !== null ? room.pricePerNight : 'N/A'}</TableCell> 
            <TableCell>{room.maxOccupancy}</TableCell> {/* Thêm maxOccupancy */}
            <TableCell>{room.state || 'Not specified'}</TableCell> {/* Thêm state */}
            <TableCell>{room.roomType}</TableCell>
            <TableCell>
                {room.branchId !== null ? room.branchId : 'No branch assigned'} {/* Hiển thị thông báo nếu branchId là null */}
            </TableCell>
            <TableCell>
                {room.photo ? (
                    <img src={room.photo} alt={`Room ${room.id}`} className="w-16 h-16 object-cover rounded" />
                ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        No image available {/* Hiển thị thông báo nếu photo là null */}
                    </div>
                )}
            </TableCell>
            <TableCell>{room.description}</TableCell>
            <TableCell>
                <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openDialog(room)}>
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
        )}
      </div>

      {/* Dialog */}
      {dialogData && (
        <Dialog open={!!dialogData} onOpenChange={closeDialog}>
          <DialogContent aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogHeader>
              <DialogTitle>{dialogData.editing ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            </DialogHeader>
            <p id="dialog-description" className="sr-only">
              Use this dialog to add or edit room details. Please fill out the necessary fields below.
            </p>
            <div className="grid gap-4 py-4">
              {/* Room fields (type, number, price, etc.) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Room Type</Label>
                <Select
                  value={dialogData.data.roomType}
                  onValueChange={(value) =>
                    setDialogData((prevData) => ({
                      ...prevData,
                      data: { ...prevData.data, roomType: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Other fields */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Room Number</Label>
                <Input
                  value={dialogData.data.roomNumber}
                  onChange={(e) =>
                    setDialogData((prevData) => ({
                      ...prevData,
                      data: { ...prevData.data, roomNumber: e.target.value },
                    }))
                  }
                />
              </div>

              {/* Other fields like price, occupancy, description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Price per Night</Label>
                <Input
                  type="number"
                  value={dialogData.data.pricePerNight}
                  onChange={(e) =>
                    setDialogData((prevData) => ({
                      ...prevData,
                      data: { ...prevData.data, pricePerNight: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Max Occupancy</Label>
                <Input
                  type="number"
                  value={dialogData.data.maxOccupancy}
                  onChange={(e) =>
                    setDialogData((prevData) => ({
                      ...prevData,
                      data: { ...prevData.data, maxOccupancy: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Branch ID</Label>
                <Input 
                    type="number" 
                    value={dialogData.data.branchId} 
                    onChange={(e) => setDialogData((prevData) => ({
                        ...prevData,
                        data: { ...prevData.data, branchId: e.target.value }, // Đảm bảo tên trường là branchId
                    }))} 
                />
              </div>
              <div className="grid grid-cols items-center gap-4">
                <Label>Description</Label>
                <Textarea
                  value={dialogData.data.description}
                  onChange={(e) =>
                    setDialogData((prevData) => ({
                      ...prevData,
                      data: { ...prevData.data, description: e.target.value },
                    }))
                  }
                />
              </div>
              <Label>Room Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} />
            </div>
            <DialogFooter>
              <Button onClick={handleSaveRoom}>Save</Button>
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoomsManagement;
