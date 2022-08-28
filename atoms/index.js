import { atom } from 'recoil';

// HOlds the mobile menu state
export const menuState = atom({
    key: "menuState",
    default: false,
});


// Holds the user refres and dynamic sign in mutation
export const userState = atom({
	key: 'userState',
	default: {
		loading: true
	},
});

export const meetingsState = atom({
	key: 'meetingsState',
	default: {
		loading: true
	},
});


export const chatRoomState = atom({
	key: 'chatRoomState',
	default: {
		loading: true
	},
});
