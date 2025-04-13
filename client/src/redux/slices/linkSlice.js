import { createSlice } from '@reduxjs/toolkit';

const linkSlice = createSlice({
    name: 'links',
    initialState: {
        allLinks: [],
    },
    reducers: {
        setLinks(state, action) {
            state.allLinks = action.payload;
        },
    },
});

export const { setLinks } = linkSlice.actions;
export default linkSlice.reducer;