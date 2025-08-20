import { createPageMetadata } from "@/utils/metadata";
import FavoriteClient from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'favorite');
}
export default function FavoritePage() {
    return (
        <FavoriteClient />
    );
}
 