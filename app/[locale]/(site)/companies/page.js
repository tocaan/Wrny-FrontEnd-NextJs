import { createPageMetadata } from "@/utils/metadata";
import CompaniesClientPage from "./page.client";

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'companies');
}
export default function CompaniesPage() {

    return (
        <CompaniesClientPage />
    );
}
