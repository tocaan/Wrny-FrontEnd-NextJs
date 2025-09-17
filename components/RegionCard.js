import { Link } from "@/i18n/routing";
import SafeImage from "./SafeImage";

export default function RegionCard({ region, isActive = null }) {
    return (
        <div className={`${isActive ? 'active-filter' : ''} card card-city bg-transparent text-center p-1 h-100`} data-name={region.name}>
            <SafeImage src={region.image || '/assets/images/city/06.jpg'} className="rounded-3" alt={region.name} width={300} height={100} style={{objectFit: 'cover'}} />
            <div className="card-body p-0 pt-3">
                <h5 className="card-title">
                    <Link href={`/governorate/${region.id}`} className="stretched-link">
                        {region.name}
                    </Link>
                </h5>
            </div>
        </div>
    );
}
