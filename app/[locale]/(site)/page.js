import { getTranslations } from 'next-intl/server';
import { createPageMetadata } from '@/utils/metadata';
import HomePage from './home/page';

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'home');
}
export default function Page() {
    return <HomePage />;
}
