import axios from "axios";

export const api = axios.create({
	baseURL: "http://localhost:8080"
})

/* Header to Authorize */
export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization : `Bearer ${token}`,
		"Content-Type" : "application/json"
	}
}

/* This is function to register a user */
export async function registerUser(registration) {
	try {
		const response = await api.post("auth/register-user", registration)
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
		const response = await api.post("auth/login", login)
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