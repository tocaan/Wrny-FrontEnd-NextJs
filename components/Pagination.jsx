import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;

    const { current_page, last_page } = meta;
    const [isRTL, setIsRTL] = useState(false);

    useEffect(() => {
        const dir = document.documentElement.dir || 'ltr';
        setIsRTL(dir.toLowerCase() === 'rtl');
    }, []);

    const getVisiblePages = () => {
        const pages = [];
        const delta = 2;

        for (let i = Math.max(1, current_page - delta); i <= Math.min(last_page, current_page + delta); i++) {
            pages.push(i);
        }

        if (pages[0] > 1) {
            if (pages[0] > 2) pages.unshift('...');
            pages.unshift(1);
        }

        if (pages[pages.length - 1] < last_page) {
            if (pages[pages.length - 1] < last_page - 1) pages.push('...');
            pages.push(last_page);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="d-flex justify-content-center mt-4">
            <ul className="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">

                <li className={`page-item mb-0 ${current_page === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(current_page - 1)}
                        disabled={current_page === 1}
                    >
                        {
                            isRTL ? <IoIosArrowForward className='text-black' /> : <IoIosArrowBack className='text-black' />
                        }
                    </button>
                </li>

                {visiblePages.map((page, index) => (
                    <li key={index} className={`page-item mb-0 ${page === current_page ? 'active' : ''}`}>
                        {page === '...' ? (
                            <span className="page-link">...</span>
                        ) : (
                            <button
                                className="page-link"
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                <li className={`page-item mb-0 ${current_page === last_page ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(current_page + 1)}
                        disabled={current_page === last_page}
                    >
                        {
                            isRTL ? <IoIosArrowBack className='text-black' /> : <IoIosArrowForward className='text-black' />
                        }

                    </button>
                </li>
            </ul>
        </div>
    );
}
