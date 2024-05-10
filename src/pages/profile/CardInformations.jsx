import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosUser } from "../../api/axios";
export const Informations = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('optic-token');
          const response = await axiosUser.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
      };
  
      fetchUserData();
    }, []);
    return (

        
        
        <>
            {/* {user ? ( */}
                <div className="w-1/2 m-2 h-full">
                    <Card className="h-full">
                        <CardHeader>
                            <CardDescription>Informations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={user?.name}
                                    disabled
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5 mt-8">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={user?.email}
                                    disabled
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5 mt-8">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    type="text"
                                    id="role"
                                    value={user?.role}
                                    disabled
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            {/* ) : null} */}
        </>
    
    );
};

export default Informations;
