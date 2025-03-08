'use client';
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
    profile_picture: null as File | null,
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profile_picture: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('password', formData.password);
    if (formData.profile_picture) {
      formDataToSend.append('profile_picture', formData.profile_picture);
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        router.push('/auth/login');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Terjadi kesalahan saat mendaftarkan user.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/Login.png"
          alt="Lighthouse scene"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 m-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 ">
                <Image
                  src="/logo2.png"
                  alt="Review Film Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-medium text-center">Create your account</h3>

          {/* Register Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username"
                required
              />
            </div>

            {/* Age Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="0"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your age"
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Profile Picture Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {/* Register button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500"
            >
              Sign Up
            </button>

            {/* Sign in link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;