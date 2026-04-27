const AuthPage = () => {
    return (
        <div className="h-dvh w-full p-6 bg-[#030303] flex flex-row gap-6">
            <div
                className="hidden md:block md:flex-5 lg:flex-6 rounded-md bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/painting.png')" }}
            >
            </div>

            <div className="flex-1 md:flex-5 lg:flex-4 p-8">
                <div className="flex flex-col gap-6 p-10">
                    <div className="flex flex-row gap-2">
                    <h1 className="text-3xl font-nav tracking-normal text-left">Welcome Back</h1>
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="#BEF264">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M16 12h7v1h-7zM2 13h7v-1H2zm10 10h1v-7h-1zm0-14h1V2h-1zm-2 1h5v5h-5zm1 4h3v-3h-3z"></path>
                                <path fill="none" d="M0 0h24v24H0z"></path>
                            </g>
                        </svg>
                    </div>

                    <p className="text-md font-nav">Please fill your account credentials to start booking your favorite courts.</p>
                    <div className="flex flex-col gap-4">
                        <a
                            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-200 text-gray-700 h-10 text-md font-medium hover:bg-gray-50 transition-colors transform hover:-translate-y-0.5 duration-200 font-nav"
                            href="/api/auth/signin?provider=google"
                        >
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"></path>
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"></path>
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"></path>
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"></path>
                            </svg>
                            Continue with Google
                        </a>
                        <a
                            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-200 text-gray-700 h-10 text-md font-medium hover:bg-gray-50 transition-colors transform hover:-translate-y-0.5 duration-200 font-nav"
                            href="/api/auth/signin?provider=apple"
                        >
                            <svg viewBox="-1.5 0 20 20" width={24} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>apple [#173]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-102.000000, -7439.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M57.5708873,7282.19296 C58.2999598,7281.34797 58.7914012,7280.17098 58.6569121,7279 C57.6062792,7279.04 56.3352055,7279.67099 55.5818643,7280.51498 C54.905374,7281.26397 54.3148354,7282.46095 54.4735932,7283.60894 C55.6455696,7283.69593 56.8418148,7283.03894 57.5708873,7282.19296 M60.1989864,7289.62485 C60.2283111,7292.65181 62.9696641,7293.65879 63,7293.67179 C62.9777537,7293.74279 62.562152,7295.10677 61.5560117,7296.51675 C60.6853718,7297.73474 59.7823735,7298.94772 58.3596204,7298.97372 C56.9621472,7298.99872 56.5121648,7298.17973 54.9134635,7298.17973 C53.3157735,7298.17973 52.8162425,7298.94772 51.4935978,7298.99872 C50.1203933,7299.04772 49.0738052,7297.68074 48.197098,7296.46676 C46.4032359,7293.98379 45.0330649,7289.44985 46.8734421,7286.3899 C47.7875635,7284.87092 49.4206455,7283.90793 51.1942837,7283.88393 C52.5422083,7283.85893 53.8153044,7284.75292 54.6394294,7284.75292 C55.4635543,7284.75292 57.0106846,7283.67793 58.6366882,7283.83593 C59.3172232,7283.86293 61.2283842,7284.09893 62.4549652,7285.8199 C62.355868,7285.8789 60.1747177,7287.09489 60.1989864,7289.62485" id="apple-[#173]"> </path> </g> </g> </g> </g></svg>
                            Continue with Apple
                        </a>
                        <div className="relative flex py-2 items-center">
                            <div className="grow border-t border-gray-200"></div>
                            <span className="shrink-0 mx-4 text-gray-400 text-sm font-nav">Or use</span>
                            <div className="grow border-t border-gray-200"></div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-lg text-[#f3f3f3]">Email address</label>
                                <input type="email" className="border-2 border-gray-400 h-10 p-2 font-nav" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="text-lg text-[#f3f3f3]">Password</label>
                                <input type="password" className="border-2 border-gray-400 h-10 p-2" />
                            </div>
                        </div>
                        <button className="h-10 w-full bg-white text-black font-nav text-lg cursor-pointer">Get started</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage;
