const checkLoginCrudentials = (username = "N/A", password = "N/A") => {
	const errors = {};

	if (password.trim() === '' && password !== "N/A") {
		errors.password = 'Password field must not be empty';
	}
    if (fullname.trim() === '' && username !== "N/A") {
		errors.username = 'Name field must not be empty';
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

export default checkLoginCrudentials