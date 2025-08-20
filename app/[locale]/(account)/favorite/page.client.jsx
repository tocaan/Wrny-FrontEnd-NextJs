import Breadcrumb from "@/components/Breadcrumb";
import AccountSidebar from "../components/AccountSidebar";
import FavoritesSection from "../components/FavoritesSection";
import { useTranslations } from "next-intl";

export default function FavoriteClient() {
    const t = useTranslations("account");
    return (
        <>
            {/* <Breadcrumb items={[{ name: t('nav.favorite') }]} /> */}

            <section className="pt-3">
                <div className="container">
                    <div className="row">
                        <AccountSidebar active="favorite" />
                        <div className="col-lg-8 col-xl-9">
                            <div className="d-grid mb-0 d-lg-none w-100">
                                <button className="btn btn-primary mb-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                                    <i className="fas fa-sliders-h" /> {t("nav.favorite")}
                                </button>
                            </div>
                            <div className="vstack gap-4">
                                <FavoritesSection />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
