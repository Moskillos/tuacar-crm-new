import {TargetAndTransition, VariantLabels} from 'framer-motion';
import {MouseEventHandler} from 'react';

interface NavBarOptions {
	id: number;
	slug: string | undefined;
	onClick: MouseEventHandler<HTMLDivElement> | undefined;
	whileHover: VariantLabels | TargetAndTransition | undefined;
	whileTap: VariantLabels | TargetAndTransition | undefined;
	image: {
		src: string;
		alt: string;
		height: number;
		width: number;
	};
}

export default NavBarOptions;
