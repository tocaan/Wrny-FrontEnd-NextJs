import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Breadcrumb({ items }) {
    const t = useTranslations();

    return (
        <nav className="breadcrumb-main bg-light" aria-label="breadcrumb">
            <div className="container">
                <ol className="breadcrumb breadcrumb-dots">
                    <li className="breadcrumb-item">
                        <Link href="/">
                            <i className="bi bi-house me-1"></i> {t('breadcrumb.home')}
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={index} className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}>
                            {index === items.length - 1 ? (
                                item.name
                            ) : (
                                <Link href={item.href}>{item.name}</Link>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}
