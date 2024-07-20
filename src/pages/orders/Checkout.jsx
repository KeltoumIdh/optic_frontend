import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { CiMoneyCheck1 } from "react-icons/ci";
import { useCheckoutStore } from "../../store";
import { GiBanknote } from "react-icons/gi";
import { BsCreditCard2Front } from "react-icons/bs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import { Loader } from "lucide-react";

function Checkout() {

    const { csrf } = useAuth();

    const location = useLocation();
    const {
        setisCred,
        setDate: setD,
        setPrixPayee: setPrixP,
        setPrixReste: setPrixR,
        setEtatPayment: setEPa,
        etatPayment: ePa,
        isCredit: isC,
        date: dat,
        prixPayee: PrixP,
        prixReste: PrixR,
        clientId,
        cart,
        selectedProd,
    } = useCheckoutStore();

    const [methodePayment, setMethodePayment] = React.useState("cash");
    const { toast } = useToast();
    const navigate = useNavigate();
    const [etatPayment, setEtatPayment] = React.useState("surPlace");
    const [isCredit, setIsCredit] = useState(false);
    // console.log("etatPayment", etatPayment);
    const [date, setDate] = useState("");
    const [prixPayee, setPrixPayee] = useState(0);
    const [referenceCredit, setReference] = useState("");
    const [traitaDate, setTraitaDate] = useState("");
    const [traitaForClient, setTraitaForClient] = useState(false);
    const [traitaClient, setTraitaClient] = useState('');
    const [file, setFile] = useState("");


    const calculateRestPrice = () => {
        const totalAmount = cart.total_price;
        if (etatPayment === "credit") {
            // Calculate rest price for credit payment
            return prixPayee
                ? totalAmount - parseFloat(prixPayee)
                : totalAmount;
        }
    };

    const [inProgress, setInProgress] = useState(false)

    const [prixReste, setPrixReste] = useState(calculateRestPrice());
    const handleCheckout = async () => {
        try {
            setInProgress(true)
            await csrf();
            const response = await axiosClient.post("/api/add-order", {
                client_id: clientId,
                cart: cart,
                isCredit: etatPayment === "credit" ? true : false,
                payment_method: methodePayment,
                date_fin_credit: isCredit ? date : null,
                paid_price:
                    etatPayment !== "credit"
                        ? cart.total_price
                        : isNaN(prixPayee) || prixPayee === ""
                            ? 0
                            : parseFloat(prixPayee).toFixed(2),
                remain_price: prixReste || 0,
                total_price: cart.total_price,
                reference_credit: referenceCredit,
                file: file,
                client_traita: traitaClient,
                traita_date: traitaDate,
            });

            toast({
                title: "Success",
                description: "la Commande created successfully!",
            });
            navigate("/orders");

        } catch (error) {
            console.error("Error creating order:", error);
        } finally {
            setInProgress(false)
        }
    };

    const downloadInvoice = async (orderId) => {
        try {
            await csrf();
            const response = await axiosClient.get(`/api/download-invoice/${orderId}`, {
                responseType: "blob",
            });
            // Create a URL for the blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary link element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice.pdf`); // Set the filename for download
            document.body.appendChild(link);

            // Click the link to trigger download
            link.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            link.remove();
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    useEffect(() => {
        setPrixReste(calculateRestPrice());
        setisCred(isCredit);
        setEPa(etatPayment);
        setD(date);
        setPrixP(prixPayee);
        setPrixR(prixReste);
    }, [prixPayee, prixReste, date, etatPayment, isCredit, cart.total_price]);

    return (
        <>
            <div className=" h-screen py-2">
                <div className="container mx-auto px-4">
                    <div className="lg:flex max-lg:space-y-6 justify-between w-full">
                        <div className="lg:w-1/2">
                            <div className="flex items-center  mb-4">
                                <Link
                                    to={`/orders/confirmed`}
                                    className="mr-2 cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                        />
                                    </svg>
                                </Link>
                                <h1 className="text-2xl font-semibold">
                                    Confirm the order
                                </h1>
                                {/* <button
                                    onClick={() => downloadInvoice(13)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    download
                                </button> */}
                            </div>
                            <div className="flex gap-10">
                                <div className="inline-flex items-center">
                                    <label
                                        className="relative flex items-center p-3 rounded-full cursor-pointer"
                                        htmlFor="radioCredit"
                                    >
                                        <input
                                            name="type"
                                            type="radio"
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                                            id="radioCredit"
                                            checked={etatPayment === "credit"}
                                            onChange={() =>
                                                setEtatPayment("credit")
                                            }
                                        />

                                        <span className="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3.5 w-3.5"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                            >
                                                <circle
                                                    data-name="ellipse"
                                                    cx="8"
                                                    cy="8"
                                                    r="8"
                                                ></circle>
                                            </svg>
                                        </span>
                                    </label>
                                    <label
                                        className="mt-px font-light text-gray-700 cursor-pointer select-none"
                                        htmlFor="radioCredit"
                                    >
                                        Credit
                                    </label>
                                </div>
                                <div className="inline-flex items-center">
                                    <label
                                        className="relative flex items-center p-3 rounded-full cursor-pointer"
                                        htmlFor="radiosurplace"
                                    >
                                        <input
                                            name="type"
                                            type="radio"
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                                            id="radiosurplace"
                                            checked={etatPayment === "surPlace"}
                                            onChange={() => {
                                                setEtatPayment("surPlace");
                                                setIsCredit(true);
                                            }}
                                        />
                                        <span className="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3.5 w-3.5"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                            >
                                                <circle
                                                    data-name="ellipse"
                                                    cx="8"
                                                    cy="8"
                                                    r="8"
                                                ></circle>
                                            </svg>
                                        </span>
                                    </label>
                                    <label
                                        className="mt-px font-light text-gray-700 cursor-pointer select-none"
                                        htmlFor="radiosurplace"
                                    >
                                        Payement sur place
                                    </label>
                                </div>
                            </div>

                            <form className="mt-2 w-full pr-4 grid gap-6">
                                {etatPayment === "credit" && (
                                    <>
                                        <div className="mb-2">
                                            <label
                                                htmlFor="date"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Date:
                                            </label>
                                            <input
                                                type="date"
                                                id="date"
                                                name="date"
                                                value={date}
                                                onChange={(e) =>
                                                    setDate(e.target.value)
                                                }
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label
                                                htmlFor="prixPayee"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Prix Payee:
                                            </label>
                                            <input
                                                type="number"
                                                id="prixPayee"
                                                name="prixPayee"
                                                value={prixPayee}
                                                onChange={(e) =>
                                                    setPrixPayee(e.target.value)
                                                }
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                        </div>
                                    </>
                                )}
                            </form>

                            <p className="mt-2 text-lg font-medium">
                                Payement Methods
                            </p>
                            <form className="mt-5 w-full pr-4 grid gap-6">
                                <div
                                    className="relative"
                                    onClick={() => setMethodePayment("cash")}
                                >
                                    <input
                                        className="peer hidden"
                                        id="radio_2"
                                        type="radio"
                                        name="radio"
                                        checked={methodePayment === "cash"}
                                    />
                                    <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-2 w-2 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                    <label
                                        className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 px-4 py-2"
                                        htmlFor="radio_2"
                                    >
                                        <GiBanknote
                                            size={28}
                                            className="flex items-center"
                                        />
                                        <div className="ml-4 ">
                                            <span className="mt-2 font-semibold">
                                                Cash
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => setMethodePayment("check")}
                                >
                                    <input
                                        className="peer hidden"
                                        id="radio_1"
                                        type="radio"
                                        name="radio"
                                        checked={methodePayment === "check"}
                                    />
                                    <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-2 w-2 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                    <label
                                        className=" items-center peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 px-4 py-2"
                                        htmlFor="radio_1"
                                    >
                                        <CiMoneyCheck1 size={28} />
                                        <div className="ml-4">
                                            <span className="mt-2 font-semibold">
                                                Check
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                {methodePayment === "check" && (
                                    <>
                                        <div className="mb-2">
                                            <label
                                                htmlFor="checkreference"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Reference:
                                            </label>
                                            <input
                                                type="text"
                                                id="checkreference"
                                                name="checkreference"
                                                onChange={(e) =>
                                                    setReference(e.target.value)
                                                }
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label
                                                htmlFor="checkreference"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Upload check file:
                                            </label>
                                            <input
                                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none  "
                                                id="file_input"
                                                type="file"
                                                accept="image/png, image/jpg, image/jpeg"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFile(reader.result); // Base64 string
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setFile('')
                                                    }
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                                <div
                                    className="relative"
                                    onClick={() => setMethodePayment("traita")}
                                >
                                    <input
                                        className="peer hidden"
                                        id="radio_3"
                                        type="radio"
                                        name="radio"
                                        checked={methodePayment === "traita"}
                                    />
                                    <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-2 w-2 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                    <label
                                        className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 px-4 py-2"
                                        htmlFor="radio_3"
                                    >
                                        <BsCreditCard2Front
                                            size={26}
                                            className="flex items-center"
                                        />
                                        <div className="ml-4">
                                            <span className="mt-2 font-semibold">
                                                Traita
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                {methodePayment === "traita" && (
                                    <>
                                        <div className="mb-2">
                                            <label
                                                htmlFor="traitareference"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Reference:
                                            </label>
                                            <input
                                                type="text"
                                                id="traitareference"
                                                name="traitareference"
                                                onChange={(e) =>
                                                    setReference(e.target.value)
                                                }
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label
                                                htmlFor="traitadate"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Date :
                                            </label>
                                            <input
                                                type="date"
                                                id="traitadate"
                                                name="traitadate"
                                                onChange={(e) =>
                                                    setTraitaDate(
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label
                                                htmlFor="checkreference"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Upload traita file:
                                            </label>
                                            <input
                                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none  "
                                                id="file_input"
                                                type="file"
                                                accept="image/png, image/jpg, image/jpeg"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFile(reader.result); // Base64 string
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setFile('')
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-10">
                                            <div className="inline-flex items-center">
                                                <label
                                                    className="relative flex items-center p-3 rounded-full cursor-pointer"
                                                    htmlFor="radioCredit"
                                                >
                                                    <input
                                                        checked={
                                                            traitaForClient
                                                        }
                                                        onChange={() =>
                                                            setTraitaForClient(
                                                                (prevState) =>
                                                                    !prevState
                                                            )
                                                        }
                                                        name="type"
                                                        type="checkbox"
                                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                                                        id="radioCredit"
                                                    />

                                                    <span className="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3.5 w-3.5"
                                                            viewBox="0 0 16 16"
                                                            fill="currentColor"
                                                        >
                                                            <circle
                                                                data-name="ellipse"
                                                                cx="8"
                                                                cy="8"
                                                                r="8"
                                                            ></circle>
                                                        </svg>
                                                    </span>
                                                </label>
                                                <label
                                                    className="mt-px font-light text-gray-700 cursor-pointer select-none"
                                                    htmlFor="traitaForClient"
                                                >
                                                    le traita pas de client
                                                    initial
                                                </label>
                                            </div>
                                            {traitaForClient && ( // Show input field only when checkbox is checked
                                                <div className="mb-2">
                                                    <label
                                                        htmlFor="clientName"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Client Name:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="clientName"
                                                        name="clientName"
                                                        className="mt-1 p-2 border rounded-md w-full"
                                                        onChange={(e) =>
                                                            setTraitaClient(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                        <div className="flex flex-col lg:w-1/2 p-6 space-y-4 bg-gray-300 divide-y  sm:px-10">
                            <h2 className="text-2xl font-semibold">
                                Order items
                            </h2>
                            {cart?.productsCart?.map((cart, index) => (
                                <ul
                                    key={index}
                                    className="flex flex-col pt-4 space-y-2"
                                >
                                    <li className="flex items-start justify-between">
                                        <h3>
                                            {cart.name} ({cart.reference})
                                            {cart.quantity &&
                                                <span className="text-base pl-1 text-violet-700">
                                                    x {cart.quantity}
                                                </span>}
                                        </h3>
                                        <div className="text-right">
                                            <span className="block">
                                                {cart.price ?? 0 * cart.quantity ?? 0} dh
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                à {cart.price} dh
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            ))}

                            <div className="pt-4 space-y-2">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Payment information
                                    </h2>
                                    <div className="items-center lg:space-x-2 text-xs">
                                        <p className="text-gray-600">
                                            payement{" "}
                                            <span className="font-bold">
                                                {methodePayment}
                                            </span>{" "}
                                            {isCredit
                                                ? "Credit"
                                                : "et sur place"}{" "}
                                            <span className="font-bold">
                                                {date && `jusqu'à ${date}`}
                                            </span>
                                        </p>

                                        <p className="text-gray-600">
                                            {methodePayment !== "cash" &&
                                                `numero du compte ${referenceCredit}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Payed price</span>
                                    <span>
                                        {etatPayment == "credit"
                                            ? // ? prixPayee.toFixed(2)
                                            isNaN(prixPayee) ||
                                                prixPayee === ""
                                                ? "0.00"
                                                : parseFloat(prixPayee).toFixed(
                                                    2
                                                )
                                            : cart.total_price}{" "}
                                        dh
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <span>Reste price</span>
                                        <span>
                                            {prixReste
                                                ? prixReste.toFixed(2)
                                                : "00.00"}{" "}
                                            dh
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between">
                                        <span>Total</span>
                                        <span className="font-semibold">
                                            {cart.total_price} dh
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={inProgress}
                                        onClick={handleCheckout}
                                        className={`w-full py-2 hover:text-white font-semibold border rounded flex items-center gap-2 justify-center ${inProgress ? 'bg-black' : 'hover:bg-black'}`}
                                    >
                                        <span>checkout</span>
                                        {inProgress && <div className="animate-spin"><Loader /></div>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;
