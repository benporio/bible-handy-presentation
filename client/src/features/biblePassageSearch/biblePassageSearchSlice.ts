import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiResponse } from '../../types/Response'
import { 
    fetchBibleBooks as fetchBibleBooksApi,
    fetchBibleVersions as fetchBibleVersionsApi,
    fetchPassage as fetchPassageApi, 
    broadcastPassage as broadcastPassageApi,
    savePassagePreset as savePassagePresetApi,
    fetchBhpUserData as fetchBhpUserDataApi,
} from '../../api/services/BibleSearch'
import { ApiError } from '../../types/Error'
import Endpoint from '../../constants/endpoint'

export type BibleBook = {
    code: string
    name: string
    numberOfChapters: number
    order: number
    languages: { [key: string]: string }
}

export type BibleVersion = {
    code: string
    name: string
    language: string
    id1: number
}

export type Passage = {
    version: BibleVersion
    book: BibleBook
    chapter: number
    verses: number[]
    description?: string
}

export type PassageContent = {
    message: string,
    passage: Passage | null
    parts?: { id: string, className: string, innerText: string }[]
}

export type PassageSearch = {
    passage: Passage
    searchControl?: {
        broadcast?: boolean
    }
}

export type BhpPreset = {
    title: string
    passageContent: PassageContent
}

export type BhpHistory = {
    logDate: Date
    passageContent: PassageContent
}

export type BhpUser = {
    doSearchAndLive: boolean
    bibleSearchPresets: BhpPreset[]
    bibleSearchHistory: BhpHistory[]
}

export type BilbleSearchFilterState = {
    books: BibleBook[]
    versions: BibleVersion[]
    error: ApiError | null
    book: BibleBook | null
    version: BibleVersion | null
    chapter: number | null
    verses: number[] | null
    passage: Passage | null
    passageContent: PassageContent | null
    isSearchingPassage: boolean
    isBroadcastingPassage: boolean
    openPresetDrawer: boolean
    openHistoryDrawer: boolean
    isSavingPreset: boolean
    bhpUser: BhpUser | null
}

const initialState: BilbleSearchFilterState = {
    books: [],
    versions: [],
    error: null,
    book: null,
    version: null,
    chapter: null,
    verses: [],
    passage: null,
    passageContent: null,
    isSearchingPassage: false,
    isBroadcastingPassage: false,
    openPresetDrawer: false,
    openHistoryDrawer: false,
    isSavingPreset: false,
    bhpUser: null,
}

