import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function BranchCard({ branch, companyId }) {

    const t = useTranslations();
    const getBranchStatus = () => {
        const branchActive = branch.is_active ? true : false;

        if (!branchActive) return { status: 'closed', text: t('common.closed'), class: 'danger' };

        const isOpen = branchActive;

        return {
            status: isOpen ? 'opened' : 'closed',
            text: isOpen ? t('common.opened') : t('common.closed'),
            class: isOpen ? 'success' : 'danger'
        };
    };

    const branchStatus = getBranchStatus();
    return (
        <div className="col-12 col-md-4 col-xl-4">
            <div className="card card-body border mb-4">
                <div className="d-sm-flex mb-2 me-auto">
                    <span className={`text-${branchStatus.class} bg-${branchStatus.class} bg-opacity-10 px-2 rounded-1 fw-600`}>
                        {branchStatus.text}
                    </span>
                </div>
                <h5 className="card-title mb-2">
                    <Link href={`/companies/${companyId}/branches/${branch.id}`} className="stretched-link">
                        {branch.name}
                    </Link>
                </h5>
                <div className="d-flex align-items-center flex-wrap">
                    <p className="mb-3">
                        <FaMapMarkerAlt className="mx-1 text-primary" />
                        {branch.address}
                    </p>
                </div>
                <div className="mt-2 mt-sm-0 text-center">
                    <Link href={`/companies/${companyId}/branches/${branch.id}`} className="btn btn-sm btn-primary mb-0 stretched-link">
                        تفاصيل الفرع
                    </Link>
                </div>
            </div>
        </div>
    );
}
