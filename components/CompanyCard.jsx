import Link from "next/link";

export default function CompanyCard({ company }) {
    return (
        <div className="card shadow p-2 pb-0 h-100">
            <div className="position-relative arrow-round arrow-xs arrow-dark rounded-2 overflow-hidden">
                <div className="bg-overlay bg-dark opacity-2"></div>
                <div className="img-company">
                    <img src={company.cover_url || '/assets/images/city/03.jpg'} alt="Card image" />
                </div>
            </div>
            <div className="card-body px-3 pb-0">
                <div className="heart-icon position-absolute top-0 end-0 p-3 z-index-9">
                    <button className="mb-0 btn btn-white btn-round z-index-2">
                        <i className={`bi fa-fw ${company.is_favorited ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                    </button>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="mx-2">
                        <div className="avatar logo-company">
                            <img
                                className="avatar-img rounded-circle"
                                src={company.logo_url || '/assets/images/company/logo1.png'}
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <div className="mt-2 mt-sm-0">
                        <h5 className="card-title">
                            <Link href={`/company/${company.id}`} className="stretched-link">
                                {company.name}
                            </Link>
                        </h5>
                        <p className="mb-3 fs-12 text-justify excerpt-20">{company.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
