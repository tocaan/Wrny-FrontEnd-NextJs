'use client';

import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function ContactClientPage() {
    const t = useTranslations('pages');

    return (
        <>
            {/* <Breadcrumb items={[{ name: t('contact.page_title') }]} /> */}

            {/* Header */}
            <section className="pt-4 pt-md-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-xl-10">
                            <h1 className="h4">{t('contact.title')}</h1>
                            <p className="lead mb-0">{t('contact.subtitle')}</p>
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="row g-4">
                        <div className="col-md-6 col-xl-4">
                            <div className="card card-body shadow text-center align-items-center h-100">
                                <div className="icon-lg bg-info bg-opacity-10 text-info rounded-circle mb-2">
                                    <i className="bi bi-headset fs-5" />
                                </div>
                                <h6>{t('contact.call_us')}</h6>
                                <p className="mb-3">{t('contact.call_us_text')}</p>
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
                                <h6>{t('contact.email_us')}</h6>
                                <p className="mb-3">{t('contact.email_us_text')}</p>
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
                                <h6>{t('contact.follow_us')}</h6>
                                <p className="mb-3">{t('contact.follow_us_text')}</p>
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
                            <Image src="/assets/images/contact.svg" alt={t('contact.page_title')} width={600} height={420} />
                        </div>
                        <div className="col-lg-6">
                            <div className="card bg-light p-4">
                                <div className="card-header bg-light p-0 pb-3">
                                    <h3 className="h4 mb-0">{t('contact.form_title')}</h3>
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

function ContactForm() {
    const t = useTranslations('pages');
    const [values, setValues] = useState({
        user_name: '',
        email: '',
        phone: '',
        complaint: '',
        agree: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // honeypot ضد البوتات
    const [website, setWebsite] = useState('');

    const onChange = (e) => {
        const { name, type, checked, value } = e.target;
        setValues((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
    };

    const validate = useCallback(() => {
        const e = {};
        if (!values.user_name?.trim() || values.user_name.trim().length < 2) e.user_name = t('contact.errors.name_required');
        if (!values.email?.trim() || !/^\S+@\S+\.\S+$/.test(values.email)) e.email = t('contact.errors.email_invalid');
        if (!values.phone?.trim() || values.phone.replace(/\D/g, '').length < 7) e.phone = t('contact.errors.phone_invalid');
        if (!values.complaint?.trim() || values.complaint.trim().length < 5) e.complaint = t('contact.errors.message_required');
        if (!values.agree) e.agree = t('contact.errors.agree_required');
        return e;
    }, [values, t]);

    const resetForm = () => {
        setValues({ user_name: '', email: '', phone: '', complaint: '', agree: false });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // honeypot
        if (website) {
            toast.error(t('contact.errors.server_generic'));
            return;
        }

        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) {
            const firstErr = v[Object.keys(v)[0]];
            if (firstErr) toast.error(firstErr);
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                user_name: values.user_name.trim(),
                phone: values.phone.trim(),
                email: values.email.trim(),
                complaint: values.complaint.trim(),
            };

            const { data } = await api.post('/complaints/create', payload);
            if (data?.key === 'success') {
                toast.success(data?.msg || t('contact.success'));
                resetForm();
            } else {
                toast.error(data?.msg || t('contact.errors.server_generic'));
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.msg ||
                err?.message ||
                t('contact.errors.server_generic');
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const fieldInvalid = useCallback((name) => Boolean(errors[name]), [errors]);

    return (
        <form className="row g-4" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
            <div className="col-md-6">
                <label className="form-label">{t('contact.form_name')}</label>
                <input
                    type="text"
                    name="user_name"
                    className={`form-control ${fieldInvalid('user_name') ? 'is-invalid' : ''}`}
                    placeholder={t('contact.form_name')}
                    value={values.user_name}
                    onChange={onChange}
                    disabled={submitting}
                    aria-invalid={fieldInvalid('user_name')}
                />
                {fieldInvalid('user_name') && <div className="invalid-feedback">{errors.user_name}</div>}
            </div>

            <div className="col-md-6">
                <label className="form-label">{t('contact.form_email')}</label>
                <input
                    type="email"
                    name="email"
                    className={`form-control ${fieldInvalid('email') ? 'is-invalid' : ''}`}
                    placeholder={t('contact.form_email')}
                    value={values.email}
                    onChange={onChange}
                    disabled={submitting}
                    aria-invalid={fieldInvalid('email')}
                />
                {fieldInvalid('email') && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-12">
                <label className="form-label">{t('contact.form_phone')}</label>
                <input
                    type="text"
                    name="phone"
                    className={`form-control ${fieldInvalid('phone') ? 'is-invalid' : ''}`}
                    placeholder={t('contact.form_phone')}
                    value={values.phone}
                    onChange={onChange}
                    disabled={submitting}
                    aria-invalid={fieldInvalid('phone')}
                    inputMode="tel"
                    dir="ltr"
                />
                {fieldInvalid('phone') && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="col-12">
                <label className="form-label">{t('contact.form_message')}</label>
                <textarea
                    name="complaint"
                    className={`form-control ${fieldInvalid('complaint') ? 'is-invalid' : ''}`}
                    rows={3}
                    placeholder={t('contact.form_message')}
                    value={values.complaint}
                    onChange={onChange}
                    disabled={submitting}
                    aria-invalid={fieldInvalid('complaint')}
                />
                {fieldInvalid('complaint') && <div className="invalid-feedback">{errors.complaint}</div>}
            </div>

            {/* honeypot مخفي */}
            <div style={{ display: 'none' }}>
                <label>Website</label>
                <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div className="col-12">
                <div className="form-check">
                    <input
                        type="checkbox"
                        id="termsCheck"
                        name="agree"
                        className={`form-check-input ${fieldInvalid('agree') ? 'is-invalid' : ''}`}
                        checked={values.agree}
                        onChange={onChange}
                        disabled={submitting}
                        aria-invalid={fieldInvalid('agree')}
                    />
                    <label className="form-check-label" htmlFor="termsCheck">
                        {t('contact.form_terms')} <a href="#" target="_blank" rel="noopener noreferrer">{t('contact.terms_and_conditions')}</a>.
                    </label>
                    {fieldInvalid('agree') && <div className="invalid-feedback d-block">{errors.agree}</div>}
                </div>
            </div>

            <div className="col-12">
                <button className="btn btn-dark mb-0" type="submit" disabled={submitting}>
                    {submitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                            <span className="visually-hidden">{t('contact.send_message')}</span>
                        </>
                    ) : (
                        t('contact.send_message')
                    )}
                </button>
            </div>
        </form>
    );
}
