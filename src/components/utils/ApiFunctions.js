import axios from "axios";

export const api = axios.create({
	baseURL: "http://localhost:8080"
})

/* Header to Authorize */
export const getHeader = () => {
	const token = sessionStorage.getItem("token")
	return {
		Authorization : `Bearer ${token}`,
		"Content-Type" : "application/json"
	}
}

/* This is function to register a user */
export async function registerUser(registration) {
	try {
		const response = await api.post("/api/v2/auth/register", registration)
		return response.data
	} catch (error) {
		if(error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	} 
}

/* This is function to login */
export async function loginUser (login) {
	try {
		const response = await api.post("/api/v2/auth/login", login)
		if(response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}

/* This function adds a new room room to the database */
export async function addRoom(photo, roomType, roomPrice) {
	const formData = new FormData()
	formData.append("photo", photo)
	formData.append("roomType", roomType)
	formData.append("roomPrice", roomPrice)

	const response = await api.post("/rooms/add/new-room", formData, {
		headers : getHeader() // add Header to Authorize
	})
	if (response.status === 201) {
		return true
	} else {
		return false
	}
}

/* This function gets all room types from the database */
export async function getRoomTypes() {
	try {
		const response = await api.get("/rooms/room/types")
		return response.data
	} catch (error) {
		throw new Error("Error fetching room types")
	}
}

/* This function gets all rooms from the database */
export async function getAllRooms() {
	try{
		const result = await api.get("/rooms/all-rooms")
		return result.data
	}
	catch(error){
		throw new Error("Error fetching rooms")
	}
}

/* This function deletes a room by the Id */
export async function deleteRoom(roomId) {
	try{
		const result = await api.delete(`/rooms/delete/room/${roomId}`, {
			headers : getHeader() // add Header to Authorize
		})
		return result.data
	} catch(error) {
		throw new Error(`Error deleting room ${error.message}`)
	}
}

/* This function update a room */
export async function updateRoom(roomId, roomData) {
	const formData = new FormData()
	formData.append("roomType", roomData.roomType)
	formData.append("roomPrice", roomData.roomPrice)
	formData.append("photo", roomData.photo)
	const response = await api.put(`/rooms/update/${roomId}`, formData, {
		headers : getHeader() // add Header to Authorize
	})
	return response
}

/* This function gets a room by the Id */
export async function getRoomById(roomId) {
	try {
		const result = await api.get(`/rooms/room/${roomId}`)
		return result.data
	}
	catch(error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}

/* This function gets all available rooms from the database with given date and room type */
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
	const result = await api.get(`rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`)
	return result
}

/* This function gets all bookings from the database */
export async function getAllBookings() {
	try {
		const result = await api.get("/bookings/all-bookings")
		return result.data
	} catch (error) {
		throw new Error(`Error fetching booking : ${error.message}`)
	}
}

/* This function get booking by the confirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
	try{
		const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
		return result.data
	} catch (error) {
		if(error.response && error.response.data) {
			throw new Error(error.response.data)
		}else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}

/* This function saves a new booking to the database */
export async function bookRoom(roomId, booking) {
	try{
		const response = await api.post(`/bookings/room/${roomId}/booking`, booking)
		return response.data
	} catch (error) {
		if(error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByEmail(email) {
	try {
		const response = await api.get(`/bookings/user/${email}/bookings`, {
			headers: getHeader() // add Header to Authorize
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch booking")
	}
}

/* This function cancels booking */
export async function cancelBooking(bookingId) {
	try {
		const result = await api.delete(`/bookings/booking/${bookingId}/delete`, {
			headers : getHeader() // add Header to Authorize
		})
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking : ${error.message}`)
	}
}

/* This function delete user */ 
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers : getHeader() // add Header to Authorize
		})
		return response.data
	} catch (error) {
		return error.message
	}
}

/* This function gets a single user */
export async function getUser(email) {
	try {
		const response = await api.get(`/users/${email}`, {
			headers : getHeader() // add Header to Authorize
		})
		return response.data
	} catch (error) {
		throw error
	}
}

// Get all users (Admin only)
export async function getAllUsers() {
	try {
	  const response = await api.get('/api/v2/user/all', { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw error;
	}
}

  // Get user by ID (Admin only)
export async function getUserById(id) {
	try {
	  const response = await api.get(`/api/v2/user/${id}`, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw error;
	}
}

// Get user by email (Admin or User)
export async function getUserByEmail(email) {
	try {
	  const response = await api.get(`/api/v2/user/email/${email}`, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw error;
	}
  }

  // Soft delete user by ID (Admin only)
export async function deleteUserById(id) {
	try {
	  const response = await api.delete(`/api/v2/user/${id}`, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw error;
	}
  }

 // Soft delete user by email (Admin only)
export async function deleteUserByEmail(email) {
	try {
	  const response = await api.delete(`/api/v2/user/by-email`, {
		headers: getHeader(),
		params: { email }
	  });
	  return response.data;
	} catch (error) {
	  console.error("Error deleting user by email:", error);
	  throw error;
	}
  }
  //update user by id (Admin only)
  export const updateUser = async (id, updatedUser) => {
	try {
	  const response = await api.put(`/api/v2/user/${id}`, updatedUser, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw error;
	}
  }