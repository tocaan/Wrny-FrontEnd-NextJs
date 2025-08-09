import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton للبطاقة
export const CardSkeleton = () => (
    <div className="card shadow p-3 pt-3 pb-3 h-100">
        <div className="position-relative arrow-round arrow-xs arrow-dark rounded-2 overflow-hidden">
            <Skeleton height={200} />
        </div>
        <div className="card-body px-3 pb-0">
            <div className="d-flex justify-content-between">
                <div className="mx-2">
                    <Skeleton circle width={60} height={60} />
                </div>
                <div className="mt-2 mt-sm-0 w-100">
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={15} width="100%" count={3} />
                </div>
            </div>
        </div>
    </div>
);

// Skeleton لصفحة تفاصيل الشركة
export const CompanyDetailsSkeleton = () => (
    <div>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="card bg-light p-0 pb-0">
                        <div className="card-body d-flex justify-content-between flex-wrap">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mx-2">
                                    <Skeleton circle width={80} height={80} />
                                </div>
                                <div className="w-50">
                                    <Skeleton height={30} width="80%" />
                                    <Skeleton height={20} width="60%" />
                                </div>
                            </div>
                            <div className="d-flex">
                                <Skeleton circle width={40} height={40} />
                                <Skeleton circle width={40} height={40} className="ms-2" />
                            </div>
                        </div>
                        <div className="card-footer bg-transparent border-top py-0">
                            <div className="d-flex">
                                <Skeleton height={30} width={100} className="me-3" />
                                <Skeleton height={30} width={100} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mt-4">
            <div className="row g-4 g-lg-5">
                <div className="col-lg-7 col-xl-8">
                    <div className="card shadow mb-4">
                        <div className="card-header bg-transparent border-bottom">
                            <Skeleton height={25} width={150} />
                        </div>
                        <div className="card-body">
                            <Skeleton height={15} count={5} />
                        </div>
                    </div>
                    <div className="card shadow mb-4">
                        <div className="card-header border-bottom">
                            <Skeleton height={25} width={100} />
                        </div>
                        <div className="card-body">
                            <Skeleton height={20} width="60%" />
                            <Skeleton height={200} className="mt-3" />
                        </div>
                    </div>
                </div>
                <div className="col-lg-5 col-xl-4">
                    <div className="card shadow mb-4">
                        <div className="card-header border-bottom">
                            <Skeleton height={25} width={150} />
                        </div>
                        <div className="card-body">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="mb-3">
                                    <Skeleton height={15} width="100%" />
                                </div>
                            ))}
                            <div className="d-flex mt-4">
                                <Skeleton circle width={30} height={30} className="me-2" />
                                <Skeleton circle width={30} height={30} className="me-2" />
                                <Skeleton circle width={30} height={30} className="me-2" />
                                <Skeleton circle width={30} height={30} className="me-2" />
                                <Skeleton circle width={30} height={30} />
                            </div>
                        </div>
                    </div>
                    <div className="card shadow mb-4">
                        <div className="card-header border-bottom">
                            <Skeleton height={25} width={120} />
                        </div>
                        <div className="card-body">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className="d-flex justify-content-between mb-2">
                                    <Skeleton height={15} width={80} />
                                    <Skeleton height={15} width={100} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Skeleton لقائمة الشركات
export const CompaniesListSkeleton = () => (
    <div className="container my-5">
        <div className="row g-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="col-md-6 col-lg-3">
                    <CardSkeleton />
                </div>
            ))}
        </div>
    </div>
);

// Skeleton للبطل الرئيسي
export const HeroSkeleton = () => (
    <section className="py-0 mb-0 home">
        <div className="container">
            <Skeleton height={400} />
        </div>
    </section>
);

// Skeleton للفئات
export const CategoriesSkeleton = () => (
    <div className="container my-5">
        <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                    <div className="card card-category card-body bg-light text-center align-items-center">
                        <div className="icon-xl bg-mode rounded-circle mb-3">
                            <Skeleton circle width={60} height={60} />
                        </div>
                        <div className="w-100">
                            <Skeleton height={20} width="80%" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Skeleton للمحافظات
export const RegionsSkeleton = () => (
    <div className="container my-5">
        <Skeleton height={30} width={150} className="mb-4" />
        <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                    <div className="card card-city bg-transparent text-center p-1 h-100">
                        <Skeleton height={150} />
                        <div className="card-body p-0 pt-3">
                            <Skeleton height={20} width="80%" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Skeleton للفلتر
export const FilterSkeleton = () => (
    <div className="mt-3">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex">
                        <Skeleton height={40} width={150} />
                    </div>
                </div>
            </div>
            <div className="collapse show">
                <div className="card card-body bg-light p-4 mt-4 z-index-9">
                    <div className="row g-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                <div className="d-flex align-items-center">
                                    <Skeleton width={20} height={20} className="me-2" />
                                    <Skeleton height={15} width={80} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center align-items-center mt-5">
                        <Skeleton height={40} width={150} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Skeleton لل breadcrumb
export const BreadcrumbSkeleton = () => (
    <nav className="breadcrumb-main bg-light" aria-label="breadcrumb">
        <div className="container">
            <div className="d-flex">
                <Skeleton height={20} width={100} className="me-2" />
                <Skeleton height={20} width={80} />
            </div>
        </div>
    </nav>
);
