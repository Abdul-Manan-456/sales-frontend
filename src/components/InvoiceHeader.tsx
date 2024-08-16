"use client";
import Image from "next/image";
// import DropDownList from "./dropDownList";
import React, { useState } from "react";
interface invoiceHeaderProps {
    handleInvoiceVisible: () => void;
    noOfInvoices: number;
    handleInvoiceStatus: () => void;
}

const InvoiceHeader: React.FC<invoiceHeaderProps> = ({
    handleInvoiceVisible,
    noOfInvoices,
}) => {
    // Visible the div
    const [isVisible, setIsVisible] = useState(false);

    const handleVisible = () => {
        setIsVisible(!isVisible);
    };
    return (
        <main className="flex mb-8 justify-between ">
            {/* {isVisible && <DropDownList handleInvoiceStatus={handleInvoiceStatus} />} */}

            <div>
                <h1 className="lg:text-4xl md:text-2xl sm:text-xl font-medium">
                    Invoices
                </h1>
                <p className="text-slate-600 md:text-xl text-xs">
                    {`There are ${noOfInvoices} total invoices`}
                </p>
            </div>
            <div className="flex items-center">
                <div
                    onClick={handleVisible}
                    className="flex items-center select-none cursor-pointer md:text-lg text-xs sm:font-bold font-medium sm:mr-2 mr-0"
                >
                    <p>Filter by Status</p>
                    <Image
                        src="/icons/expand_more.svg"
                        alt="expand_more"
                        className="sm:w-5 sm:h-5 w-3 h-3"
                        width={20}
                        height={20}
                    />
                </div>
                <div
                    onClick={() => handleInvoiceVisible()}
                    className="flex items-center justify-center rounded-full bg-sky-600 hover:bg-sky-700 cursor-pointer w-40 h-12"
                >
                    <div>
                        <Image
                            src="/icons/add_invoice.svg"
                            className="bg-white sm:w-[30px] sm:h-[30px] w-[15px] h-[15px] rounded-full"
                            alt="add_more"
                            width={30}
                            height={30}
                        />
                    </div>
                    <p className="text-white sm:text-base text-xs ml-1 sm:font-medium font-normal">
                        Add Invoice
                    </p>
                </div>
            </div>
        </main>
    );
};

export default InvoiceHeader;
