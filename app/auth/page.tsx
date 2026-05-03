"use client"

import { useState, useEffect } from "react";
import AppleIcon from "./components/AppleIcon";
import GoogleIcon from "./components/GoogleIcon";
import { EyeIcon } from "./components/EyeIcon";
import { login, register, signInWithOAuth } from "./actions";

const AuthPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
        password?: string;
        repeatPassword?: string;
    }>({});
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        repeatPassword: ""
    });

    useEffect(() => {
        setFormData({
            email: "",
            password: "",
            repeatPassword: ""
        })
        setError(null);
        setFieldErrors({});
    }, [mode])

    const handleFormTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
        // Clear field error when user starts typing
        if (fieldErrors[name as keyof typeof fieldErrors]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: undefined
            }));
        }
    }

    const validateRegisterForm = () => {
        const errors: typeof fieldErrors = {};
        
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!formData.email.includes("@")) {
            errors.email = "Please enter a valid email";
        }
        
        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        
        if (!formData.repeatPassword) {
            errors.repeatPassword = "Please confirm your password";
        } else if (formData.password !== formData.repeatPassword) {
            errors.repeatPassword = "Passwords do not match";
        }
        
        return errors;
    }

    const validateLoginForm = () => {
        const errors: typeof fieldErrors = {};
        
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!formData.email.includes("@")) {
            errors.email = "Please enter a valid email";
        }
        
        if (!formData.password) {
            errors.password = "Password is required";
        }
        
        return errors;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        
        // Validate form before submission
        const validationErrors = mode === "register" ? validateRegisterForm() : validateLoginForm();
        
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }
        
        setLoading(true);
        const form = new FormData();
        form.append("email", formData.email);
        form.append("password", formData.password);
        let result;
        if(mode == "login") {
            result = await login(form);
        } else {
            form.append("repeatPassword", formData.repeatPassword);
            result = await register(form);
        }
        if (result?.error) setError(result.error)
        setLoading(false);
    }

    async function handleOAuth(provider: "google" | "apple") {
        setError(null);
        await signInWithOAuth(provider);
    }

    return (
        <div className="min-h-dvh w-full bg-[#030303] flex flex-row gap-6 p-6">
            <div
                className="hidden md:block md:flex-5 lg:flex-6 rounded-2xl bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/painting.png')" }}
            >
            </div>

            <div className="flex-1 md:flex-5 lg:flex-4 flex items-center justify-center p-4 md:p-6">
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <div className="flex flex-row gap-2 items-center">
                        <h1 className="text-2xl font-nav tracking-normal">
                            {mode == "login" ? "Welcome Back" : "Create account"}
                        </h1>
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="#BEF264">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M16 12h7v1h-7zM2 13h7v-1H2zm10 10h1v-7h-1zm0-14h1V2h-1zm-2 1h5v5h-5zm1 4h3v-3h-3z"></path>
                                <path fill="none" d="M0 0h24v24H0z"></path>
                            </g>
                        </svg>
                    </div>

                    <p className="text-sm font-nav text-gray-300">
                        {mode == "login" ? "Please fill your account credentials to start booking your favorite courts." : "Create your account in a second and start booking your favorite courts"}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-700 h-9 text-sm font-medium hover:bg-gray-50 transition-colors transform hover:-translate-y-0.5 duration-200 font-nav cursor-pointer"
                            onClick={()=> handleOAuth("google")} disabled={loading}
                        >
                            <GoogleIcon />
                            Continue with Google
                        </button>
                        {/* <button
                            className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-700 h-9 text-sm font-medium hover:bg-gray-50 transition-colors transform hover:-translate-y-0.5 duration-200 font-nav"
                            onClick={()=> handleOAuth("apple")} disabled={loading}
                        >
                            <AppleIcon />
                            Continue with Apple
                        </button> */}
                        <div className="relative flex py-2 items-center">
                            <div className="grow border-t border-gray-600"></div>
                            <span className="shrink-0 mx-3 text-gray-400 text-xs font-nav">Or continue with email</span>
                            <div className="grow border-t border-gray-600"></div>
                        </div>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm font-nav flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {error}
                            </div>
                        )}
                        <form className="flex flex-col gap-3" onSubmit={(e) => handleSubmit(e)}>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="text-sm text-[#f3f3f3] font-nav">Email address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    className={`border h-9 px-3 py-1 text-sm font-nav bg-transparent text-white placeholder-gray-400 transition-colors ${
                                        fieldErrors.email ? 'border-red-500/50' : 'border-gray-500'
                                    } hover:border-gray-400 focus:border-lime-300 outline-none`}
                                    placeholder="your@email.com" 
                                    value={formData.email} 
                                    onChange={(e) => handleFormTextChange(e)} 
                                />
                                {fieldErrors.email && (
                                    <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#f3f3f3] font-nav">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className={`border h-9 px-3 py-1 pr-9 text-sm font-nav bg-transparent text-white placeholder-gray-400 w-full transition-colors ${
                                            fieldErrors.password ? 'border-red-500/50' : 'border-gray-500'
                                        } hover:border-gray-400 focus:border-lime-300 outline-none`}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleFormTextChange(e)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        tabIndex={-1}
                                    >
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                                {formData.password && mode === "register" && (
                                    <p className={`text-xs mt-1 ${
                                        formData.password.length >= 6 ? 'text-lime-300' : 'text-gray-400'
                                    }`}>
                                        {formData.password.length}/6 characters minimum
                                    </p>
                                )}
                                {fieldErrors.password && (
                                    <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>
                                )}
                            </div>
                            {mode == "register" &&
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-[#f3f3f3] font-nav">Repeat Password</label>
                                    <div className="relative">
                                        <input
                                            type={showRepeatPassword ? "text" : "password"}
                                            name="repeatPassword"
                                            className={`border h-9 px-3 py-1 pr-9 text-sm font-nav bg-transparent text-white placeholder-gray-400 w-full transition-colors ${
                                                fieldErrors.repeatPassword ? 'border-red-500/50' : formData.repeatPassword && formData.password === formData.repeatPassword ? 'border-lime-300/50' : 'border-gray-500'
                                            } hover:border-gray-400 focus:border-lime-300 outline-none`}
                                            placeholder="••••••••"
                                            value={formData.repeatPassword}
                                            onChange={(e) => handleFormTextChange(e)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRepeatPassword(prev => !prev)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                            aria-label={showRepeatPassword ? "Hide password" : "Show password"}
                                            tabIndex={-1}
                                        >
                                            <EyeIcon open={showRepeatPassword} />
                                        </button>
                                    </div>
                                    {formData.repeatPassword && formData.password === formData.repeatPassword && !fieldErrors.repeatPassword && (
                                        <p className="text-xs text-lime-300 mt-1 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Passwords match
                                        </p>
                                    )}
                                    {fieldErrors.repeatPassword && (
                                        <p className="text-xs text-red-400 mt-1">{fieldErrors.repeatPassword}</p>
                                    )}
                                </div>
                            }
                            <button type="submit" disabled={loading} className="h-9 w-full bg-white text-black font-nav text-sm font-medium cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-1">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
                                            <path d="M4.97498 12H7.89998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M11.8 5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M18.625 12H15.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M11.8 19V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M6.97374 16.95L9.04203 14.8287" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M6.97374 7.05001L9.04203 9.17133" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M16.6262 7.05001L14.5579 9.17133" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M16.6262 16.95L14.5579 14.8287" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                        </svg>
                                        {mode == "login" ? "Logging in..." : "Creating account..."}
                                    </span>
                                ) : (
                                    mode == "login" ? "Log in" : "Sign up"
                                )}
                            </button>
                        </form>

                        <div className="flex flex-row gap-1 text-sm text-[#f3f3f3] font-nav">
                            {mode == "login" ?
                                <>
                                    <p>Don't have an account?</p>
                                    <button type="button" onClick={() => setMode("register")} className="underline cursor-pointer">Create one</button>
                                </>
                                :
                                <>
                                    <p>Already have an account?</p>
                                    <button type="button" onClick={() => setMode("login")} className="underline cursor-pointer">Log In</button>
                                </>

                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage;
