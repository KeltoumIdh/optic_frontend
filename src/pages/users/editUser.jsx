import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosUser } from "../../api/axios";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import Loader from "@/components/loader";
import Spinner from "@/components/Spinner";
import { Loader2 } from "lucide-react";

const EditUser = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { csrf } = useAuth();

  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await csrf();
        const response = await axiosClient.get(`/api/users/edit/${id}`);
        if (response.status === 200) {
          setUserData(response.data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const [isProgress, setInProgress] = useState(false);
  const updateUser = async () => {
    try {
      setInProgress(true);
      await csrf();
      const response = await axiosClient.put(
        `/api/users/update/${id}`,
        userData
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "User updated successfully!",
        });
        navigate("/user/list");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setInProgress(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="w-full">
      <div className="flex items-center py-2">
        <Link to={"/user/list"} className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="md:w-6 w-4 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h2 className="md:text-2xl font-semibold dark:text-gray-300">
          Modifier utilisateur
        </h2>
      </div>
      <div>
        <label>Name</label>
        <Input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email</label>
        <Input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
      </div>
      {/* <div>
        <label>Role</label>
        <Input
          type="text"
          name="role"
          value={userData.role}
          onChange={handleChange}
        />
      </div> */}
      <div className="py-2">
        <label>Rôle</label>
        <select name="role" value={userData.role} onChange={handleChange} className="px-2 py-1 mx-2 bg-white">
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label>Password</label>
        <Input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
      </div>
      <div className="py-4">
        <Button onClick={updateUser}>
          Modifier {isProgress && <Loader2 className="animate-spin ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default EditUser;
