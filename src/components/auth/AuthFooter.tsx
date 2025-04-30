
import React from "react";

const AuthFooter: React.FC = () => {
  return (
    <div className="mt-10 text-center text-darcare-beige/50 text-sm">
      By continuing, you agree to our{" "}
      <button className="text-darcare-gold ml-1 mr-1 hover:underline">Terms of Service</button>
      and
      <button className="text-darcare-gold ml-1 hover:underline">Privacy Policy</button>
    </div>
  );
};

export default AuthFooter;
