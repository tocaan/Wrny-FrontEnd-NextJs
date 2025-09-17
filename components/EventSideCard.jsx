import { Link } from "@/i18n/routing";
import FavoriteHeart from "./ui/FavoriteHeart";
import { useEffect, useState } from "react";
import SafeImage from "./SafeImage";

export default function EventSideCard({ event, eventType }) {
    const eventImage = event.images && event.images.length > 0 ? event.images[0] : '/assets/images/landmarks/01.jpg';
    const [c, setC] = useState(event);
    useEffect(() => setC(event), [event]);
    return (
        <div className="card shadow p-2 pb-0 h-100">
            <div className="position-relative arrow-round arrow-xs arrow-dark rounded-2 overflow-hidden">
                <div className="bg-overlay bg-dark opacity-1"></div>
                <div className="img-company">
                    <SafeImage src={eventImage} alt="Card image" width={400} height={300} style={{objectFit: 'cover'}} />
                </div>
            </div>
            <div className="card-body px-3 pb-0">
                <div className="heart-icon position-absolute top-0 end-0 p-3 z-index-9">
                    <FavoriteHeart
                        type="events"
                        itemId={c.id}
                        isFavorited={c.is_favorited}
                        onChange={(val) => {
                            setC(prev => ({ ...prev, is_favorited: val }));
                        }}
                    />
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
                    <p className="mb-1 d-flex gap-2"><i className="bi bi-geo-alt text-primary"></i><span>{event.address}</span></p>
                    {
                        event.start_date && (
                            <p className="mb-1 d-flex gap-2"><i className="bi bi-calendar2-plus text-primary"></i><span>{event.start_date}</span></p>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
