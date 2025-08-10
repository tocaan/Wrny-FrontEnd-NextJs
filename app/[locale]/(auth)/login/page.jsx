import { createPageMetadata } from "@/utils/metadata";
import LoginClientPage from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'login');
}
export default function LoginPage() {
    return (
        <LoginClientPage />
    );
}
