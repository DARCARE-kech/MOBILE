
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, Eye, Shield } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const PrivacySecurityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Privacy & Security" onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20 mb-6">
          <h2 className="text-xl font-serif text-darcare-gold mb-4">Account Security</h2>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <Key className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">Change Password</span>
                <p className="text-sm text-darcare-beige/60">Last changed 30 days ago</p>
              </div>
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-darcare-gold" />
                <div>
                  <span className="text-darcare-beige">Two-Factor Authentication</span>
                  <p className="text-sm text-darcare-beige/60">Add an extra layer of security</p>
                </div>
              </div>
              <Switch id="2fa" />
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-darcare-gold" />
                <div>
                  <span className="text-darcare-beige">Login Notifications</span>
                  <p className="text-sm text-darcare-beige/60">Get alerted of new logins</p>
                </div>
              </div>
              <Switch id="login-notifications" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20">
          <h2 className="text-xl font-serif text-darcare-gold mb-4">Privacy</h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-darcare-gold" />
                <div>
                  <span className="text-darcare-beige">Data Privacy</span>
                  <p className="text-sm text-darcare-beige/60">Control how your data is used</p>
                </div>
              </div>
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center justify-between gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-darcare-gold" />
                <div className="flex-1">
                  <span className="text-darcare-beige">Privacy Policy</span>
                  <p className="text-sm text-darcare-beige/60">View our privacy policy</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
