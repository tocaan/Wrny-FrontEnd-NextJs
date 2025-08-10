"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function AuthLayout({ children, illustration = "/assets/images/signin.svg" }) {
    return (
        <section className="vh-xxl-100">
            <div className="container h-100 d-flex px-0 px-sm-4">
                <div className="row justify-content-center align-items-center m-auto">
                    <div className="col-12">
                        <div className="bg-mode shadow rounded-3 overflow-hidden">
                            <div className="row g-0">
                                <div className="col-lg-6 d-flex align-items-center order-2 order-lg-1">
                                    <div className="p-3 p-lg-5">
                                        <Image src={illustration} alt="" width={520} height={400} />
                                    </div>
                                    <div className="vr opacity-1 d-none d-lg-block"></div>
                                </div>

                                <div className="col-lg-6 order-1">
                                    <div className="p-4 p-sm-7">
                                        <Link href="/">
                                            <Image className="mb-4" src="/assets/images/logo.png" alt="logo" width={150} height={50} />
                                        </Link>

                                        {children}

                                        <div className="position-relative my-4"><hr /></div>
                                        <div className="text-primary-hover text-body mt-3 text-center">
                                            تم التصميم والتطوير بواسطة <a href="https://tocaan.com" className="text-body">شركة توكان</a>.
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
