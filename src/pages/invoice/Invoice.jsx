import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
// import "jspdf-autotable";
import * as autoTable from 'jspdf-autotable'

export default function Invoice() {
    const [loader, setLoader] = useState(false);

    // const downloadPDF = () => {
    //     const capture = document.querySelector(".actual-receipt");
    //     setLoader(true);
    //     html2canvas(capture).then((canvas) => {
    //         let imgWidth = 208;
    //         let imgHeight = canvas.height * imgWidth / canvas.width;
    //         const imgData = canvas.toDataURL('image/png'); // Corrected image type
    //         const pdf = new jsPDF('p', 'mm', 'a4');
    //         pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    //         pdf.save("receipt.pdf");
    //         setLoader(false);
    //     }).catch(error => {
    //         console.error('Error generating PDF:', error);
    //         setLoader(false);
    //     });
    // };

    const downloadPDF = async () => {
        const doc = new jsPDF({ orientation: "landscape" });
        // doc.autoTable({ html: "#actual-receipt" });
        doc.save("receipt.pdf");
    };
    return (
        <div>
            <div className="receipt-actions-div">
                <div className="actions-right">
                    <button
                        className="receipt-modal-download-button"
                        onClick={downloadPDF}
                        disabled={loader}
                    >
                        {loader ? (
                            <span>Downloading</span>
                        ) : (
                            <span>Download</span>
                        )}
                    </button>
                </div>
            </div>
            <div id="actual-receipt" className="actual-receipt">
                <div className=" rounded-lg shadow-lg px-8 py-10 max-w-xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <img
                                className="h-8 w-8 mr-2"
                                src="https://tailwindflex.com/public/images/logos/favicon-32x32.png"
                                alt="Logo"
                            />
                            <div className=" font-semibold text-lg">
                                Your Company Name
                            </div>
                        </div>
                        <div className="">
                            <div className="font-bold text-xl mb-2">
                                INVOICE
                            </div>
                            <div className="text-sm">Date: 01/05/2023</div>
                            <div className="text-sm">Invoice #: INV12345</div>
                        </div>
                    </div>
                    <div className="border-b-2 border-gray-300 pb-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Bill To:</h2>
                        <div className=" mb-2">John Doe</div>
                        <div className=" mb-2">123 Main St.</div>
                        <div className=" mb-2">Anytown, USA 12345</div>
                        <div className="">johndoe@example.com</div>
                    </div>
                    <table className="w-full text-left mb-8">
                        <thead>
                            <tr>
                                <th className=" font-bold uppercase py-2">
                                    Description
                                </th>
                                <th className=" font-bold uppercase py-2">
                                    Quantity
                                </th>
                                <th className=" font-bold uppercase py-2">
                                    Price
                                </th>
                                <th className=" font-bold uppercase py-2">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-4 ">Product 1</td>
                                <td className="py-4 ">1</td>
                                <td className="py-4 ">$100.00</td>
                                <td className="py-4 ">$100.00</td>
                            </tr>
                            <tr>
                                <td className="py-4 ">Product 2</td>
                                <td className="py-4 ">2</td>
                                <td className="py-4 ">$50.00</td>
                                <td className="py-4 ">$100.00</td>
                            </tr>
                            <tr>
                                <td className="py-4 ">Product 3</td>
                                <td className="py-4 ">3</td>
                                <td className="py-4 ">$75.00</td>
                                <td className="py-4 ">$225.00</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-end mb-8">
                        <div className=" mr-2">Subtotal:</div>
                        <div className="">$425.00</div>
                    </div>
                    <div className="text-right mb-8">
                        <div className=" mr-2">Tax:</div>
                        <div className="">$25.50</div>
                    </div>
                    <div className="flex justify-end mb-8">
                        <div className=" mr-2">Total:</div>
                        <div className=" font-bold text-xl">$450.50</div>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-8 mb-8">
                        <div className=" mb-2">
                            Payment is due within 30 days. Late payments are
                            subject to fees.
                        </div>
                        <div className=" mb-2">
                            Please make checks payable to Your Company Name and
                            mail to:
                        </div>
                        <div className="">123 Main St., Anytown, USA 12345</div>
                    </div>
                </div>
            </div>
            {/* end of actual receipt */}
        </div>
    );
}
