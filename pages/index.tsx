import Head from 'next/head'
import { useRecoilValue } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Modal from '../components/Modal'
import Row from '../components/Row'
import KoreanRow from '../components/KoreanRow'
import useAuth from '../hooks/useAuth'
import { Movie } from '../typings'
import requests from '../utils/requests'

interface Props {
  netflixOriginals: Movie[]
  trendingNow: Movie[]
  topRated: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaries: Movie[]
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
}: Props) => {
  const { loading } = useAuth()
  const showModal = useRecoilValue(modalState)

  if (loading) return null

  return (
    <div
      className={`relative h-screen bg-gradient-to-t from-transparent via-transparent to-black/60 ${
        showModal && '!h-screen overflow-hidden'
      }`}
    >
      <Head>
        <title>넷플릭스</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="relative pb-24 space-y-24">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="space-y-24 flex flex-col pl-16">
          <KoreanRow title="지금 뜨는 콘텐츠" movies={trendingNow} />
          <Row title="오늘 대한민국의 TOP 10 시리즈" movies={topRated} />
          <Row title="액션 스릴러" movies={actionMovies} />
          {/* My List Component */}
          <Row title="코미디" movies={comedyMovies} />
          <Row title="공포 영화" movies={horrorMovies} />
          <Row title="로맨스 영화" movies={romanceMovies} />
          <Row title="다큐멘터리" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  try {
    const [
      netflixOriginals,
      trendingNow,
      topRated,
      actionMovies,
      comedyMovies,
      horrorMovies,
      romanceMovies,
      documentaries,
    ] = await Promise.all([
      fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
      fetch(requests.fetchTrending).then((res) => res.json()),
      fetch(requests.fetchTopRated).then((res) => res.json()),
      fetch(requests.fetchActionMovies).then((res) => res.json()),
      fetch(requests.fetchComedyMovies).then((res) => res.json()),
      fetch(requests.fetchHorrorMovies).then((res) => res.json()),
      fetch(requests.fetchRomanceMovies).then((res) => res.json()),
      fetch(requests.fetchDocumentaries).then((res) => res.json()),
    ])

    return {
      props: {
        netflixOriginals: netflixOriginals.results || [],
        trendingNow: trendingNow.results || [],
        topRated: topRated.results || [],
        actionMovies: actionMovies.results || [],
        comedyMovies: comedyMovies.results || [],
        horrorMovies: horrorMovies.results || [],
        romanceMovies: romanceMovies.results || [],
        documentaries: documentaries.results || [],
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        netflixOriginals: [],
        trendingNow: [],
        topRated: [],
        actionMovies: [],
        comedyMovies: [],
        horrorMovies: [],
        romanceMovies: [],
        documentaries: [],
      },
    }
  }
}
