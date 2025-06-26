"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  QrCode,
  Printer,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import { TUser } from "@/models/user.model";

interface EmployeeIdCardProps {
  user: TUser;
  showActions?: boolean;
}

export default function EmployeeIdCard({
  user,
  showActions = true,
}: EmployeeIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handlePrint = () => {
    // Temporarily reset to front side for printing
    const wasFlipped = isFlipped;
    setIsFlipped(false);

    setTimeout(() => {
      const frontCard = document.querySelector('[data-card-side="front"]');
      if (frontCard) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Employee ID Card - ${user.firstName} ${
                  user.lastName
                }</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0; 
                    padding: 20px; 
                    background: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                  }                  .card { 
                    width: 350px;
                    height: 500px;
                    background: #4f46e5;
                    background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #8b5cf6 100%);
                    border-radius: 12px;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }                  .header {
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(10px);
                    padding: 16px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                  .logo-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 8px;
                  }
                  .logo {
                    width: 32px;
                    height: 32px;
                    background: white;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: #4f46e5;
                  }                  .company-name {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  }
                  .subtitle {
                    font-size: 12px;
                    opacity: 0.95;
                    margin: 0;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  }
                  .photo-section {
                    text-align: center;
                    padding: 24px 16px;
                    flex: 1;
                  }                  .avatar {
                    width: 96px;
                    height: 96px;
                    background: rgba(255,255,255,0.25);
                    border: 4px solid rgba(255,255,255,0.4);
                    border-radius: 50%;
                    margin: 0 auto 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    font-weight: bold;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }                  .name {
                    font-size: 20px;
                    font-weight: bold;
                    margin: 0 0 8px 0;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  }
                  .designation {
                    font-size: 14px;
                    opacity: 0.95;
                    margin: 0 0 12px 0;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  }.role-badge {
                    display: inline-block;
                    padding: 6px 14px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    background: ${
                      user.role === "admin"
                        ? "rgba(251, 191, 36, 0.9)"
                        : "rgba(34, 197, 94, 0.9)"
                    };
                    border: 1px solid ${
                      user.role === "admin"
                        ? "rgba(251, 191, 36, 1)"
                        : "rgba(34, 197, 94, 1)"
                    };
                    color: ${user.role === "admin" ? "#92400e" : "#14532d"};
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                  .info-section {
                    padding: 0 24px 16px;
                  }
                  .info-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                  }
                  .info-icon {
                    width: 16px;
                    height: 16px;
                    opacity: 0.8;
                  }
                  .info-content {
                    flex: 1;
                  }                  .info-label {
                    font-size: 11px;
                    opacity: 0.9;
                    margin: 0;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  }
                  .info-value {
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  }.footer {
                    background: rgba(0,0,0,0.3);
                    padding: 12px;
                    text-align: center;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }                  .footer-text {
                    font-size: 11px;
                    opacity: 0.95;
                    margin: 0 0 4px 0;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  }
                  .status-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                  }
                  .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${
                      user.status === "active" ? "#22c55e" : "#ef4444"
                    };
                  }                  .status-text {
                    font-size: 11px;
                    text-transform: capitalize;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  }@media print {
                    * {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                      color-adjust: exact !important;
                    }
                    body { 
                      background: white !important;
                      padding: 0 !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    .card { 
                      box-shadow: none !important;
                      border: 2px solid #ddd !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                      background: #4f46e5 !important;
                    }
                    .header {
                      background: rgba(255,255,255,0.15) !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    .avatar {
                      background: rgba(255,255,255,0.25) !important;
                      border: 4px solid rgba(255,255,255,0.4) !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    .footer {
                      background: rgba(0,0,0,0.3) !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="card">
                  <div class="header">
                    <div class="logo-section">
                      <div class="logo">AS</div>
                      <div>
                        <h2 class="company-name">Austrange Solutions</h2>
                        <p class="subtitle">Employee Identification</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="photo-section">
                    <div class="avatar">
                      ${user.firstName[0]}${user.lastName[0]}
                    </div>
                    
                    <h3 class="name">${user.firstName} ${user.lastName}</h3>
                    <p class="designation">${user.designation}</p>
                    
                    <span class="role-badge">
                      ${user.role === "admin" ? "Administrator" : "Employee"}
                    </span>
                  </div>

                  <div class="info-section">
                    <div class="info-row">
                      <div class="info-content">
                        <p class="info-label">Employee ID</p>
                        <p class="info-value">${(user._id as string).slice(-8).toLocaleUpperCase()}</p>
                      </div>
                    </div>

                    ${
                      user.department
                        ? `
                    <div class="info-row">
                      <div class="info-content">
                        <p class="info-label">Department</p>
                        <p class="info-value">${user.department}</p>
                      </div>
                    </div>
                    `
                        : ""
                    }

                    <div class="info-row">
                      <div class="info-content">
                        <p class="info-label">Joined</p>
                        <p class="info-value">${formatDate(
                          user.dateOfJoining
                        )}</p>
                      </div>
                    </div>
                  </div>

                  <div class="footer">
                    <p class="footer-text">This card is property of Austrange Solutions</p>
                    <div class="status-indicator">
                      <div class="status-dot"></div>
                      <span class="status-text">${user.status}</span>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        }
      }

      // Restore the original flip state
      if (wasFlipped) {
        setIsFlipped(true);
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {showActions && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Employee ID Card
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center space-x-1"
            >
              <QrCode className="h-4 w-4" />
              <span>{isFlipped ? "Front" : "Back"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center space-x-1"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
          </div>
        </div>
      )}

      <div className="relative perspective-1000">
        <div
          ref={cardRef}
          className={`
            relative w-full h-[500px] transform-style-preserve-3d transition-transform duration-700
            ${isFlipped ? "rotate-y-180" : ""}
          `}
        >
          {" "}
          {/* Front Side */}
          <Card
            data-card-side="front"
            className={`
            absolute inset-0 w-full h-full backface-hidden
            bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700
            text-white border-0 shadow-2xl
          `}
          >
            <CardContent className="p-0 h-full">
              {/* Header */}
              <div className="bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <Image
                    src="/assets/images/Austrange Logo.png"
                    alt="Company Logo"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <div>
                    <h2 className="text-lg font-bold">Austrange Solutions</h2>
                    <p className="text-xs opacity-90">
                      Employee Identification
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Section */}
              <div className="text-center py-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/20">
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-xl font-bold mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm opacity-90 mb-2">{user.designation}</p>

                <Badge
                  className={`
                    ${
                      user.role === "admin"
                        ? "bg-yellow-500/20 text-yellow-100 border-yellow-300/30"
                        : "bg-green-500/20 text-green-100 border-green-300/30"
                    } 
                    border
                  `}
                >
                  {user.role === "admin" ? "Administrator" : "Employee"}
                </Badge>
              </div>

              {/* ID Information */}
              <div className="px-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-4 w-4 opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">Employee ID</p>
                    <p className="font-semibold">
                      {(user._id as string).slice(-8).toLocaleUpperCase()}
                    </p>
                  </div>
                </div>

                {user.department && (
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 opacity-80" />
                    <div>
                      <p className="text-xs opacity-80">Department</p>
                      <p className="font-semibold">{user.department}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">Joined</p>
                    <p className="font-semibold text-sm">
                      {formatDate(user.dateOfJoining)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/20 p-3 text-center">
                <p className="text-xs opacity-80">
                  This card is property of Austrange Solutions
                </p>
                <div className="flex justify-center items-center space-x-2 mt-1">
                  <div
                    className={`
                    w-2 h-2 rounded-full 
                    ${user.status === "active" ? "bg-green-400" : "bg-red-400"}
                  `}
                  ></div>
                  <span className="text-xs capitalize">{user.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Back Side */}
          <Card
            data-card-side="back"
            className={`
            absolute inset-0 w-full h-full backface-hidden rotate-y-180
            bg-gradient-to-br from-gray-100 to-gray-200
            border-0 shadow-2xl
          `}
          >
            <CardContent className="p-6 h-full flex flex-col">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Contact Information
                </h3>
                <div className="w-16 h-1 bg-indigo-600 mx-auto rounded"></div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Email</p>
                    <p className="text-sm text-gray-600 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Phone</p>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Address
                      </p>
                      <p className="text-sm text-gray-600">{user.address}</p>
                    </div>
                  </div>
                )}

                {user.level && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-800">Level</p>
                    <p className="text-sm text-gray-600">{user.level}</p>
                  </div>
                )}
              </div>

              {/* QR Code Placeholder */}
              <div className="mt-6 text-center">
                <div className="w-20 h-20 bg-gray-300 mx-auto rounded-lg flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Employee QR Code</p>
              </div>

              {/* Back Footer */}
              <div className="text-center mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  In case of emergency, please contact HR
                </p>
                <p className="text-xs text-gray-500">
                  Valid until:{" "}
                  {new Date(
                    new Date().getFullYear() + 1,
                    11,
                    31
                  ).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
