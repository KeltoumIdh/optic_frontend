import React from "react";
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
import { useAuth } from "@/hooks/useAuth";



export const Informations = () => {

    const { authUser } = useAuth()

    return (
        <div className="w-1/2 max-lg:w-full lg:m-2 my-2 h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardDescription>Informations</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                            type="text"
                            id="name"
                            value={authUser?.data?.name}
                            disabled
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5 mt-8">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            value={authUser?.data?.email}
                            disabled
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5 mt-8">
                        <Label htmlFor="role">Role</Label>
                        <Input
                            type="text"
                            id="role"
                            value={authUser?.data?.role}
                            disabled
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

    );
};

export default Informations;
