'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.push('/admin/home');
      } else if (session?.user?.role === 'author') {
        router.push('/');
      } else {
        router.push('/');
      }
    }
  }, [session, status, router]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    console.log('Form data:', formData); // Log data form
  
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
  
    console.log('SignIn result:', result); // Log hasil signIn
  
    if (result?.error) {
      setError(result.error);
    } else {
      // Redirect berdasarkan role
      if (result?.url) {
        router.push(result.url);
      }
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

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative w-36 h-36 mb-2">
              <Image
                src="/logo2.png"
                alt="Review Film Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h3 className="text-3xl font-medium text-center">Sign-In</h3>
          </div>

          {/* Login Form */}
          <form className="space-y-6 rounded-xl" onSubmit={handleSubmit}>
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
                placeholder="Email address"
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
                  placeholder="Enter password"
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

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </button>
            </div>

            {/* Sign in button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign in
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;