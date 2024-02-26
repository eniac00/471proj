
import { BookOpenText, Contact2, Gauge, Palette, PanelTopDashed, PanelBottomDashed, FilePlus2 } from 'lucide-svelte';

export const userPanelPages = [
    { title: 'Dashboard', icon: Gauge, href: 'dashboard' },
    { title: 'Pages', icon: BookOpenText, href: 'pages' },
    { title: 'New Page', icon: FilePlus2, href: 'new-page' },
    { title: 'Profile', icon: Contact2, href: 'profile' }
];

export const adminPanelPages = [
    { title: 'Dashboard', icon: Gauge, href: 'dashboard' },
    { title: 'Users', icon: Contact2, href: 'users' },
    { title: 'Pages', icon: BookOpenText, href: 'pages' },
]
export const customizationPages = [
    { title: 'Header', href: 'site-header', icon: PanelTopDashed },
    { title: 'Footer', href: 'site-footer', icon: PanelBottomDashed },
    { title: 'Styling', href: 'site-styling', icon: Palette }
];