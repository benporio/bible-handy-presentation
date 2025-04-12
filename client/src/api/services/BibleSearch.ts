import apiClient from '../apiClient';
import { ApiResponse } from '../../types/Response';
import Endpoint from '../../constants/endpoint';
import { BhpPreset, Passage, PassageContent, PassageSearch } from '../../features/biblePassageSearch/biblePassageSearchSlice';

export const fetchBibleBooks = async (): Promise<ApiResponse> => { 
    try {
        return await apiClient.get(Endpoint.BIBLE_SEARCH_FETCH_BOOKS);
    } catch (error: any) {
        return error as ApiResponse;
    }
}

export const fetchBibleVersions = async (): Promise<ApiResponse> => { 
    try {
        return await apiClient.get(Endpoint.BIBLE_SEARCH_FETCH_VERSIONS);
    } catch (error: any) {
        return error as ApiResponse;
    }
}

export const fetchPassage = async (passageSearch: PassageSearch): Promise<ApiResponse> => { 
    try {
        return await apiClient.post(Endpoint.BIBLE_SEARCH_PASSAGE, passageSearch);
    } catch (error: any) {
        return error as ApiResponse;
    }
}

export const broadcastPassage = async (passageContent: PassageContent): Promise<ApiResponse> => { 
    try {
        return await apiClient.post(Endpoint.BIBLE_BROADCAST_PASSAGE, passageContent);
    } catch (error: any) {
        return error as ApiResponse;
    }
}

export const savePassagePreset = async (bhpPreset: BhpPreset): Promise<ApiResponse> => { 
    try {
        return await apiClient.post(Endpoint.BIBLE_PASSAGE_SAVE_PRESET, bhpPreset);
    } catch (error: any) {
        return error as ApiResponse;
    }
}

export const fetchBhpUserData = async (): Promise<ApiResponse> => { 
    try {
        return await apiClient.get(Endpoint.BIBLE_LOAD_BHP_USER);
    } catch (error: any) {
        return error as ApiResponse;
    }
}