import Image from 'next/image'
import { useRecoilState } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import { Movie } from '../typings'

interface Props {
  movie: Movie
  index: number
}

function KoreanThumbnail({ movie, index }: Props) {
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState)

  const rankImages = [
    '/폭삭.jpg',
    '/악연.jpg',
    '/약한영웅.jpg',
    '/지구마을.webp',
    '/미친맛집.webp',
    '/허식당.webp',
    '/꼬꼬무.webp',
    '/물어보살.webp',
  ]

  return (
    <div
      className="relative h-36 min-w-[260px] cursor-pointer transition duration-200 ease-out"
      onClick={() => {
        setCurrentMovie(movie)
        setShowModal(true)
      }}
    >
      <Image
        src={
          index < rankImages.length
            ? rankImages[index]
            : `https://image.tmdb.org/t/p/w500${
                movie.backdrop_path || movie.poster_path
              }`
        }
        className="rounded object-cover"
        layout="fill"
        alt={movie.title || movie.name}
      />
    </div>
  )
}

export default KoreanThumbnail
