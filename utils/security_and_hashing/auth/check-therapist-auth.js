import { AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkTherapistAuth = (context) => {
	const authHeader = context.req.headers.authorization
		
	if (authHeader) {
		const token = authHeader;

		if (token) {
			try {
				const driver = jwt.verify(token, process.env.JWT_THERAPIST_SECRET);
				return driver;
			} catch (err) {
				throw new AuthenticationError('Error: Invalid token');
			}
		}
		throw new Error('Error: Invalid Header, check header contents');
	}

	throw new Error('Error: No Auth header found');
};

export default checkTherapistAuth;