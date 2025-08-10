import { createPageMetadata } from "@/utils/metadata";
import ProfileClientPage from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'account');
}
export default function ProfilePage() {
    return (
        <ProfileClientPage />
    );
}
