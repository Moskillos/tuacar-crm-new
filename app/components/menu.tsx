"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import { navBarOptions } from '@/data/navBarOptions';
import { useRouter } from 'next/navigation';

export default function MenuMobile() {

	const router = useRouter();

	const [hiddenChat, setHidden] = useState(true);
	const hideChat = () => {
		setHidden(!hiddenChat);
	};

	const goTo = (path: any) => {
		hideChat()
		router.push(path);
	};

	return (

		<>
			<div
				className="flex sm:flex md:flex lg:hidden xl:hidden fixed bottom-5 left-5 h-[55px] w-[55px] rounded-full z-50 bg-blue-500 text-white flex items-center justify-center"
				onClick={() => hideChat()}
			>
				<div className="flex justify-center items-center px-3 py-3  hover:cursor-pointer">
					{hiddenChat &&
						<Menu size={25} />
					}
					{!hiddenChat &&
						<X size={25} />
					}
				</div>
			</div>
			{!hiddenChat &&
				<div
					className={`display sm:hidden md:display lg:display xl:display bg-slate-100 fixed top-1 h-full w-full grid grid-cols-5 text-white p-3 transition-opacity duration-300 gap-3 rounded-3xl z-10 opacity-95`}
					style={{ gridAutoRows: 'min-content' }}
				>
					{navBarOptions.map((navBarOption) => (
						<motion.div
							key={navBarOption.id}
							onClick={navBarOption.slug ? () => goTo(navBarOption.slug) : navBarOption.onClick}
							whileHover={navBarOption.whileHover}
							whileTap={navBarOption.whileTap}
						>
							<Image
								className="hover:scale-110 rounded-2xl"
								src={navBarOption.image.src}
								alt={navBarOption.image.alt}
								height={navBarOption.image.height}
								width={navBarOption.image.width}
							/>
						</motion.div>
					))}
				</div>
			}
		</>
	);
}