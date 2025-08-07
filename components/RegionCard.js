export default function RegionCard({ region }) {
    return (
        <div className="card card-city bg-transparent text-center p-1 h-100" data-name={region.name}>
            <img src={region.image || '/assets/images/city/06.jpg'} className="rounded-3" alt={region.name} />
            <div className="card-body p-0 pt-3">
                <h5 className="card-title">
                    <a href={`/governorate/${region.id}`} className="stretched-link">
                        {region.name}
                    </a>
                </h5>
            </div>
        </div>
    );
}
