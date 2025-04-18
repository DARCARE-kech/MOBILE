
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-darcare-navy flex flex-col items-center justify-center p-6 text-center">
      <Logo size="md" color="gold" />
      
      <h1 className="font-serif text-4xl text-darcare-gold mt-8 mb-4">Page Not Found</h1>
      <p className="text-darcare-beige/80 mb-8 max-w-md">
        We couldn't find the page you were looking for. Please check the URL or return to home.
      </p>
      
      <button 
        onClick={() => navigate("/")}
        className="button-primary mt-4"
      >
        <ArrowLeft size={18} className="mr-2" />
        Return to Home
      </button>
    </div>
  );
};

export default NotFound;
