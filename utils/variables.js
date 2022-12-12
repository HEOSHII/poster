import { toast } from "react-toastify"

export const toastOptions = {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 800,
    hideProgressBar: true,
    draggable: true,
    closeOnClick: true,
    limit: true,
}; 

export const TEXTS = {
    DASHBOARD: {
        PROFILE: 'Profile',
        NEW_POST: 'New Post',
        USER_POSTS: 'My Posts',
        SIGN_OUT: 'Sign Out',
    },
    PAGE_NAMES: {
        ALL_POST: 'ALL POSTS',
        UPDATE_POST: 'UPDATING POST',
        CREATE_POST: 'CREATING POST',
        PROFILE: 'PROFILE',
    }
}

