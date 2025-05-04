import { useState, useEffect } from "react";
import { useAppSelector, appDispatch, resultDispatch } from "../../../../app/hooks";
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
    setDoTypeVerse,
    setTypePassageSuggestions,
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
        doTypeVerse,
        typePassageSuggestions,
    } = useAppSelector<RootState, BilbleSearchFilterState>((state) => state.biblePassageSearch);
    const [ inputError, setInputError ] = useState<string | null>(null);
    const [ canBroadcast, setCanBroadcast ] = useState<boolean>(false);
    const dispatch = appDispatch()
    const { showAlertError, showAlert } = useAlertContext();

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

    const parseVerse = (value: string | null): number[] => {
        setInputError(null)
        if (value && isNumber(value)) {
            if (+value > 0) {
               return [+value]
            } else {
                setInputError('Invalid verse number.')
            }
            return []
        }
        let strVerses = value?.trim() || ''
        if (!/^[0-9 ,-]+$/.test(strVerses)) {
            Logger.debug('Invalid verse format: ', strVerses)
            setInputError('Invalid verse format. Use comma separated numbers or hyphenated ranges.')
            return []
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
        return selectedVerses
    }

    const handleVerseChange = (value: string | null) => {
        if (!value) {
            dispatch(setVerses([]))
            return
        }
        const selectedVerses = parseVerse(value)
        if (selectedVerses.length) { 
            dispatch(setVerses(selectedVerses))
        }
    }

    type FetchPassageOptions = {
        broadcast?: boolean
        adhocVerses?: number[] | null
        adhocBook?: BibleBook | null
        adhocChapter?: number | null
        byPassageContent?: boolean
    }

    const doFetchPassage = ({ broadcast = false, adhocVerses = verses, adhocBook = book, adhocChapter = chapter, byPassageContent = false }: FetchPassageOptions = {}) => {
        if (inputError) {
            showAlertError({ message: inputError })
            setInputError(null)
            return
        }
        if (version && adhocBook && adhocChapter && adhocVerses && adhocVerses.length > 0) {
            Logger.debug(`${adhocBook?.name} ${adhocChapter}:${adhocVerses?.join(',')}`);
            const passageSearch: PassageSearch = {
                passage: {
                    book: adhocBook,
                    version: version,
                    chapter: adhocChapter,
                    verses: adhocVerses
                },
                searchControl: {
                    broadcast: broadcast
                }
            }
            dispatch(fetchPassage(passageSearch))
        } else if (byPassageContent && passageContent) {
            let passageSearch: PassageSearch = {
                passage: passageContent.passage as Passage,
                searchControl: {
                    broadcast: broadcast
                }
            }
            if (adhocVerses && adhocVerses.length > 0) {
                passageSearch = {
                    ...passageSearch,
                    passage: {
                        ...passageSearch.passage,
                        verses: adhocVerses,
                    },
                }
            }
            dispatch(fetchPassage(passageSearch))
        } else {
            const message = 'Missing selection: ';
            const required = []
            if (!version) required.push('version')
            if (!adhocBook) required.push('book')
            if (!adhocChapter) required.push('chapter')
            if (!adhocVerses || adhocVerses.length === 0) required.push('verse')
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
        .then(res => resultDispatch(res, () => showAlert(`Preset '${bhpPreset.title}' was saved`, 'success')))
        .catch(err => showAlertError({ message: `Preset not saved - ${err}` }))
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
                    doFetchPassage({ broadcast: !!bhpUser?.doSearchAndLive, adhocVerses: [verse], byPassageContent: true })
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

    const handleTypeVerseChange = (checked: boolean) => {
        dispatch(setDoTypeVerse(checked))
    }

    const handleTypePassageChange = (typedPassage: string) => {
        if (!typedPassage) {
            dispatch(setTypePassageSuggestions([]))
            return
        }
        const passageSuggestions: Passage[] = [];
        const matches = typedPassage?.trim().match(/([1-3\s]+)?([A-Za-z\s]+)([0-9]+)?(\s+|:)?([0-9,-]+)?/)
        if (matches?.length === 6) {
            const typedBookAffix: string = matches[1]?.trim() || ''
            const typedBook: string = matches[2]?.trim() || ''
            const typedChapter: number = +matches[3]?.trim() || 0
            const rawTypedVerses: string = matches[5]?.trim() || ''
            const typedVerses: number[] = parseVerse(rawTypedVerses) || []
            Logger.debug('typedBookAffix: ', typedBookAffix)
            Logger.debug('typedBook: ', typedBook)
            Logger.debug('typedChapter: ', typedChapter)
            Logger.debug('typedVerses: ', typedVerses)
            const suggestedBooks = books.filter((book) => {
                const bookName = book.name.toLowerCase()
                if ((!typedBookAffix || bookName.includes(typedBookAffix.toLowerCase())) && bookName.includes(typedBook.toLowerCase())) return true
                if (version?.language && book.languages[version?.language]) {
                    const bookOtherName = book.languages[version?.language].toLowerCase()
                    Logger.debug('bookOtherName: ', bookOtherName)
                    return (!typedBookAffix || bookOtherName.includes(typedBookAffix.toLowerCase())) && bookOtherName.includes(typedBook.toLowerCase())
                }
                return false
            })
            suggestedBooks.forEach((book) => {
                let bookName: string = book.name
                if (version?.language) {
                    const bookOtherName = book.languages[version?.language]
                    if (bookOtherName && bookOtherName.toLowerCase().includes(typedBook.toLowerCase())) {
                        bookName = bookOtherName
                    }
                }
                const passageChapter: number = (typedChapter > book.numberOfChapters ? book.numberOfChapters : typedChapter) || 1
                const passageVerses: number[] = typedVerses.length ? typedVerses : [1]
                const passage: Passage = {
                    version: version as BibleVersion,
                    book: book,
                    chapter: passageChapter,
                    verses: passageVerses,
                    description: `${bookName} ${passageChapter}:${typedVerses.length ? rawTypedVerses : 1}`
                }
                passageSuggestions.push(passage)
            })
        }
        Logger.debug('passageSuggestions: ', passageSuggestions)
        if (passageSuggestions.length > 0) setInputError(null)
        dispatch(setTypePassageSuggestions(passageSuggestions))
    }

    const handleTypePassageSelection = (passage: Passage | null) => {
        if (passage) {
            const { book, chapter, verses } = passage
            doFetchPassage({ broadcast: !!bhpUser?.doSearchAndLive, adhocBook: book, adhocChapter: chapter, adhocVerses: verses })
        }
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
        handleTypeVerseChange,
        doTypeVerse,
        handleTypePassageChange,
        typePassageSuggestions,
        handleTypePassageSelection,
    }
}