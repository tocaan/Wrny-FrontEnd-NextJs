import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function CompanyCard({ company }) {
    const locale = useLocale();
    return (
        <div className="card shadow p-2 pb-0 h-100">
            <div className="position-relative arrow-round arrow-xs arrow-dark rounded-2">
                <div className="bg-overlay bg-dark opacity-2 rounded-3"></div>
                <div className="img-company">
                    <img src={company.cover_url || '/assets/images/city/03.jpg'} alt="Card image" />
                </div>
            </div>
            <div className="card-body px-0 pb-0">
                <div className="heart-icon position-absolute top-0 end-0 p-3 z-index-9">
                    <button className="mb-0 btn btn-white btn-round z-index-2">
                        <i className={`bi fa-fw ${company.is_favorited ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                    </button>
                </div>
                <div className="d-flex justify-content-between pb-2">
                    <div className={`m-0 ${locale === 'ar' ? 'ms-2' : 'me-2'}`}>
                        <div className="avatar logo-company border border-1 rounded-circle">
                            <img
                                className="avatar-img rounded-circle"
                                src={company.logo_url || '/assets/images/company/logo1.png'}
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <div className="mt-2 mt-sm-0">
                        <h5 className="card-title">
                            <Link href={`/companies/${company.id}`} className="stretched-link">
                                {company.name}
                            </Link>
                        </h5>
                        <p className="fs-12 text-justify excerpt-20">{company.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
