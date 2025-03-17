'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, User, Mail, Clock } from 'lucide-react';

interface AuthorRequest {
  id: number;
  user_id: number;
  status: string;
  username: string;
  email: string;
  created_at: string;
}

export default function AuthorRequestsTable() {
  const [requests, setRequests] = useState<AuthorRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch('/api/author-requests');
      const data = await response.json();
      setRequests(data);
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    const response = await fetch(`/api/author-requests/${id}/approve`, {
      method: 'PUT',
    });
    if (response.ok) {
      setRequests(requests.filter((req) => req.id !== id));
    }
  };

  const handleReject = async (id: number) => {
    const response = await fetch(`/api/author-requests/${id}/reject`, {
      method: 'PUT',
    });
    if (response.ok) {
      setRequests(requests.filter((req) => req.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Pending Author Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{request.username}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {request.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex items-center bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex items-center bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Requested on: {new Date(request.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}