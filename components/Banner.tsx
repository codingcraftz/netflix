import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { baseUrl } from '../constants/movie'
import { Movie } from '../typings'
import { FaPlay } from 'react-icons/fa'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useRecoilState } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'

interface Props {
  netflixOriginals: Movie[]
}

function Banner({ netflixOriginals }: Props) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (netflixOriginals && netflixOriginals.length > 0) {
      setMovie(
        netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)]
      )
    }
  }, [netflixOriginals])

  const handlePlay = () => {
    setIsPlaying(true)
    setTimeout(() => {
      if (videoRef.current) {
        try {
          videoRef.current.play()
          if (document.fullscreenEnabled) {
            videoRef.current.requestFullscreen()
          }
        } catch (err) {
          console.error('비디오 재생 실패:', err)
        }
      }
    }, 100)
  }

  return (
    <div className="relative flex flex-col space-y-4 justify-end pb-12 h-[75vh] w-screen">
      {isPlaying && (
        <div className="fixed inset-0 bg-black z-[9999]">
          <video
            ref={videoRef}
            src="/test.mp4"
            className="w-full h-full object-contain"
            controls
            playsInline={false}
            x-webkit-airplay="allow"
            preload="auto"
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      )}
      <div className="absolute top-0 left-0 -z-10 h-screen w-screen">
        <Image
          src="/main_image.webp"
          layout="fill"
          objectFit="cover"
          objectPosition="center top"
          alt="메인 배너 이미지"
        />
        <div className="absolute bottom-0 w-full h-96 bg-gradient-to-t from-[#141414] to-transparent"></div>
      </div>

      <div className="relative w-[50%] h-36 mt-96 ml-16">
        <Image
          src="/main_title.webp"
          layout="fill"
          objectFit="contain"
          className="object-left"
          alt="메인 타이틀"
        />
      </div>

      <div className="flex space-x-3 pl-16 pt-8">
        <button
          className="bannerButton bg-white text-black"
          onClick={handlePlay}
        >
          <FaPlay className="h-4 w-4 text-black" /> 재생
        </button>
        <button
          className="bannerButton bg-[gray]/70"
          onClick={() => {
            setCurrentMovie(movie)
            setShowModal(true)
          }}
        >
          상세정보 <InformationCircleIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default Banner
