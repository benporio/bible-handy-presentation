import { ServiceResult } from "../types/ActionResult";
import { IBibleBook, BibleBookFactory, Passage, PassageContent, VerseMessage, PassageMessage, PassageSearch } from "../models/BibleBook";
import { BibleVersionFactory, IBibleVersion } from "../models/BibleVersion";
import { BhpHistory, BhpPreset, BhpUserFactory } from "../models/BhpUser";
import Logger from "../utils/Logger";
import { JSDOM  } from 'jsdom';
import { broadcast } from "../configs/webSocket";
import { v4 as uuidv4 } from 'uuid';
import PromiseUtil from '../utils/PromiseUtil'

class BibleSearchService {
    public async retrieveBooks(): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        const bibleBooks: IBibleBook[] = await BibleBookFactory.findAllBooks() as IBibleBook[];
        if (!!!bibleBooks || bibleBooks.length === 0) {
            return {
                ...result,
                status: 'error',
                message: 'Fetching Bible Books failed'
            };
        }
        return {
            ...result,
            status: 'success',
            data: bibleBooks,
        }
    }

    public async retrieveVersions(): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        const bibleVersions: IBibleVersion[] = await BibleVersionFactory.findAllVersions() as IBibleVersion[];
        if (!!!bibleVersions || bibleVersions.length === 0) {
            return {
                ...result,
                status: 'error',
                message: 'Fetching Bible Versions failed'
            };
        }
        return {
            ...result,
            status: 'success',
            data: bibleVersions,
        }
    }

    private async parseVerseMessage(doc: JSDOM, book: IBibleBook, chapter: number, verse: number): Promise<VerseMessage | null> {
        return await PromiseUtil.createPromise<VerseMessage| null>((resolve, reject) => {
            if (verse <= 0) {
                Logger.error('Verse number must be greater than 0')
                reject(null)
                return
            }
            let rawMessage: string[] = [];
            let labelBuff = '';
            const parts: { id: string, className: string, innerText: string }[] = []
            let data: NodeListOf<Element> = doc.window.document.querySelectorAll(`[data-usfm="${book.code}.${chapter}.${verse}"]`);
            if (!!!data?.length) {
                data = doc.window.document.querySelectorAll(`[data-usfm*="${book.code}.${chapter}.${verse}+"]`);
            }
            if (!!!data?.length) {
                data = doc.window.document.querySelectorAll(`[data-usfm*="+${book.code}.${chapter}.${verse}"]`);
            }
            for (let i = 0; i < data.length; i++) {
                for (let ii = 0; ii < data[i].children.length; ii++) {
                    const dataChildren: Element = data[i].children[ii];
                    if (['nd', 'add', 'content', 'wj', 'label'].some(z => dataChildren.className.includes(z))) {
                        const innerText: string = dataChildren.textContent || ''
                        rawMessage = rawMessage.concat(innerText);
                        const id: string = uuidv4()
                        parts.push({ id, className: dataChildren.className, innerText: innerText})
                    }
                    if (data[i].children[ii].className.includes('label')) {
                        labelBuff = data[i].children[ii].textContent || ''
                    }
                }
            }
            resolve({
                verse: parseInt(String(labelBuff).trim()),
                content: rawMessage.filter(x => x !== labelBuff).join(' '),
                parts
            });
        })
    }

    private async buildPassageLabel(version: IBibleVersion, book: IBibleBook, chapter: number, verses: number[]): Promise<string> {
        return await PromiseUtil.createPromise<string>((resolve, reject) => {
            const bookName = book.languages[version?.language || ''] || book.name
            if (verses.length === 1) {
                resolve(`${bookName} ${chapter}:${verses[0]}`)
            } else {
                let labelBuff = `${bookName} ${chapter}:`;
                let verseBuff = null;
                let hasRange = false;
                let verseCount = 0;
                let verseLength = verses.length;
                for (const verse of verses) {
                    verseCount++;
                    if (verseBuff === null) {
                        labelBuff += verse;
                    } else {
                        if (verseBuff + 1 === verse) {
                            if (!hasRange) {
                                labelBuff += '-'
                                hasRange = true;
                            }
                            if (verseCount === verseLength) {
                                labelBuff += verse;
                            }
                        } else {
                            if (hasRange) {
                                labelBuff += verseBuff;
                                hasRange = false;
                            }
                            labelBuff += `,${verse}`;
                        }
                    }
                    verseBuff = verse;
                }
                resolve(labelBuff)
            }
        })
    }

    private async parsePassageMessage(body: string, passage: Passage): Promise<PassageMessage | null> {
        return await PromiseUtil.createPromise<PassageMessage | null>((resolve, reject) => {
            const { book, chapter, verses, version } = passage;
            const nonZeroVerses = verses.filter(x => x > 0);
            try {
                const doc = new JSDOM(body);
                Promise.all([ 
                    this.buildPassageLabel(version, book, chapter, nonZeroVerses).catch(err => err), 
                    ...nonZeroVerses.map(verse => this.parseVerseMessage(doc, book, chapter, verse).catch(err => err))
                ]).then((verseMessages) => {
                    if (verseMessages.some(x => x === null)) {
                        reject(null)
                    } else {
                        resolve({
                            passageLabel: verseMessages.shift() as string,
                            verseMessages: ((): VerseMessage[] => {
                                const verseSet = new Set();
                                return verseMessages.filter(verseMessage => {
                                    const verse = verseMessage.verse;
                                    if (verseSet.has(verse)) {
                                        return false;
                                    } else {
                                        verseSet.add(verse);
                                        return true;
                                    }
                                });
                            })()
                        })
                    }
                });
            } catch (error) {
                Logger.error(error)
                reject(null)
            }
        })
    }

    public async retrievePassage(passageSearch: PassageSearch): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'success' }
        const { userId, passage, searchControl } = passageSearch;
        const { book, chapter, verses, version } = passage;
        verses.sort((a, b) => a - b);
        Logger.info(`Retrieving passage: ${book.name} ${chapter}:${verses.join(',')} [${!!version ? version.code : 'no specified version'}]`);
        const url = `https://www.bible.com/bible/${version.id1}/${book.code}.${chapter}.${version.code}`
        const response = await fetch(url);
        const body = await response.text();
        const passageMessage: PassageMessage | null = await this.parsePassageMessage(body, passage);
        if (!passageMessage) {
            return {
                ...result,
                status: 'error',
                message: 'No passage content found'
            };
        }
        if (passageMessage.verseMessages?.every(v => v.content === '' && v.parts?.length === 0)) {
            return {
                ...result,
                status: 'error',
                message: 'Passage does not exist'
            };
        }
        const { passageLabel, verseMessages } = passageMessage;
        const passageDescription = `${passageLabel} (${version.code})`
        const passageContent: PassageContent = {
            message: verseMessages.map(x => x.content).join(' '),
            passage: {
                version: version,
                book,
                chapter,
                verses,
                description: passageDescription,
                descriptionWithoutVersion: passageLabel,
            },
            parts: verseMessages.map(x => x.parts).flat().filter((part): part is { id: string; className: string; innerText: string } => part !== undefined)
        }
        if (searchControl?.broadcast) broadcast(passageContent)
        const bhpHistory: BhpHistory = {
            userId: userId,
            logDate: new Date(),
            passageContent
        }
        BhpUserFactory.saveHistory(bhpHistory).then((savedBhpHistory) => {
            if (!savedBhpHistory) {
                Logger.error(`Saving history failed for user ${userId} and passage ${passageDescription}`)
            } else {
                Logger.info('Passage search history saved')
            }
        }).catch((error) => {
            Logger.error(error)
            Logger.error(`Saving history failed for user ${userId} and passage ${passageDescription}`)
        })
        return {
            ...result,
            status: 'success',
            data: passageContent,
        }
    }

    public async broadcastPassage(passageContent: PassageContent): Promise<ServiceResult> {
        broadcast(passageContent)
        return {
            status: 'success',
        }
    }

    public async savePassagePreset(bhpPreset: BhpPreset): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'success' }
        return await PromiseUtil.createPromise<ServiceResult>((resolve, reject) => {
            BhpUserFactory.savePreset(bhpPreset).then((savedBhpPreset) => {
                if (!savedBhpPreset) {
                    resolve({
                        ...result,
                        status: 'error',
                        message: 'Saving preset failed'
                    })
                } else {
                    resolve({
                        ...result,
                        status: 'success',
                        data: savedBhpPreset,
                    })
                }
            }).catch((error) => {
                Logger.error(error)
                resolve({
                    ...result,
                    status: 'error',
                    message: 'Saving preset failed'
                })
            })
        })
    }

    public async loadBhpUserData(userId: string): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'success' }
        return await PromiseUtil.createPromise<ServiceResult>((resolve, reject) => {
            BhpUserFactory.loadUser(userId).then((bhpUserInfo) => {
                if (!bhpUserInfo) {
                    resolve({
                        ...result,
                        status: 'error',
                        message: 'Loading bhp user data failed'
                    })
                } else {
                    resolve({
                        ...result,
                        status: 'success',
                        data: bhpUserInfo,
                    })
                }
            }).catch((error) => {
                Logger.error(error)
                resolve({
                    ...result,
                    status: 'error',
                    message: 'Loading bhp user data failed'
                })
            })
        })
    }


}

export default (new BibleSearchService()) as BibleSearchService;