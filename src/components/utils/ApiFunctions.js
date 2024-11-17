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
		const response = await api.post(`/api/v2/auth/register`, registration)
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
		const response = await api.post(`/api/v2/auth/login`, login)
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
			headers: getHeader() 
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
			headers : getHeader() 
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
	  const token = sessionStorage.getItem("token");
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

  //***service api functions 
  //get all services
  export async function getAllServices() {
	try {
	  const response = await api.get("/api/v2/services/all", { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw new Error("Error while getting service list");
	}
  }

  //get service by id
  export async function getServiceById(id) {
	try {
	  const response = await api.get(`/api/v2/services/${id}`, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  if (error.response && error.response.status === 404) {
		throw new Error("Not found service");
	  }
	  throw new Error("Error while getting service");
	}
  }

  //Get services within the price range
  export async function getServicesByPriceRange(minPrice, maxPrice) {
	try {
	  const response = await api.get(`/api/v2/services/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw new Error("Error when getting list of services by price range");
	}
  }

  //Check the existence of the service
  export async function checkServiceExists(id) {
	try {
	  const response = await api.get(`/api/v2/services/exists/${id}`, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw new Error("Error checking service existence");
	}
  }

  //Get service by name
  export async function getServiceByName(serviceName) {
	try {
	  const response = await api.get(`/api/v2/services/name/${serviceName}`, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  if (error.response && error.response.status === 404) {
		throw new Error("Service not found");
	  }
	  throw new Error("Error getting service information by name");
	}
  }

  //Add new service (ADMIN only)
  export async function addService(simpleService) {
	try {
	  const response = await api.post("/api/v2/services/add", simpleService, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  throw new Error("Error when adding new service");
	}
  }

  //Update or create new services(ADMIN only)
  export async function saveService(id, serviceEdit) {
	try {
	  const response = await api.post(`/api/v2/services/${id}`, serviceEdit, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  if (error.response && error.response.status === 400) {
		throw new Error(error.response.data);
	  }
	  throw new Error("Error when updating or creating a new service");
	}
  }

  //Delete service by ID(ADMIN only)
  export async function deleteService(id) {
	try {
	  const response = await api.delete(`/api/v2/services/${id}`, { headers: getHeader() });
	  if (response.status === 200 || response.status === 204) {
		return { success: true, message: "Service was successfully deleted" };
	  } else {
		throw new Error("Unable to delete service");
	  }
	} catch (error) {
	  console.error("Error while deleting service:", error);
	  if (error.response) {
		switch (error.response.status) {
		  case 404:
			throw new Error("Service does not exist or has been removed");
		  case 403:
			throw new Error("You do not have permission to delete this service.");
		  default:
			throw new Error("Error deleting service. Please try again later.");
		}
	  }
	  throw new Error("Connection error. Please check your network connection and try again.");
	}
  }

  /*Branch Management API Functions*/

  export async function getAllBranches() {
	try {
	  const response = await api.get("/api/v2/branches/all", {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  throw new Error(`Error fetching all branches: ${error.message}`);
	}
  }
  

  export async function getBranchById(id) {
	try {
	  const response = await api.get(`/api/v2/branches/${id}`, {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  if (error.response && error.response.status === 404) {
		throw new Error("Branch not found");
	  }
	  throw new Error(`Error fetching branch: ${error.message}`);
	}
  }

  export async function getBranchesByCity(city) {
	try {
	  const response = await api.get(`/api/v2/branches/city/${city}`, {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  throw new Error(`Error fetching branches by city: ${error.message}`);
	}
  }

  export async function getRoomsByBranchId(branchId) {
	try {
	  const response = await api.get(`/api/v2/branches/${branchId}/rooms`, {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  throw new Error(`Error fetching rooms for branch: ${error.message}`);
	}
  }

  export async function addBranch(branch) {
	try {
	  const response = await api.post("/api/v2/branches", branch, {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  throw new Error(`Error adding new branch: ${error.message}`);
	}
  }

  export async function deleteBranch(id) {
	try {
	  const response = await api.delete(`/api/v2/branches/${id}`, {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  throw new Error(`Error deleting branch: ${error.message}`);
	}
  }

  export async function addServiceToBranch(branchId, serviceId) {
	try {
	  const response = await api.put(`/api/v2/branches/${branchId}/services/add?serviceId=${serviceId}`, null, {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  throw new Error(`Error adding service to branch: ${error.message}`);
	}
  }

  export async function removeServiceFromBranch(branchId, serviceId) {
	try {
	  const response = await api.put(`/api/v2/branches/${branchId}/services/remove?serviceId=${serviceId}`, null, {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  throw new Error(`Error removing service from branch: ${error.message}`);
	}
  }

 /* This function changes the user's password */
 export async function changePassword(userId, newPassword, confirmPassword) {
    try {
        const response = await api.put(
            `/api/v2/user/changePassword/${userId}`,
            { newPassword, confirmPassword }, // Chỉ gửi các trường cần thiết
            {
                headers: getHeader(), // Đảm bảo có Authorization header
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
			console.error("Error sending verification email:", error);
            throw new Error(error.response.data);
        } else {
            throw new Error(`Password change error: ${error.message}`);
        }
    }
}

/* This function verifies the OTP and resets the user's password */
export async function verifyAndChangePassword(email, otp, newPassword, confirmPassword) {
	try {
	  const response = await api.put(
		`/api/v2/forgot-password/verify-and-change-password/${email}`,
		{ newPassword, confirmPassword }, // Request body containing password details
		{
		  params: { otp }, // Passing OTP as query parameter
		}
	  );
	  return response.data;
	} catch (error) {
	  if (error.response && error.response.data) {
		
		throw new Error(error.response.data);
	  } else {
		throw new Error(`Error changing password: ${error.message}`);
	  }
	}
  }

  //* This function resets password for user forgot password  */
/**
 * Gửi mã xác minh OTP qua email
 * @param {string} email - Địa chỉ email người dùng
 * @returns {Promise} - Phản hồi từ server
 */
 export const sendVerificationEmail = async (email) => {
   try {
	 const response = await api.post(`/api/v2/forgot-password/verify-mail/${email}`);
	 return response.data; // trả về nội dung từ phản hồi của server
   } catch (error) {
		console.log("Error sending verification email:", error);
	 	throw error.response ? error.response.data : new Error("Failed to send verification email.");
   }
 };
 
 /**
  * Xác minh mã OTP và thay đổi mật khẩu
  * @param {string} email - Địa chỉ email người dùng
  * @param {number} otp - Mã OTP
  * @param {Object} changePassword - Đối tượng chứa mật khẩu mới và mật khẩu xác nhận
  * @returns {Promise} - Phản hồi từ server
  */
 export const verifyOtpAndChangePassword = async (email, otp, changePassword) => {
	try {
	  console.log("changePassword:", changePassword); // In ra để kiểm tra
	  console.log("otp:", otp); // In ra để kiểm tra

	  if (!changePassword.newPassword || !changePassword.confirmPassword) {
		throw new Error("Both newPassword and confirmPassword must be provided.");
	  }
	  
	  const response = await api.put(
		`/api/v2/forgot-password/verify-and-change-password/${email}`,
		changePassword,
		{
		  params: { otp: otp },
		}
	  );
	  return response.data; // trả về nội dung từ phản hồi của server
	} catch (error) {
		console.error("Error while changing password:", error);
		toast.error("Something went wrong. Please try again.");
		throw error.response ? error.response.data : new Error("Failed to verify OTP or change password.");
	}
 };
 