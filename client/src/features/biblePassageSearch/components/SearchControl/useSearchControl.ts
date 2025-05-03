import { useState, useEffect } from "react";
import { useAppSelector, appDispatch } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { useAlertContext } from "../../../../contexts/AlertContext";
import Logger from "../../../../utils/Logger";
import { 
    BilbleSearchFilterState, 
    fetchBibleBooks, 
    fetchBibleVersions, 
    resetError, 
    BibleBook, 
    setBook, 
    BibleVersion, 
    setVersion, 
    setChapter, 
    setVerses, 
    fetchPassage, 
    PassageSearch,
    broadcastPassage,
    setOpenPresetDrawer,
    setOpenHistoryDrawer,
    savePassagePreset,
    PassageContent,
    setPassageContent,
    fetchBhpUserData,
    setDoSearchAndLive,
    Passage,
} from "../../biblePassageSearchSlice";

export const useSearchControl = () => {
    const { 
        books, 
        versions, 
        book, 
        version, 
        chapter, 
        verses, 
        error, 
        isSearchingPassage, 
        passageContent, 
        isBroadcastingPassage,
        openPresetDrawer,
        openHistoryDrawer,
        bhpUser,
        isSavingPreset,
    } = useAppSelector<RootState, BilbleSearchFilterState>((state) => state.biblePassageSearch);
    const [ inputError, setInputError ] = useState<string | null>(null);
    const [ canBroadcast, setCanBroadcast ] = useState<boolean>(false);
    const dispatch = appDispatch()
    const { showAlertError } = useAlertContext();

    useEffect(() => {
        if (!bhpUser) {
            dispatch(fetchBhpUserData())
        }
    }, [bhpUser])

    useEffect(() => {
        if (books.length === 0) {
            dispatch(fetchBibleBooks())
        }
        if (versions.length === 0) {
            dispatch(fetchBibleVersions())
        }
    }, [])

    useEffect(() => {
        if (books.length === 0) {
            dispatch(fetchBibleBooks())
        }
    }, [version])

    useEffect(() => {
        if (error) {
            showAlertError(error)
            dispatch(resetError())
        }
    }, [error])

    useEffect(() => {
        setCanBroadcast(!!passageContent)
    }, [passageContent])
    
    const handleBookChange = (value: BibleBook | null) => {
        dispatch(setBook(value))
    }

    const handleVersionChange = (value: BibleVersion | null) => {
        dispatch(setVersion(value))
    }

    const handleChapterChange = (value: number | null) => {
        dispatch(setChapter(value))
    }

    const isNumber = (value: string | null) => !isNaN(Number(value))

    const handleVerseChange = (value: string | null) => {
        setInputError(null)
        if (value && isNumber(value)) {
            if (+value > 0) {
                dispatch(setVerses([+value]))
            } else {
                setInputError('Invalid verse number.')
            }
            return
        }
        let strVerses = value?.trim() || ''
        if (!/^[0-9 ,-]+$/.test(strVerses)) {
            setInputError('Invalid verse format. Use comma separated numbers or hyphenated ranges.')
            return
        }
        Logger.debug('strVerses: ', strVerses)
        const verseRanges: string[] = strVerses.split(',')
        const selectedVerses: number[] = [];
        for (const range of verseRanges) {
            if (range.includes('-')) {
                const [start, end] = range.split('-')
                if (isNumber(start) && isNumber(end)) {
                    Array.from({ length: +end - +start + 1 }, (_, i) => i + +start).forEach((v) => selectedVerses.push(+v))
                }
            } else {
                if (isNumber(range)) {
                    selectedVerses.push(+range)
                }
            }
        }
        Logger.debug('selectedVerses: ', selectedVerses)
        dispatch(setVerses(selectedVerses))
    }

    type FetchPassageOptions = {
        broadcast?: boolean
        adhocVerses?: number[] | null
    }

    const doFetchPassage = ({ broadcast = false, adhocVerses = verses }: FetchPassageOptions = {}) => {
        if (inputError) {
            showAlertError({ message: inputError })
            setInputError(null)
            return
        }
        Logger.debug(`${book?.name} ${chapter}:${adhocVerses?.join(',')}`);
        if (version && book && chapter && adhocVerses && adhocVerses.length > 0) {
            const passageSearch: PassageSearch = {
                passage: {
                    book: book,
                    version: version,
                    chapter: chapter,
                    verses: adhocVerses
                },
                searchControl: {
                    broadcast: broadcast
                }
            }
            dispatch(fetchPassage(passageSearch))
        } else {
            const message = 'Missing selection: ';
            const required = []
            if (!version) required.push('version')
            if (!book) required.push('book')
            if (!chapter) required.push('chapter')
            if (!verses || verses.length === 0) required.push('verse')
            showAlertError({ message: `${message}${required.join(', ')}` })
        }
    }

    const doBroadcastPassage = () => {
        if (!passageContent) {
            showAlertError({ message: 'No searched passage' })
            return;
        }
        dispatch(broadcastPassage(passageContent))
    }

    const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const x = event.key;        
        if (x === 'Enter') {
            doFetchPassage({ broadcast: !!bhpUser?.doSearchAndLive })
        }
    }

    const togglePresetDrawer = (openPresetDrawer: boolean) => {
        dispatch(setOpenPresetDrawer(openPresetDrawer));
    }

    const toggleHistoryDrawer = (openPresetDrawer: boolean) => {
        dispatch(setOpenHistoryDrawer(openPresetDrawer));
    }

    const doSavePassagePreset = () => {
        if (!passageContent) {
            showAlertError({ message: 'No searched passage' })
            return;
        }
        const bhpPreset = {
            title: passageContent.passage?.description || 'Untitled Passage',
            passageContent: passageContent,
        }
        dispatch(savePassagePreset(bhpPreset))
    }

    const loadPassagePresetHistory = (passageContent: PassageContent) => {
        dispatch(setPassageContent(passageContent))
        if (bhpUser?.doSearchAndLive) dispatch(broadcastPassage(passageContent))
    }

    const toggleSearchAndLive = (value: boolean) => {
        dispatch(setDoSearchAndLive(value))
    }

    const goToVerseFromCurrent = (step: number) => {
        if (passageContent) {
            const { verses } = passageContent.passage as Passage
            if (verses.length > 0) {
                const verse = verses[0] + step
                if (verse > 0) {
                    doFetchPassage({ broadcast: !!bhpUser?.doSearchAndLive, adhocVerses: [verse] })
                }
            }
        }
    }

    const goToPreviousVerse = () => {
        goToVerseFromCurrent(-1)
    }

    const goToNextVerse = () => {
        goToVerseFromCurrent(1)
    }

    return {
        books,
        versions,
        book,
        version,
        handleBookChange,
        handleVersionChange,
        handleChapterChange,
        handleVerseChange,
        keyDown,
        doFetchPassage,
        isSearchingPassage,
        doBroadcastPassage,
        isBroadcastingPassage,
        getLiveDisableProps: () => {
            return canBroadcast ? {}
                : {
                    disabled: true,
                    className: 'disabled'
                }
        },
        openPresetDrawer, togglePresetDrawer,
        openHistoryDrawer, toggleHistoryDrawer,
        doSavePassagePreset,
        bhpUser,
        loadPassagePresetHistory,
        toggleSearchAndLive,
        isSavingPreset,
        goToPreviousVerse,
        goToNextVerse,
    }
}