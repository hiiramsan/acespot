import { useState } from "react";
import { EyeIcon } from "./EyeIcon";

export const PasswordInput = ({ label, placeholder }: { label: string; placeholder: string }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-[#f3f3f3] font-nav">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    className="border border-gray-500 h-9 px-3 py-1 pr-9 text-sm font-nav bg-transparent text-white placeholder-gray-400 w-full"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShow(prev => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    <EyeIcon open={show} />
                </button>
            </div>
        </div>
    );
};