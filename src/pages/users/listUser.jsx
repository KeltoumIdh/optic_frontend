import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    CaretSortIcon,
} from "@radix-ui/react-icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import Loader from "@/components/loader";


export const DataTableDemo = () => {
    const [users, setUsers] = useState([]);
    const { toast } = useToast();
    const navigate = useNavigate();

    const { csrf } = useAuth()

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                await csrf();
                const response = await axiosClient.get("/api/users");
                if (response.status === 200) {
                    setUsers(response.data);
                } else {
                    throw new Error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            await csrf();
            const response = await axiosClient.delete(`/api/users/delete/${userId}`);
            if (response.status === 204) {
               
                toast({
                    title: "Success",
                    description: "User deleted successfully!",
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
   

    return loading ? <Loader /> : (
        <div className="w-full">
             <div className="flex p-2 justify-between">
                <h4 className="text-2xl font-semibold dark:text-gray-300">
                    Users
                </h4>
                <button
                    className=" select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none inline-block"
                    type="button"
                >
                    <Link className={"flex items-center"} to={"/user/add"}>
                        {" "}
                        Ajouter
                    </Link>
                </button>
            </div>
            {/* <div className="flex items-end py-4">
                <Input placeholder="Filter emails..." className="max-w-sm" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       
                    </DropdownMenuContent>
                   
                </DropdownMenu>
                <div className="p-2">
                        <Link to="/user/add">
                            <Button variant="outline">Add User</Button>
                        </Link>
                    </div>
            </div> */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                           
                            <TableHead>Name</TableHead>
                            <TableHead>
                                <Button variant="ghost">
                                    Email{" "}
                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                              
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    {/* <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                                <DotsHorizontalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <Link to={`/user/edit/${user.id}`}>
                                              <DropdownMenuItem>
                                                <div className="flex items-center space-x-1">
                                                  <Pencil size={18} strokeWidth={1} />
                                                  <span>Edit</span>
                                                </div>
                                              </DropdownMenuItem>
                                            </Link>

                                            <DropdownMenuItem>
                                              <button
                                                className="flex items-center space-x-1"
                                                onClick={() => deleteUser(user.id)}
                                              >
                                                <Trash2 size={18} strokeWidth={1} />
                                                <span>Delete</span>
                                              </button>
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu> */}
                                      <Button className="bg-blue-400 mr-2">
                                        <Link
                                           to={`/user/edit/${user.id}`}
                                        >
                                            Edit
                                        </Link>
                                    </Button>
                                 
                                    <Button
                                        className="bg-red-500"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {/* Row selection information */}
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm">
                        Previous
                    </Button>
                    <Button variant="outline" size="sm">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
