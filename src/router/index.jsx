import {createBrowserRouter} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Layout from "../Layouts/Layout";
import App from "../Layouts/App";
import Clients from "../pages/clients/Clients";
import Activities from "../pages/Activities";
import ClientAdd from "../pages/clients/ClientAdd";
import ClientEdit from "../pages/clients/ClientEdit";
import Products from "../pages/products/Products";
import ProductEdit from "../pages/products/ProductEdit";
import ProductAdd from "../pages/products/ProductAdd";
import Orders from "../pages/orders/Orders";
import OrderEdit from "../pages/orders/OrderEdit";
import OrderAdd from "../pages/orders/OrderAdd";
import OrderDetails from "../pages/orders/OrderDetails";
import OrderProductsAdd from "../pages/orders/OrderProductsAdd";
import OrderConfirmed from "../pages/orders/OrderConfirmed";
import Checkout from "../pages/orders/Checkout";
import Profile from "../pages/profile";
import { DataTableDemo } from "../pages/users/listUser";
import ProfileForm from "../pages/users/addUser";
import EditUser from "../pages/users/editUser";
import ProductDetails from "../pages/products/ProductDetails";
import { DataTable } from "../pages/ListCheck";
import ClientDetails from "../pages/clients/ClientDetails";
import Invoice from "../pages/invoice/Invoice";
import { FactureTable } from "../pages/Facture";


export const router = createBrowserRouter([
    {
        // element: <Layout/>,
        element: <App/>,
        children:[
            {
                path: "/",
                element: <Home/>,
            },

            {
                path: "/clients",
                element: <Clients/>,
            },
            {
                path: "/clients/add",
                element: <ClientAdd/>,
            },
            {
                path: "/clients/edit/:id",
                element: <ClientEdit/>,
            },
            {
                path: "/clients/details/:id",
                element: <ClientDetails/>,
            },
            {
                path: "/products",
                element: <Products/>,
            },
            {
                path: "/products/add",
                element: <ProductAdd/>,
            },
            {
                path: "/products/edit/:id",
                element: <ProductEdit/>,
            },
            {
                path: "/products/details/:id",
                element: <ProductDetails/>,
            },
            {
                path: "/orders",
                element: <Orders/>,
            },
            {
                path: "/orders/products/add/:id",
                element: <OrderProductsAdd/>,
            },
            {
                path: "/orders/confirmed",
                element: <OrderConfirmed/>,
            },
            {
                path: "/checkout",
                element: <Checkout/>,
            },
            {
                path: "/orders/add",
                element: <OrderAdd/>,
            },
            {
                path: "/orders/edit/:id",
                element: <OrderEdit/>,
            },
            {
                path: "/orders/details/:id",
                element: <OrderDetails/>,
            },
            {
                path: "/view-invoice/:id",
                element: <Invoice/>,
            },
            {
                path: '/profile',
                element: <Profile/>,
            },
            {
                path: '/user/list',
                element: <DataTableDemo/>,
            },
            {
                path: '/user/add',
                element: <ProfileForm/>,
            },
            {
                path: '/user/edit/:id',
                element: <EditUser/>,
            },
            {
                path: '/check/list',
                element: <DataTable/>,
            },
            {
                path: '/Facture/list',
                element: <FactureTable/>,
            },
            {
                path: '/activities',
                element: <Activities/>,
            },
            {
                path: '*',
                element: <NotFound/>,
            },
        ]
        

    },

    {
        path: "/login",
        element: <Login/>,
    }
])