const biblePassageSearchSlice = createSlice({
    name: 'biblePassageSearch',
    initialState,
    reducers: {
        reset: (state) => {
            return initialState
        },
        resetError: (state) => {
            state.error = null
        },
        setBook(state, action: PayloadAction<BibleBook | null>) {
            state.book = action.payload
        },
        setVersion(state, action: PayloadAction<BibleVersion | null>) {
            state.version = action.payload
        },
        setChapter(state, action: PayloadAction<number | null>) {
            state.chapter = action.payload
        },
        setVerses(state, action: PayloadAction<number[] | null>) {
            state.verses = action.payload
        },
        setPassage(state, action: PayloadAction<Passage>) {
            state.passage = action.payload
        },
        setPassageContent(state, action: PayloadAction<PassageContent>) {
            state.passageContent = action.payload
        },
        setOpenPresetDrawer(state, action: PayloadAction<boolean>) {
            state.openPresetDrawer = action.payload
        },
        setOpenHistoryDrawer(state, action: PayloadAction<boolean>) {
            state.openHistoryDrawer = action.payload
        },
        setDoSearchAndLive(state, action: PayloadAction<boolean>) {
            if (state.bhpUser) {
                state.bhpUser.doSearchAndLive = action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBibleBooks.fulfilled, (state, { payload }) => {
            state.books = payload
        })
        builder.addCase(fetchBibleBooks.rejected, (state, { payload }) => {
            const error = payload as ApiError
            if (!!error) {
                state.error = error
            }
            state.books = [];
        })

        builder.addCase(fetchBibleVersions.fulfilled, (state, { payload }) => {
            state.versions = payload
        })
        builder.addCase(fetchBibleVersions.rejected, (state, { payload }) => {
            const error = payload as ApiError
            if (!!error) {
                state.error = error
            }
            state.versions = [];
        })
        
        builder.addCase(fetchPassage.pending, (state) => {
            state.isSearchingPassage = true;
            state.error = null
        })
        builder.addCase(fetchPassage.fulfilled, (state, { payload }) => {
            state.passageContent = payload
            state.bhpUser?.bibleSearchHistory.unshift({ logDate: new Date(), passageContent: payload });
            state.isSearchingPassage = false;
        })
        builder.addCase(fetchPassage.rejected, (state, { payload }) => {
            const error = payload as ApiError
            if (!!error) {
                state.error = error
            }
            state.passageContent = null;
            state.isSearchingPassage = false;
        })
        
        builder.addCase(broadcastPassage.pending, (state) => {
            state.isBroadcastingPassage = true;
            state.error = null
        })
        builder.addCase(broadcastPassage.fulfilled, (state, { payload }) => {
            state.isBroadcastingPassage = false;
        })
        builder.addCase(broadcastPassage.rejected, (state, { payload }) => {
            const error = payload as ApiError
            if (!!error) {
                state.error = error
            }
            state.isBroadcastingPassage = false;
        })
        
        builder.addCase(savePassagePreset.pending, (state) => {
            state.isSavingPreset = true;
            state.error = null
        })
        builder.addCase(savePassagePreset.fulfilled, (state, { payload }) => {
            state.isSavingPreset = false;
            state.bhpUser?.bibleSearchPresets.unshift(payload);
        })
        builder.addCase(savePassagePreset.rejected, (state, { payload }) => {
            const error = payload as ApiError
            if (!!error) {
                state.error = error
            }
            state.isSavingPreset = false;
        })
        
        builder.addCase(fetchBhpUserData.fulfilled, (state, { payload }) => {
            state.bhpUser = payload;
        })
        builder.addCase(fetchBhpUserData.rejected, (state, { payload }) => {
            const error = payload as ApiError
            if (!!error) {
                state.error = error
            }
        })
    },
})

export const fetchBibleBooks = createAsyncThunk<BibleBook[]>(Endpoint.BIBLE_SEARCH_FETCH_BOOKS, async (_, { rejectWithValue }) => {
    try {
        const response: ApiResponse = await fetchBibleBooksApi();
        if (response.statusCode === 200) {
            return response.data as BibleBook[]
        }
        return rejectWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchBibleVersions = createAsyncThunk<BibleVersion[]>(Endpoint.BIBLE_SEARCH_FETCH_VERSIONS, async (_, { rejectWithValue }) => {
    try {
        const response: ApiResponse = await fetchBibleVersionsApi();
        if (response.statusCode === 200) {
            return response.data as BibleVersion[]
        }
        return rejectWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchPassage = createAsyncThunk<PassageContent, PassageSearch>(Endpoint.BIBLE_SEARCH_PASSAGE, async (passageSearch: PassageSearch, { rejectWithValue }) => {
    try {
        const response: ApiResponse = await fetchPassageApi(passageSearch);
        if (response.statusCode === 200) {
            return response.data as PassageContent
        }
        return rejectWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const broadcastPassage = createAsyncThunk<ApiResponse, PassageContent>(Endpoint.BIBLE_BROADCAST_PASSAGE, async (passageContent: PassageContent, { rejectWithValue }) => {
    try {
        const response: ApiResponse = await broadcastPassageApi(passageContent);
        if (response.statusCode === 200) {
            return response.data as ApiResponse
        }
        return rejectWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const savePassagePreset = createAsyncThunk<BhpPreset, BhpPreset>(Endpoint.BIBLE_PASSAGE_SAVE_PRESET, async (bhpPreset: BhpPreset, { rejectWithValue }) => {
    try {
        const response: ApiResponse = await savePassagePresetApi(bhpPreset);
        if (response.statusCode === 200) {
            return response.data as BhpPreset
        }
        return rejectWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchBhpUserData = createAsyncThunk<BhpUser>(Endpoint.BIBLE_LOAD_BHP_USER, async (_, { rejectWithValue }) => {
    try {
        const response: ApiResponse = await fetchBhpUserDataApi();
        if (response.statusCode === 200) {
            return response.data as BhpUser
        }
        return rejectWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const {
    reset,
    setBook,
    setVersion,
    setChapter,
    setVerses,
    setPassage,
    resetError,
    setOpenPresetDrawer,
    setOpenHistoryDrawer,
    setPassageContent,
    setDoSearchAndLive,
} = biblePassageSearchSlice.actions

export default biblePassageSearchSlice.reducer