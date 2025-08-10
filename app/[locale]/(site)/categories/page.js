import { createPageMetadata } from "@/utils/metadata";
import CategoriesPageClient from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'categories');
}
export default function CategoriesPage() {
    return (
        <CategoriesPageClient />
    );
}
