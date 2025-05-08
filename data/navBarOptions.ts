import { goToERPHome, signOut } from '@/lib/utils';
import NavBarOptions from '@/types/nav/NavBarOptions';

export const navBarOptions: NavBarOptions[] = [
    {
        id: 1,
        slug: "/",
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/apps.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 2,
        slug: "/leads/research",
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/search.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 3,
        slug: "/dashboard",
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/numbers.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 4,
        slug: "/pipeline/vendita",
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/sell.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 5,
        slug: '/pipeline/acquisizione',
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/buy.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 6,
        slug: '/pipeline/rent',
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/rent.png',
            alt: '',
            height: 65,
            width: 65
        }
    },
    {
        id: 7,
        slug: '/pipeline/rent/breve',
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/breve.png',
            alt: '',
            height: 65,
            width: 65
        }
    },
    {
        id: 8,
        slug: '/pipeline/rent/lungo',
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/lungo.png',
            alt: '',
            height: 65,
            width: 65
        }
    },
    {
        id: 9,
        slug: "/emails/list",
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/mail.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 10,
        slug: "/leads/list",
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/leads.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 11,
        slug: "/calendar",
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/calendar.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 12,
        slug: "/contacts/list",
        onClick: undefined,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/contacts.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
    {
        id: 13,
        slug: undefined,
        onClick: () => goToERPHome(),
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/erp.png',
            alt: '',
            height: 57,
            width: 57
        }
    },
    {
        id: 14,
        slug: undefined,
        onClick: () => signOut(),
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        image: {
            src: '/exit.png',
            alt: '',
            height: 60,
            width: 60
        }
    },
]
