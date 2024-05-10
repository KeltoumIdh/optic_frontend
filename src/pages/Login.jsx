
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "../components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../components/ui/form";
// import { Input } from "../components/ui/input";
// import {Loader} from "lucide-react";
// import {axiosAuth} from "../api/axios";
// import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "../context/AuthContext";


// export default function Login() {
  
//   const navigate = useNavigate()
//   const formSchema = z.object({
//     email: z.string().email().min(2).max(30),
//     password: z.string().min(8).max(30)
//   })
 

 
//   const form = useForm({
//       resolver: zodResolver(formSchema),
//     })
//   const {setError, formState: {isSubmitting}} = form  
//   const { login, IsAuth} = useAuthContext();
//   const onSubmit = async (data) => {
//       try {
//         await axiosAuth.get('/sanctum/csrf-cookie');
//         login(data)
       
//       } catch (error) {
//         console.error('An unexpected error occurred:', error);
//       }
//     };
    
//     useEffect(() => {
    
//       console.log(IsAuth)
//       if (IsAuth) {
      
//         navigate('/')
//       }
//     }, [IsAuth]); 
  

//   return (
//     <Card className="card ">
//         <CardHeader>
//           <CardTitle>Sign In</CardTitle>
          
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>E-mail</FormLabel>
//                     <FormControl>
//                       <Input placeholder="" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder=""
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button disabled={isSubmitting} type="submit" className="w-full">
//               {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'}/>} {' '} Login
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>


  
//   );

// };

import { useContext } from "react"; // Importez useContext
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import {useUserContext} from "../context/AuthContext";

import { z } from "zod";
const formSchema = z.object({
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30)
})

export default function Login() {
  const {login, setAuthenticated, setToken} = useUserContext() 
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
  })
  const { setError, formState: { isSubmitting } } = form;

  // Définissez un gestionnaire de soumission
  const onSubmit = async values => {
    try {
      const { status, data } = login(values.email, values.password)
      .then(response => {
                const status = response.status;
              
                 console.log(status)
                 
                if (status === 204) {
                  // setToken(data.token)
                  setAuthenticated(true)
                  navigate('/');
                  console.log('La requête a réussi avec le statut 200.');
                } else {
                  console.log(`Le statut de la réponse est ${status}.`);
                }
              })
    } catch (error) {
      setError('email', {
        message: error.response.data.errors.email.join()
      });
    }
  };

  return (
    <Card className="card ">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              
            </CardHeader>
            <CardContent>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isSubmitting} type="submit" className="w-full">
                  {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'}/>} {' '} Login
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
  );
}
