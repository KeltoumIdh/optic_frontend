import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Shield } from "lucide-react";

export const Informations = () => {
  const { authUser } = useAuth();

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-gray-500" />
          Personal Information
        </h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <User className="h-4 w-4" />
              <span className="text-sm">Full Name</span>
            </div>
            <Input
              type="text"
              value={authUser?.data?.name}
              className="bg-gray-50 border-0 focus:ring-0"
              disabled
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">Email Address</span>
            </div>
            <Input
              type="email"
              value={authUser?.data?.email}
              className="bg-gray-50 border-0 focus:ring-0"
              disabled
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Account Role</span>
            </div>
            <Input
              type="text"
              value={authUser?.data?.role}
              className="bg-gray-50 border-0 focus:ring-0 capitalize"
              disabled
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Informations;
