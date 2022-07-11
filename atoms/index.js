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

// HOlds only DSP edit information
export const companyPreferenesState = atom ({
	key: 'companyPreferenesState',
	default: false
})


// Holds the drivers information for list & details
export const driverState = atom ({
	key: 'driverState',
	default: false
})

// Holds the managers information for list & details
export const managerState = atom ({
	key: 'managerState',
	default: false
})

// Holds the state information for list & details
export const assetState = atom ({
	key: 'assetState',
	default: false
})

// Holds the state information for list & details
export const chatState = atom ({
	key: 'chatState',
	default: false
})

// Holds the state information for list & details
export const accidentState = atom ({
	key: 'accidentState',
	default: false
})