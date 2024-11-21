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

/* This function gets all rooms with future bookings */
export async function getAllRoomsWithFutureBookings() {
    try {
        const response = await api.get("/api/v2/rooms/all", { headers: getHeader() });
        return response.data; // Return the list of rooms
    } catch (error) {
        console.error(`Error fetching rooms: ${error.message}`);
        throw error; // Rethrow the error for further handling in the UI
    }
}


/* This function gets a room by its ID */
export async function getRoomById(roomId) {
    try {
        const response = await api.get(`/api/v2/rooms/${roomId}`, { headers: getHeader() });
        return response.data; // Return the room details
    } catch (error) {
        console.error(`Error fetching room by ID: ${error.message}`);
        throw error;
    }
}


/* This function adds a new room */
export async function addNewRoom(roomData) {
    try {
        const response = await api.post("/api/v2/rooms/add", roomData, { headers: getHeader() });
        return response.data; // Return the added room details
    } catch (error) {
        console.error(`Error adding new room: ${error.message}`);
        throw error;
    }
}


/* This function updates a room */
export async function updateRoom(roomId, roomData) {
    try {
        const response = await api.put(`/api/v2/rooms/${roomId}`, roomData, { headers: getHeader() });
        return response.data; // Return the updated room details
    } catch (error) {
        console.error(`Error updating room: ${error.message}`);
        throw error;
    }
}


/* This function deletes a room */
export async function deleteRoom(roomId) {
    try {
        const response = await api.delete(`/api/v2/rooms/${roomId}`, { headers: getHeader() });
        return response.data; // Return confirmation of deletion
    } catch (error) {
        console.error(`Error deleting room: ${error.message}`);
        throw error;
    }
}


/* This function checks if a room exists by its number */
export async function checkRoomExistsByNumber(roomNumber) {
    try {
        const response = await api.get(`/api/v2/rooms/exists?roomNumber=${roomNumber}`, { headers: getHeader() });
        return response.data; // Return boolean indicating existence
    } catch (error) {
        console.error(`Error checking room existence: ${error.message}`);
        throw error;
    }
}

/* This function gets rooms by their state */
export async function getRoomsByState(state) {
    try {
        const response = await api.get(`/api/v2/rooms/state/${state}`, { headers: getHeader() });
        return response.data; // Return list of rooms in the specified state
    } catch (error) {
        console.error(`Error fetching rooms by state: ${error.message}`);
        throw error;
    }
}


/* This function gets rooms by type and price range */
export async function getRoomsByTypeAndPrice(roomType, minPrice, maxPrice) {
    try {
        const response = await api.get(`/api/v2/rooms/type-price`, {
            params: { roomType, minPrice, maxPrice },
            headers: getHeader()
        });
        return response.data; // Return list of rooms matching criteria
    } catch (error) {
        console.error(`Error fetching rooms by type and price range: ${error.message}`);
        throw error;
    }
}

export const getRoomTypes = async () => {
    try {
        const response = await api.get(`/api/v2/rooms/room-types`, {
            headers: getHeader()
        });
        return response.data; // Return list of rooms matching criteria
    } catch (error) {
        console.error(`Error fetching rooms type: ${error.message}`);
        throw error;
    }
};



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
            { newPassword, confirmPassword },
            {
                headers: getHeader(), // Đảm bảo có Authorization header
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Error changing password:", error);
            throw new Error(error.response.data);
        } else {
            throw new Error(`Password change error: ${error.message}`);
        }
    }
}

/**
 * Xác minh mã OTP và thay đổi mật khẩu
 * @param {string} email - Địa chỉ email người dùng
 * @param {number} otp - Mã OTP
 * @param {Object} changePassword - Đối tượng chứa mật khẩu mới và mật khẩu xác nhận
 * @returns {Promise} - Phản hồi từ server
 */export const verifyAndChangePassword = async (email, otp, changePassword) => {
    try {
        const response = await api.put(
            `/api/v2/forgot-password/verify-and-change-password/${email}`,
            changePassword,
            { params: { otp } }
        );
        return response.data; // Trả về nội dung từ phản hồi của server
    } catch (error) {
        console.error("Error while changing password:", error);
        if (error.response && error.response.data) {
            console.error("Server responded with:", error.response.data);
            throw new Error(error.response.data); // Trả về thông điệp lỗi từ server
        } else {
            throw new Error(`Error changing password: ${error.message}`); // Trả về thông điệp lỗi chung
        }
    }
};

/**
 * Gửi mã xác minh OTP qua email
 * @param {string} email - Địa chỉ email người dùng
 * @returns {Promise} - Phản hồi từ server
 */
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
            { params: { otp } }
        );
        return response.data; // trả về nội dung từ phản hồi của server
    } catch (error) {
        console.error("Error while changing password:", error);
        toast.error("Something went wrong. Please try again.");
        throw error.response ? error.response.data : new Error("Failed to verify OTP or change password.");
    }
};

