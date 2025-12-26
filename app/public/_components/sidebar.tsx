import React from 'react';
import { Home, Phone, BookOpen, Info, LogOut } from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "Home", icon: <Home size={20}/>, active: true },
    { name: "Contact us", icon: <Phone size={20}/> },
    { name: "Booking", icon: <BookOpen size={20}/> },
    { name: "About Us", icon: <Info size={20}/> },
    { name: "Logout", icon: <LogOut size={20}/> },
  ];

  return (
    <div className="w-64 h-screen bg-[#FDE2E2] p-4 flex flex-col border-r border-red-100">
      <div className="bg-[#D32F2F] text-white p-4 rounded-lg mb-6">
        <p className="font-bold">Hello Hari Bahadur!</p>
        <p className="text-xs opacity-80">Where you want go</p>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <div key={item.name} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${item.active ? 'bg-white shadow-sm text-[#D32F2F]' : 'hover:bg-white/50 text-gray-700'}`}>
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}