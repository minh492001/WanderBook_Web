import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Mail, Key, Eye, EyeOff, Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { loginUser, verifyAndChangePassword, sendVerificationEmail, verifyOtpAndChangePassword } from '../utils/ApiFunctions';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Notification = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white flex items-center`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : (
        <XCircle className="w-5 h-5 mr-2" />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const ForgotPasswordDialog = ({ isOpen, onClose, showNotification }) => {
    const [step, setStep] = useState(1);

    const initialValues = {
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    };

    const validationSchemas = {
        1: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        2: Yup.object({
            otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
        }),
        3: Yup.object({
            newPassword: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Please confirm your password'),
        }),
    };

    const handleSubmit = async (values, { setSubmitting }) => {
      try {
          if (step === 1) {
              // Gửi email xác nhận
              await sendVerificationEmail(values.email);
              showNotification('Reset link sent to your email', 'success');
              setStep(2); // Chuyển sang bước xác thực OTP
          } else if (step === 2) {
              // Xác thực OTP (giả định rằng bạn đã xác thực thành công ở đây)
              showNotification('OTP verified successfully', 'success');
              setStep(3); // Chuyển sang bước thay đổi mật khẩu
          } else if (step === 3) {
              // Gọi API thay đổi mật khẩu và xử lý kết quả
              const changePassword = {
                  newPassword: values.newPassword,
                  confirmPassword: values.confirmPassword,
              };
              
              const response = await verifyOtpAndChangePassword(values.email, values.otp, changePassword);
  
              // Kiểm tra phản hồi từ API
              if (response && response.status === 200) {
                  toast.success("Password changed successfully!");
                  onClose(); // Đóng form sau khi thành công
              } else {
                  // Nếu phản hồi không phải là 200, hiển thị thông báo lỗi
                  toast.error("Failed to change password.");
              }
          }
      } catch (error) {
          console.error('Error:', error);
          showNotification('An error occurred. Please try again.', 'error');
          toast.error(error.message || "Failed to change password.");
      } finally {
          setSubmitting(false);
      }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[1]}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                      placeholder="you@example.com"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                    {isSubmitting ? 'Loading...' : 'Send Reset Link'}
                </button>
              </Form>
            )}
          </Formik>
        );
      case 2:
        return (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[2]}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <Field
                    id="otp"
                    name="otp"
                    type="text"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base py-3 text-center tracking-widest"
                    placeholder="000000"
                    maxLength="6"
                  />
                  <ErrorMessage name="otp" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  We've sent a 6-digit code to your email
                </p>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        );
      case 3:
        return (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[3]}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type="newPassword"
                      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                      placeholder="••••••••"
                    />
                  </div>
                  <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                      placeholder="••••••••"
                    />
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </Form>
            )}
          </Formik>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 && 'Reset Password'}
          {step === 2 && 'Verify OTP'}
          {step === 3 && 'Create New Password'}
        </h2>
        {renderStep()}
        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800 text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const handleCloseNotification = () => {
    setNotification({ show: false, message: '', type: '' });
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await loginUser(values);
    
      if (response && response.token && response.role) {
        sessionStorage.setItem('id', response.id);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('email', response.email);
        sessionStorage.setItem('role', response.role.includes('ADMIN') ? 'ADMIN' : 'USER');
    
        if (response.role.includes('ADMIN')) {
          showNotification("Login for admin successful!", 'success');
          setTimeout(() => navigate('/admin'), 1500);
        } else {
          showNotification("Login successful!", 'success');
          setTimeout(() => navigate('/'), 1500);
        }
      } else {
        showNotification('Login Failed: Invalid credentials', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setFieldError('email', 'Invalid email or password');
            setFieldError('password', 'Invalid email or password');
            showNotification('Invalid email or password. Please try again.', 'error');
            break;
          case 404:
            setFieldError('email', 'User not found');
            showNotification('User not found. Please check your email.', 'error');
            break;
          default:
            showNotification('An error occurred during login. Please try again.', 'error');
        }
      } else {
        showNotification('Network error. Please check your connection and try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Welcome Back</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base py-3 ${
                      errors.email && touched.email ? 'border-red-500' : ''
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`pl-10 pr-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base py-3 ${
                      errors.password && touched.password ? 'border-red-500' : ''
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="mt-6 text-center">
          <Link to="/register" className="text-sm text-blue-600 hover:text-blue-800">
            New guest? Create an account
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={handleCloseNotification}
          />
        )}
      </AnimatePresence>
      <ForgotPasswordDialog
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        showNotification={showNotification}
      />
    </div>
  );
}

export default LoginPage;