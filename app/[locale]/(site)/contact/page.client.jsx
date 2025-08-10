import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function ContactClientPage() {
    const t = useTranslations();

    return (
        <>
            <Breadcrumb items={[{ name: t('breadcrumb.contact') }]} />
            {/* Header */}
            <section className="pt-4 pt-md-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-xl-10">
                            <h1 className="h4">{t('pages.contact.title')}</h1>
                            <p className="lead mb-0">{t('pages.contact.subtitle')}</p>
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="row g-4">
                        <div className="col-md-6 col-xl-4">
                            <div className="card card-body shadow text-center align-items-center h-100">
                                <div className="icon-lg bg-info bg-opacity-10 text-info rounded-circle mb-2">
                                    <i className="bi bi-headset fs-5" />
                                </div>
                                <h6>{t('pages.contact.call_us')}</h6>
                                <p className="mb-3">{t('pages.contact.call_us_text')}</p>
                                <div className="d-grid gap-3 d-sm-block">
                                    <button className="btn btn-sm btn-light" type="button">
                                        <i className="bi bi-telephone mx-2" />
                                        <span dir="ltr">+965 456 789</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-xl-4">
                            <div className="card card-body shadow text-center align-items-center h-100">
                                <div className="icon-lg bg-danger bg-opacity-10 text-danger rounded-circle mb-2">
                                    <i className="bi bi-inboxes-fill fs-5" />
                                </div>
                                <h6>{t('pages.contact.email_us')}</h6>
                                <p className="mb-3">{t('pages.contact.email_us_text')}</p>
                                <a href="mailto:info@wrny.com" className="btn btn-sm btn-light mb-0">
                                    <i className="bi bi-envelope mx-1" />
                                    info@wrny.com
                                </a>
                            </div>
                        </div>

                        <div className="col-xl-4 position-relative">
                            <div className="card card-body shadow text-center align-items-center h-100">
                                <div className="icon-lg bg-orange bg-opacity-10 text-orange rounded-circle mb-2">
                                    <i className="bi bi-globe2 fs-5" />
                                </div>
                                <h6>{t('pages.contact.follow_us')}</h6>
                                <p className="mb-3">{t('pages.contact.follow_us_text')}</p>
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <a className="btn btn-sm bg-facebook px-2 mb-0" href="#"><i className="fab fa-fw fa-facebook-f" /></a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a className="btn btn-sm bg-instagram px-2 mb-0" href="#"><i className="fab fa-fw fa-instagram" /></a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a className="btn btn-sm bg-twitter px-2 mb-0" href="#"><i className="fab fa-fw fa-twitter" /></a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a className="btn btn-sm bg-linkedin px-2 mb-0" href="#"><i className="fab fa-fw fa-linkedin-in" /></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Illustration + Form */}
            <section className="pt-0 pt-lg-5">
                <div className="container">
                    <div className="row g-4 g-lg-5 align-items-center">
                        <div className="col-lg-6 text-center">
                            <Image src="/assets/images/contact.svg" alt="contact illustration" width={600} height={420} />
                        </div>
                        <div className="col-lg-6">
                            <div className="card bg-light p-4">
                                <div className="card-header bg-light p-0 pb-3">
                                    <h3 className="h4 mb-0">{t('pages.contact.form_title')}</h3>
                                </div>
                                <div className="card-body p-0">
                                    <ContactForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ✅ نفصل الفورم كـ Client (لو حابب تتعامل مع state لاحقاً)
function ContactForm() {
    return (
        <form className="row g-4">
            <div className="col-md-6">
                <label className="form-label">اسمك *</label>
                <input type="text" className="form-control" />
            </div>
            <div className="col-md-6">
                <label className="form-label">البريد الالكتروني *</label>
                <input type="email" className="form-control" />
            </div>
            <div className="col-12">
                <label className="form-label">رقم الهاتف *</label>
                <input type="text" className="form-control" />
            </div>
            <div className="col-12">
                <label className="form-label">الرسالة *</label>
                <textarea className="form-control" rows={3} />
            </div>
            <div className="col-12 form-check ms-2">
                <input type="checkbox" className="form-check-input" id="termsCheck" />
                <label className="form-check-label" htmlFor="termsCheck">
                    بإرسال هذا النموذج، فإنك توافق على <a href="#">شروطنا وأحكامنا</a>.
                </label>
            </div>
            <div className="col-12">
                <button className="btn btn-dark mb-0" type="button">ارسال الرسالة</button>
            </div>
        </form>
    );
}
