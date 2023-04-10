import React, { FormEvent, useRef } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

type Props = {};

function Signup({}: Props) {
	const { signup } = useAuth();

	const usernameRef = useRef<HTMLInputElement>(null);
	const nameRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLInputElement>(null);

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		if (signup.isLoading) return false;

		const username = usernameRef.current?.value;
		const name = nameRef.current?.value;
		const image = imageRef.current?.value;

		if (!username || !name) return false;

		signup.mutate({ id: username, name, image });
	}

	return (
		<>
			<h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
			<form
				onSubmit={handleSubmit}
				className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end"
			>
				<label htmlFor="username">Username</label>
				<Input
					id="username"
					name="username"
					pattern="\S*"
					type="text"
					required
					ref={usernameRef}
				/>
				<label htmlFor="name">Full Name</label>
				<Input id="name" name="name" type="text" required ref={nameRef} />
				<label htmlFor="image">Image URL</label>
				<Input id="image" name="image" type="url" required ref={imageRef} />
				<Button
					disabled={signup.isLoading}
					type="submit"
					className="col-span-full"
				>
					{signup.isLoading ? "Loading..." : "Sign Up"}
				</Button>
			</form>
		</>
	);
}

export default Signup;
