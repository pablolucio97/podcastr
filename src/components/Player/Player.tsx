import React, { useRef, useEffect } from 'react'
import { useContext } from 'react'
import { PlayerContext } from '../../context/PlayerContext'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import styles from './styles.module.scss'
import formatTime from '../../utils/formatTime'
import { useState } from 'react'


export default function Player() {
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress ] = useState(0)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    handlePlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffling,
    toggleLoop,
    toggleShuffle,
    clearPlayState
  } = useContext(PlayerContext)

  const episode = episodeList[currentEpisodeIndex]


  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }

  }, [isPlaying])

  function updateProgressListener(){
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleChange(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount)
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext()
    }else{
      clearPlayState()
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="playing now" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={192}
            height={92}
            src={episode.thumbnail}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <strong>{episode.members}</strong>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{formatTime(progress)}</span>
          <div className={styles.slider} />
          {episode ? (
            <Slider
              trackStyle={{ backgroundColor: '#04d361' }}
              railStyle={{ backgroundColor: '#9f75ff' }}
              handleStyle={{ borderColor: '#04d361' }}
              max={episode.duration}
              value={progress}
              onChange={handleChange}
            />
          ) : (
            <div className={styles.emptySlider}></div>
          )}
          <span>{formatTime(episode?.duration ?? 0)}</span>
        </div>

        {
          episode &&
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            ref={audioRef}
            onPlay={() => handlePlayingState}
            onLoadedMetadata={updateProgressListener}
          />
        }


        <div className={styles.buttons}>

          <button
            type='button'
            disabled={!episode || episodeList.length === 1}><img
              src="/shuffle.svg"
              alt="btn-shuffle"
              onClick={() => toggleShuffle}
              className={isShuffling? styles.isActive : ''}
            /></button>

          <button
            type='button'
            disabled={!episode || !hasPrevious}><img
              src="/play-previous.svg"
              alt="btn-previuos"
              onClick={() => playPrevious()}
            /></button>

          <button
            type='button'
            disabled={!episode || !hasNext}
            className={styles.playButton}
            onClick={() => togglePlay()}>
            {isPlaying ? (
              <img src='/pause.svg' alt="btn-play" />

            ) : (
              <img src='/play.svg' alt="btn-play" />
            )}
          </button>
          <button
            type='button'
            disabled={!episode}><img
              src="/play-next.svg"
              alt="btn-next"
              onClick={() => playNext()}
            /></button>
         <button
            type='button'
            disabled={!episode}><img
            src="/repeat.svg"
            alt="btn-repeat"
            onClick={() => toggleLoop}
            className={isLooping? styles.isInLoop : ''}
            /></button>
        </div>
      </footer>
    </div>
  )
}
function clearPlayState() {
  throw new Error('Function not implemented.')
}

