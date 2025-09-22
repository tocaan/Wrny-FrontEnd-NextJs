import { createPageMetadata } from '@/utils/metadata';
import AboutClientPage from './page.client';

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'about');
}

export default function AboutPage() {
    return <AboutClientPage />;
}
