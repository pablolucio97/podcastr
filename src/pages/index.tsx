import { useContext } from 'react'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import api from '../services/api'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import formatTime from '../utils/formatTime'
import Link from 'next/link'
import Head from 'next/head'
import styles from './home.module.scss'
import { PlayerContext } from '../context/PlayerContext'

type Episode = {
  id: string,
  title: string,
  members: string,
  description: string,
  thumbnail: string,
  duration: number;
  durationAsString: string,
  publishedAt: string,
  url: string
}

type HomeProps = {
  allEpisodes: Episode[],
  lastEpisodes: Episode[]
}

export default function Home({ lastEpisodes, allEpisodes }: HomeProps) {

  const { playList } = useContext(PlayerContext)

  const episodesLists = [...lastEpisodes, ...allEpisodes];


  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.lastEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {lastEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit='cover'
              />
              <div className={styles.episodeDetails}>
                <Link href={episode.url} >
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
                <button type='button' onClick={() => playList(episodesLists, index)}>
                  <img src='/play-green.svg' alt="Tocar episódio" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        <table
          cellSpacing={0}
        >
          <thead>
            <tr>
              <td></td>
              <td>Podcasts</td>
              <td>Integrantes</td>
              <td>Data</td>
              <td>Duração</td>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit='cover'
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button 
                  type='button'
                   onClick={() => playList(episodesLists, index + lastEpisodes.length)}
                  >
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: formatTime(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  const lastEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      lastEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}