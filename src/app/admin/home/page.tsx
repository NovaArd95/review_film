"use client";

import React, { useState, useEffect } from "react";
import { Film, Users, Star } from 'lucide-react';

interface Stats {
  totalFilms: number;
  totalUsers: number;
  totalAuthors: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalFilms: 0,
    totalUsers: 0,
    totalAuthors: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch films count
        const filmsResponse = await fetch('/api/films');
        const filmsData = await filmsResponse.json();
        
        // Fetch users count
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        
        setStats({
          totalFilms: filmsData.length,
          totalUsers: usersData.filter((user: any) => user.role === 'user').length,
          totalAuthors: usersData.filter((user: any) => user.role === 'author').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Film Statistics Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Film className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Films</p>
                  <h3 className="text-2xl font-bold text-gray-700">{stats.totalFilms}</h3>
                </div>
              </div>
            </div>

            {/* Users Statistics Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-700">{stats.totalUsers}</h3>
                </div>
              </div>
            </div>

            {/* Authors Statistics Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Authors</p>
                  <h3 className="text-2xl font-bold text-gray-700">{stats.totalAuthors}</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            {/* Add your recent activity content here */}
            <p className="text-gray-500">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
