export default function CategoryCard({ category }) {
    const isAllCategories = category.id === "all";

    return (
        <div className="card card-category card-body bg-light text-center align-items-center">
            <div className="icon-xl bg-mode rounded-circle mb-3">
                <img
                    src={isAllCategories
                        ? '/assets/images/category/all.png'
                        : category.image || '/assets/images/category/all.png'}
                    alt={category.name}
                />
            </div>
            <h6 className="mb-0">
                <a
                    href={isAllCategories ? "/categories" : `/categories/${category.id}`}
                    className="stretched-link ff-l"
                >
                    {category.name}
                </a>
            </h6>
        </div>
    );
}
