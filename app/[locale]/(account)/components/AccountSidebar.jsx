"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Link, useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { LogOut } from "lucide-react";
import Image from "next/image";

export default function AccountSidebar({ active = "profile" }) {
    const t = useTranslations("account");
    const dispatch = useDispatch();
    const router = useRouter();
    const locale = useLocale();

    const accountProfile = useSelector((s) => s.account.profile);
    const authUser = useSelector((s) => s.auth.user);
    const user = accountProfile ?? authUser;

    const onLogout = async () => {
        try {
            await api.delete("sign-out");
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            dispatch(logout());
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                document.cookie = "auth_token=; Max-Age=0; Path=/; SameSite=Lax";
            }
            toast.success(t("toasts.logged_out"));
            router.push("/");
        }
    };

    return (
        <div className="col-lg-4 col-xl-3">
            <div className="offcanvas-lg offcanvas-end" tabIndex="-1" id="offcanvasSidebar">
                <div className="offcanvas-header justify-content-end pb-2">
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasSidebar" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body p-3 p-lg-0">
                    <div className="card bg-light w-100">
                        <div className="card-body p-3">
                            <div className="text-center mb-3">
                                <div className="mb-2">
                                    <Image
                                        src={user?.image || '/default-avatar.png'}
                                        width={50}
                                        height={50}
                                        alt={user?.name || 'User avatar'}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '50%'
                                        }}
                                        priority
                                    />
                                    {/* <i className="bi bi-person-circle fs-3" /> */}
                                </div>
                                <h6 className="mb-0">{user?.name || t("misc.guest")}</h6>
                                {user?.email && <span className="small d-block text-muted">{user.email}</span>}
                                <hr />
                            </div>

                            <ul className="nav nav-pills-primary-soft flex-column">
                                <li className="nav-item">
                                    <Link className={`nav-link ${active === "profile" ? "active" : ""}`} href="/profile">
                                        <i className="bi bi-person fa-fw mx-2" /> {t("nav.profile")}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${active === "favorite" ? "active" : ""}`} href="/favorite">
                                        <i className="bi bi-heart fa-fw mx-2" /> {t("nav.wishlist")}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${active === "delete" ? "active" : ""}`} href="/delete-account">
                                        <i className="bi bi-trash fa-fw mx-2" /> {t("nav.delete")}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link text-danger bg-danger-soft-hover ${locale === 'ar' ? 'text-end' : 'text-start'} w-100`} onClick={onLogout}>
                                        <LogOut size={18} className="mx-2" /> {t("nav.logout")}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
