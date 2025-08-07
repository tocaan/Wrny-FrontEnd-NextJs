import Link from "next/link";

export default function EventCard({ event, eventType }) {

    // الحصول على أول صورة من مصفوفة الصور
    const eventImage = event.images && event.images.length > 0 ? event.images[0] : '/assets/images/landmarks/01.jpg';
    console.log(eventType);
    return (
        <div className="card shadow p-2 pb-0 h-100">
            <div className="position-relative arrow-round arrow-xs arrow-dark rounded-2 overflow-hidden">
                <div className="bg-overlay bg-dark opacity-1"></div>
                <div className="img-company">
                    <img src={eventImage} alt="Card image" />
                </div>
            </div>
            <div className="card-body px-3 pb-0">
                <div className="heart-icon position-absolute top-0 end-0 p-3 z-index-9">
                    <button className="mb-0 btn btn-white btn-round z-index-2">
                        <i className={`bi fa-fw ${event.is_favorited ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                    </button>
                </div>
                {
                    eventType == 'events' && (
                        <div class=" position-absolute top-0 start-0 p-3 z-index-9">
                            <div class="badge text-bg-info fw-600">اعلان مدفوع</div>
                        </div>
                    )
                }
                <ul>
                    <li className="list-group-item text-primary fw-600">
                        <i className="bi bi-pin-map-fill h6 small text-primary mb-0"></i> {event.region?.name}
                    </li>
                </ul>
                <div className="mt-2 mt-sm-0">
                    <h5 className="card-title">
                        <Link href={`/event/${event.id}`} className="stretched-link">
                            {event.name}
                        </Link>
                    </h5>
                    <p className="mb-3 fs-12 text-justify excerpt-20">{event.description}</p>
                </div>
            </div>
        </div>
    );
}
