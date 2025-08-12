import { Link } from "@/i18n/routing";
import FavoriteHeart from "./ui/FavoriteHeart";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function EventCard({ event, eventType }) {
    const eventImage = event.images && event.images.length > 0 ? event.images[0] : '/assets/images/landmarks/01.jpg';
    const [c, setC] = useState(event);
    const t = useTranslations();
    useEffect(() => setC(event), [event]);
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
                    <FavoriteHeart
                        type="events"
                        itemId={c.id}
                        isFavorited={c.is_favorited}
                        onChange={(val) => {
                            setC(prev => ({ ...prev, is_favorited: val }));
                        }}
                    />
                </div>
                {
                    (eventType === 'events' || eventType === 'events_regions') && (
                        <div className="position-absolute top-0 start-0 p-3 z-index-9">
                            <div className="badge text-bg-info fw-600">{t("common.paidAds")}</div>
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
                        <Link href={`/events/${event.id}`} className="stretched-link">
                            {event.name}
                        </Link>
                    </h5>
                    <p className="mb-3 fs-12 text-justify excerpt-20">{event.description}</p>
                </div>
            </div>
        </div>
    );
}
