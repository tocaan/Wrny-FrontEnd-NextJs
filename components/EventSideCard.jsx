import { Link } from "@/i18n/routing";

export default function EventSideCard({ event, eventType }) {
    const eventImage = event.images && event.images.length > 0 ? event.images[0] : '/assets/images/landmarks/01.jpg';
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
                <ul>
                    <li className="list-group-item text-primary fw-600">
                        <i className="bi bi-pin-map-fill h6 small text-primary mb-0"></i> {event.region?.name}
                    </li>
                </ul>
                <div className="mt-2 mt-sm-0 pb-3">
                    <h5 className="card-title">
                        <Link href={`/events/${event.id}`} className="stretched-link">
                            {event.name}
                        </Link>
                    </h5>
                    <p class="mb-1 d-flex gap-2"><i class="bi bi-geo-alt text-primary"></i><span>{event.address}</span></p>
                    {
                        event.start_date && (
                            <p class="mb-1 d-flex gap-2"><i class="bi bi-calendar2-plus text-primary"></i><span>{event.start_date}</span></p>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
