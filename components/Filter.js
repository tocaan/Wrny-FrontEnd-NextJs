'use client';

import { useState } from 'react';

export default function Filter({ regions, onFilterChange }) {
    const [selectedRegions, setSelectedRegions] = useState([]);

    const handleRegionChange = (regionId) => {
        const newSelectedRegions = selectedRegions.includes(regionId)
            ? selectedRegions.filter(id => id !== regionId)
            : [...selectedRegions, regionId];

        setSelectedRegions(newSelectedRegions);
        onFilterChange({ regions: newSelectedRegions });
    };

    return (
        <div className="mt-3">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex">
                            {/* Filter collapse button */}
                            <input type="checkbox" className="btn-check" id="btn-check-soft" defaultChecked />
                            <label
                                className="btn btn-100 btn-primary-soft btn-primary-check mb-0 me-auto"
                                htmlFor="btn-check-soft"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseFilter"
                                aria-controls="collapseFilter"
                                aria-expanded="true"
                            >
                                <i className="bi fa-fe bi-sliders mx-2"></i>
                                عرض الفلتر
                            </label>
                        </div>
                    </div>
                </div>
                <div className="collapse show" id="collapseFilter">
                    <div className="card card-body bg-light p-4 mt-4 z-index-9">
                        {/* Form START */}
                        <form className="row g-4">
                            <div className="col-12">
                                <div className="form-control-borderless">
                                    <label className="form-label text-primary fw-600">المحافظة</label>
                                    <div className="row g-3">
                                        {regions.map((region) => (
                                            <div key={region.id} className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`region-${region.id}`}
                                                        checked={selectedRegions.includes(region.id)}
                                                        onChange={() => handleRegionChange(region.id)}
                                                    />
                                                    <label className="form-check-label h6 fw-light mb-0" htmlFor={`region-${region.id}`}>
                                                        {region.name}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Row END */}
                                </div>
                            </div>

                            {/* Button */}
                            <div className="text-center align-items-center mt-5">
                                <button type="button" className="btn btn-dark mb-0 mx-3 w-25" onClick={() => onFilterChange({ regions: selectedRegions })}>
                                    تطبيق
                                </button>
                            </div>
                        </form>
                        {/* Form END */}
                    </div>
                </div>
            </div>
        </div>
    );
}
