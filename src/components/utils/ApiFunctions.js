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
export const addNewRoom = async (roomData) => {
    try {
        console.log('Sending payload to API:', roomData); // Log payload
        const response = await api.post('/api/v2/rooms/add', roomData, {
            headers: getHeader(), // Sử dụng hàm getHeader
        });
        console.log('API response:', response.data); // Log phản hồi từ API
        return response.data;
    } catch (error) {
        console.error('Error adding new room:', error.response?.data || error.message); // Log lỗi chi tiết
        throw error;
    }
};


/* This function updates a room */
export async function updateRoom(roomId, roomData) {
    try {
        console.log("Updating room with ID:", roomId); // Log roomId
        if (!roomId) {
            throw new Error("Room ID is required for updating.");
        }

        const response = await api.put(`/api/v2/rooms/${roomId}`, roomData, { headers: getHeader() });
        return response.data; // Trả về dữ liệu đã cập nhật
    } catch (error) {
        console.error(`Error updating room: ${error.message}`);
        throw error;
    }
}


/* This function delete a room */
export const deleteRoom = async (roomId) => {
	try {
	  const response = await api.delete(`/api/v2/rooms/${roomId}`, { headers: getHeader() });
	  return response.data;
	} catch (error) {
	  console.error(`Error deleting room: ${error.response ? error.response.data : error.message}`);
	  throw new Error('Could not delete room. Please try again later.');
	}
  };


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
        const response = await api.get(`/api/v2/enums/rooms/types`, {
            headers: getHeader()
        });
        return response.data; // Return list of rooms matching criteria
    } catch (error) {
        console.error(`Error fetching rooms type: ${error.message}`);
        throw error;
    }
};



/* This function gets all bookings from the database */
export const getAllBookings = async () => {
	try {
		const result = await api.get("/api/v2/bookings/all", {
			headers: getHeader(), // Sử dụng getHeader để lấy headers
		});
		return result.data; // Trả về danh sách booking
	} catch (error) {
		throw new Error(`Error fetching bookings: ${error.message}`);
	}
};

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
export async function bookRoom(booking) {
	// Kiểm tra xem đối tượng booking có hợp lệ không
	if (!booking || typeof booking !== 'object') {
		throw new Error('Invalid booking data');
	}

	try {
		// Gửi yêu cầu POST đến API để tạo đặt phòng
		const response = await api.post(`/api/v2/bookings`, booking, {
			headers: getHeader() // Thêm headers với token xác thực
		});

		// Trả về dữ liệu phản hồi từ máy chủ
		return response.data;
	} catch (error) {
		// Xử lý lỗi từ phản hồi của máy chủ
		if (error.response && error.response.data) {
			// Nếu có thông điệp lỗi từ máy chủ, sử dụng nó
			throw new Error(error.response.data.message || 'Error booking room');
		} else {
			// Nếu không, sử dụng thông điệp lỗi chung
			throw new Error(`Error booking room: ${error.message}`);
		}
	}
}

/* This function cancels booking */
export async function cancelBooking(bookingId) {
	try {
		const result = await api.delete(`/api/v2/bookings/${bookingId}`, {
			headers: getHeader(),
		});
		return result.data;
	} catch (error) {
		throw new Error(`Error cancelling booking: ${error.message}`);
	}
}

export async function updateBooking(id, bookingData) {
	try {
		const response = await api.put(
				`/api/v2/bookings/${id}`,
				bookingData,
				{ headers: getHeader() }
		);

		return response.data; // Dữ liệu trả về từ server.
	} catch (error) {
		throw new Error(`Error updating booking: ${error.message}`);
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

export const updateBranch = async (id, branchData) => {
	try {
		// Gửi PUT request để cập nhật chi nhánh
		const response = await api.put(`/api/v2/branches/${id}`, branchData, {
			headers: getHeader(),
		});

		// Xử lý phản hồi nếu thành công
		console.log('Updated branch:', response.data);
		return response.data; // Trả về chi nhánh đã cập nhật
	} catch (error) {
		console.error('Error updating branch:', error.response ? error.response.data : error.message);
		throw error; // Ném lỗi nếu có lỗi xảy ra
	}
};

  //Update or create new services(ADMIN only)
export async function saveService(id, serviceEdit) {
	try {
		// Sử dụng phương thức PUT thay vì POST
		const response = await api.put(`/api/v2/services/${id}`, serviceEdit, { headers: getHeader() });
		return response.data;
	} catch (error) {
		// Kiểm tra lỗi và trả về thông báo phù hợp
		if (error.response && error.response.status === 400) {
			throw new Error(error.response.data);
		}
		throw new Error("Error when updating the service");
	}
}

export async function deleteService(id) {
	try {
		// Gửi yêu cầu DELETE đến endpoint tương ứng
		const response = await api.delete(`/api/v2/services/${id}`, { headers: getHeader() });

		// Kiểm tra mã trạng thái phản hồi
		if (response.status === 200 || response.status === 204) {
			return { success: true, message: "Service was successfully deleted" };
		} else {
			throw new Error("Unable to delete service");
		}
	} catch (error) {
		console.error("Error while deleting service:", error);

		// Xử lý các lỗi cụ thể
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

		// Xử lý lỗi kết nối
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
		console.error("Detailed error in getAllBranches:", error);
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.error("Error response data:", error.response.data);
			console.error("Error response status:", error.response.status);
			console.error("Error response headers:", error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			console.error("Error request:", error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error("Error message:", error.message);
		}
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

export async function getRoomsByBranchIdAndState(branchId, state) {
	try {
		const response = await api.get(`/api/v2/rooms/branch/${branchId}/state/${state}`, {
			headers: getHeader() // Thêm headers với token xác thực
		});
		return response.data; // Trả về danh sách phòng
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

