import { useState } from 'react';
import { createContext } from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number;
    isPlaying: boolean;
    playingState: boolean;
    togglePlay: () => void;
    play: (episode: Episode) => void;
    playNext: () => void;
    playPrevious: () => void;
    playList: (list: Episode[], index: number) => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayState: () => void;
    handlePlayingState: (playingCurrentState: boolean) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling;
}

type PlayerProviderProps = {
    children: React.ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerProviderProps) {

    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setisPlaying] = useState(false)
    const [playingState, setPlayingState] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0)
        setisPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setisPlaying(true)
    }

    function togglePlay() {
        setisPlaying(!isPlaying)
    }

    function handlePlayingState(playingCurrentState: boolean) {
        setPlayingState(playingCurrentState)
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    function playNext() {
        if(isShuffling){
          const nextEpisode = Math.random()  * episodeList.length
          setCurrentEpisodeIndex(nextEpisode)
        }

        if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }

    }

    function playPrevious() {

        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    function toggleLoop() {
        setIsLooping(!isLooping)

    }
    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function clearPlayState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0)
    }

    return (
        <PlayerContext.Provider value={{
            play,
            episodeList,
            currentEpisodeIndex,
            playingState,
            handlePlayingState,
            isPlaying,
            togglePlay,
            playNext,
            playPrevious,
            playList,
            hasNext,
            clearPlayState,
            hasPrevious,
            isLooping,
            toggleLoop,
            isShuffling,
            toggleShuffle
        }}>
            {children}
        </PlayerContext.Provider>
    )

}