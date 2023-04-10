import React, {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	forwardRef,
} from "react";

type Props = {};

const Button = forwardRef<
	HTMLButtonElement,
	DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>(({ className, children, ...rest }, ref) => {
	return (
		<button
			className={`border-2 border-gray-900 bg-blue-500 p-2 w-full rounded text-white hover:bg-blue-600 focus:bg-blue-700 transition-colors disabled:bg-gray-500 ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
});

export default Button;
