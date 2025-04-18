
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu, Home, FileText, Compass, Settings, LogOut, UserCircle } from "lucide-react";
import Logo from "./Logo";

interface DrawerMenuProps {
  onLogout: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ onLogout }) => {
  const menuItems = [
    { icon: <Home size={20} />, label: "Home", path: "/home" },
    { icon: <FileText size={20} />, label: "Requests", path: "/requests" },
    { icon: <Compass size={20} />, label: "Recommendations", path: "/recommendations" },
    { icon: <UserCircle size={20} />, label: "Profile", path: "/profile" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-10 h-10 flex items-center justify-center text-darcare-beige hover:text-darcare-gold">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-darcare-navy border-r border-darcare-gold/20 w-72">
        <SheetHeader className="text-left mb-8 mt-4">
          <SheetTitle>
            <Logo size="sm" color="gold" />
          </SheetTitle>
        </SheetHeader>

        <div className="luxury-card mb-6">
          <h3 className="font-serif text-darcare-gold text-lg mb-2">Villa Amira</h3>
          <p className="text-darcare-beige/70 text-sm mb-1">Palmeraie, Marrakech</p>
          <div className="flex justify-between text-sm text-darcare-beige/90">
            <span>Apr 20 - Apr 27, 2025</span>
            <span>7 nights</span>
          </div>
        </div>

        <nav className="space-y-1 mb-8">
          {menuItems.map((item, index) => (
            <a 
              key={index}
              href={item.path}
              className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 rounded-lg transition-colors"
            >
              <span className="text-darcare-gold">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 rounded-lg transition-colors w-full mt-auto"
        >
          <span className="text-darcare-gold"><LogOut size={20} /></span>
          <span>Log Out</span>
        </button>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerMenu;
