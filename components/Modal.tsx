import {
  PlusIcon,
  HandThumbUpIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { SpeakerWaveIcon } from '@heroicons/react/24/solid'
import MuiModal from '@mui/material/Modal'
import { useEffect, useState, useRef } from 'react'
import { FaPlay } from 'react-icons/fa'
import ReactPlayer from 'react-player/lazy'
import { useRecoilState } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import { Element, Genre } from '../typings'
import Image from 'next/image'

function Modal() {
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [movie, setMovie] = useRecoilState(movieState)
  const [trailer, setTrailer] = useState('')
  const [genres, setGenres] = useState<Genre[]>([])
  const [muted, setMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!movie) return

    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      )
        .then((response) => response.json())
        .catch((err) => console.log(err.message))

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === 'Trailer'
        )
        setTrailer(data.videos?.results[index]?.key)
      }
      if (data?.genres) {
        setGenres(data.genres)
      }
    }

    fetchMovie()
  }, [movie])

  const handleClose = () => {
    setShowModal(false)
    setIsPlaying(false)
  }

  const handlePlay = () => {
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error('비디오 재생 실패:', err)
      })
    }
  }

  console.log(trailer)

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
    >
      <>
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

        <button
          onClick={handleClose}
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="relative pt-[56.25%]">
          <Image
            src="/폭삭_main.webp"
            layout="fill"
            className="object-cover"
            alt="폭삭 메인 이미지"
          />

          <div className="absolute bottom-0 w-full h-96 bg-gradient-to-t from-[#141414] to-transparent"></div>

          <div className="absolute top-[50%] left-10 w-[40%]">
            <div className="relative w-full h-24 md:h-36 mb-5">
              <Image
                src="/폭삭_title.webp"
                layout="fill"
                objectFit="contain"
                className="object-left"
                alt="폭삭 타이틀"
              />
            </div>

            <div className="flex items-center w-22 mt-3 mb-4">
              <div className="bg-[#555] h-[3px] w-full rounded-full">
                <div className="bg-red-600 h-[3px] w-[60%] rounded-full"></div>
              </div>
              <p className="text-gray-400 text-sm ml-3 whitespace-nowrap">
                총 57분 중 34분
              </p>
            </div>

            <div className="flex space-x-3 mt-2">
              <button
                className="flex items-center gap-x-2 rounded bg-white px-5 py-1.5 text-sm font-bold text-black transition hover:bg-[#e6e6e6]"
                onClick={handlePlay}
              >
                <FaPlay className="h-4 w-4 text-black" /> 재생
              </button>

              <button className="modalButton border border-gray-500 bg-transparent rounded-full p-2">
                <PlusIcon className="h-5 w-5" />
              </button>

              <button className="modalButton border border-gray-500 bg-transparent rounded-full p-2">
                <HandThumbUpIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg w-full">
            <div className="flex flex-row space-x-10">
              <div className="w-2/3">
                <div className="flex items-center space-x-2 text-base mb-2">
                  <p className="font-light text-[#bcbcbc]">
                    2025 리미티드 시리즈
                  </p>
                  <div className="flex h-4 items-center justify-center rounded border border-[#bcbcbc] px-1.5 text-[10px] bg-transparent text-[#bcbcbc]">
                    HD
                  </div>
                  <div className="text-[#bcbcbc] ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      role="img"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      data-icon="AudioDescriptionStandard"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21.9782 7.52002H22.2621C23.37 8.81831 24.0001 10.4801 24.0001 12.2077C24.0001 13.7414 23.505 15.2301 22.6221 16.4453H22.3348H21.8501H21.5662C22.5598 15.2613 23.1207 13.7691 23.1207 12.2077C23.1207 10.449 22.404 8.75599 21.1611 7.52002H21.445H21.9782ZM6.91381 16.4796H8.87336V7.52661H6.42566L0 16.4796H2.87701L3.63174 15.2956H6.91381V16.4796ZM4.8625 13.4299H6.92592V10.224L4.8625 13.4299ZM12.3019 9.62283C13.621 9.62283 14.6839 10.6926 14.6839 12.0048C14.6839 13.3203 13.621 14.3901 12.3019 14.3901H11.6787V9.62283H12.3019ZM12.5443 16.4743C15.0128 16.4743 17.0208 14.4698 17.0208 12.0048C17.0208 9.52935 15.0335 7.52826 12.565 7.52826H12.5373H9.79883V16.4778H12.5443V16.4743ZM20.0103 7.52002H19.7264H19.1932H18.9093C20.1522 8.75599 20.8689 10.449 20.8689 12.2077C20.8689 13.7691 20.308 15.2613 19.3144 16.4453H19.5983H20.083H20.3634C21.2531 15.2301 21.7482 13.7414 21.7482 12.2077C21.7482 10.4801 21.1181 8.81831 20.0103 7.52002ZM17.4745 7.52002H17.7584C18.8663 8.81831 19.4895 10.4801 19.4895 12.2077C19.4895 13.7414 19.0013 15.2301 18.1116 16.4453H17.8277H17.3464H17.0625C18.0492 15.2613 18.6101 13.7691 18.6101 12.2077C18.6101 10.449 17.9004 8.75599 16.6575 7.52002H16.9344H17.4745Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="text-[#bcbcbc]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      role="img"
                      viewBox="0 0 16 16"
                      width={20}
                      height={20}
                      data-icon="SubtitlesSmall"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 1.75C0 1.33579 0.335786 1 0.75 1H15.25C15.6642 1 16 1.33579 16 1.75V12.25C16 12.6642 15.6642 13 15.25 13H12.75V15C12.75 15.2652 12.61 15.5106 12.3817 15.6456C12.1535 15.7806 11.8709 15.785 11.6386 15.6572L6.80736 13H0.75C0.335786 13 0 12.6642 0 12.25V1.75ZM1.5 2.5V11.5H7H7.19264L7.36144 11.5928L11.25 13.7315V12.25V11.5H12H14.5V2.5H1.5ZM6 6.5L3 6.5V5L6 5V6.5ZM13 7.5H10V9H13V7.5ZM3 9V7.5L9 7.5V9L3 9ZM13 5H7V6.5H13V5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>

                {/* 연령 등급 SVG 아이콘들 */}
                <div className="flex space-x-2 mb-2">
                  <span className="maturity-graphic">
                    <svg
                      id="maturity-rating-976"
                      viewBox="0 0 100 100"
                      className="svg-icon h-6 w-6"
                    >
                      <path
                        id="Fill---Yellow"
                        fill="#DFB039"
                        d="M88.724 100h-77.45C5.049 100 0 94.954 0 88.728V11.274C0 5.048 5.048 0 11.275 0h77.449C94.949 0 100 5.048 100 11.274v77.454C100 94.954 94.95 100 88.724 100"
                      ></path>
                      <path
                        id="path12"
                        fill="#000"
                        d="M36.92 15.484v68.647H21.553V34.62h-5.48l7.097-19.136h13.75zm44.288 0c.848 0 1.535.687 1.535 1.533v18.144c0 1.018-.044 1.885-.133 2.605a8.067 8.067 0 01-.493 1.975 14.48 14.48 0 01-.9 1.843c-.362.631-.84 1.363-1.44 2.204L60.643 70.653h21.923v13.394H41.59v-10.07l26.152-37.29V28.42H57.136v9.345H42.127V17.017c0-.846.687-1.533 1.534-1.533z"
                      ></path>
                    </svg>
                  </span>

                  <span className="maturity-graphic">
                    <svg
                      id="maturity-advisory-8751"
                      viewBox="0 0 100 100"
                      className="svg-icon h-6 w-6"
                    >
                      <path
                        id="FIll---Black"
                        fill="#000"
                        d="M88.726 100H11.274C5.05 100 0 94.957 0 88.725v-77.45C0 5.052 5.05 0 11.274 0h77.452C94.956 0 100 5.051 100 11.276v77.449C100 94.957 94.955 100 88.726 100"
                      ></path>
                      <path
                        id="icon"
                        fill="#FFFFFE"
                        d="M80.034 43.774c.206.42.414.848.624 1.28l.314.648.157.324.312.648c1.397 2.908 2.667 5.653 2.96 6.592.592 1.91 1.043 5.02-1.883 10.007-3 5.108-6.553 6.458-8.011 6.458h-10.68c-4.826 0-6.255-2.623-6.678-4.058 3.704-.259 5.904-1.467 6.899-2.175 1.216.781 4.132 2.11 9.011 1.147 5.671-1.114 7.011-6.208 6.946-8.956.015-.22.03-.435.03-.654zM56.28 27.544c4.53 0 6.914 3.442 7.379 4.188l.054.09.028.046a.938.938 0 00.75.473c.337-.011.615-.129.799-.383 1.425-1.983 4.069-2.195 4.99-2.208h.152c.108 0 .17.004.174.003l.065.002c1.777 0 3.227.556 4.302 1.664 1.745 1.8 2.167 4.62 2.268 6.056l.003 17.998c-.153 2.618-1.695 6.537-6.796 6.537-2.762 0-4.246-.594-5.008-1.09l-.2-.361V39.361c0-.419-.183-.821-.506-1.094a1.454 1.454 0 00-1.171-.318c-.695.116-1.197.724-1.197 1.448v21.318l-.14.318c-.992.816-2.748 1.787-5.48 1.787-2.725 0-4.232-.88-5.017-1.624l-.14-.318V40.84a1.443 1.443 0 00-1.437-1.437l-.242.02a1.449 1.449 0 00-1.192 1.446v20.318l-.134.31c-.724.607-2.052 1.323-4.263 1.323-2.59 0-4.196-1.044-5.087-1.923l-.115-.297V43.714c0-.426-.186-.823-.516-1.101a1.41 1.41 0 00-1.156-.316c-.686.11-1.197.732-1.197 1.443v16.769l-.224.372c-1.716.984-3.632.838-3.732.833-5.303 0-5.636-5.6-5.647-5.793v-15.67c0-3.173 3.805-5.191 5.794-5.191 2.042 0 2.905.382 2.905.382a.892.892 0 00.706.05.92.92 0 00.537-.463c.019-.037 1.924-3.794 5.85-4.266 3.834-.44 5.207 1.398 5.254 1.466a.937.937 0 00.848.397.894.894 0 00.756-.547c.022-.042 2.036-4.534 6.983-4.534zM39.531 6.777l4.541 10.617 9.244-6.922-1.377 11.465 11.465-1.377-3.604 4.807a10.95 10.95 0 00-3.52-.584c-4.276 0-6.905 2.388-8.287 4.203-1.352-.742-3.315-1.27-5.88-.961-3.722.443-6.052 2.896-7.183 4.462a14.683 14.683 0 00-2.49-.192c-3.404 0-8.551 3.176-8.551 7.953v6.89l-8.233.985 6.929-9.238-10.623-4.545 10.623-4.54-6.929-9.24 11.468 1.377-1.376-11.465 9.242 6.922 4.54-10.617z"
                      ></path>
                      <path
                        id="type"
                        fill="#FFFFFE"
                        d="M56.403 88.078v4.617h-1.88v-2.937h-8.667v-1.68h10.547zm-14.57-.17v4.497h-1.865v-2.937h-8.416v-1.56h10.282zm22.624-.714c1.942 0 3.282.19 4.102.578.85.4 1.28 1.049 1.28 1.929 0 .886-.427 1.537-1.269 1.934-.813.38-2.195.574-4.113.574-1.927 0-3.316-.196-4.13-.58-.85-.401-1.28-1.05-1.28-1.928 0-.892.427-1.54 1.266-1.935.805-.386 2.163-.572 4.144-.572zm0 1.59c-1.44 0-2.425.086-2.93.253-.466.149-.692.366-.692.664 0 .297.233.516.702.662.524.17 1.505.254 2.92.254 1.419 0 2.394-.084 2.903-.254.466-.146.691-.363.691-.662 0-.298-.23-.512-.694-.664-.514-.167-1.487-.252-2.9-.252zm-8.054-9.576v8.57h-1.88V85.44h-2.96v-1.668h2.96v-1.18h-2.96v-1.648h2.96v-1.735h1.88zm-5.158.732v4.28H46.53v1.833a37.375 37.375 0 002.561-.127 30.42 30.42 0 002.796-.342l.168-.03.157 1.594-.143.024c-.716.112-1.932.244-3.514.379-1.623.14-2.87.215-3.705.215h-.155V82.6h4.73v-.993H44.71V79.94h6.534zm18.515-.808v8.39h-1.886V83.81H64.16v-1.666h3.714v-3.012h1.886zm-8.333.564c.268 0 .443.02.55.064a.339.339 0 01.224.329c0 .021-.008.091-.033.207a1.26 1.26 0 00-.03.231c0 .842.162 1.644.481 2.378a6.854 6.854 0 001.134 1.758c.322.375.762.803 1.317 1.274l.15.129-1.547 1.007-.094-.074a9.112 9.112 0 01-1.256-1.27 8.753 8.753 0 01-1.097-1.72 8.99 8.99 0 01-1.036 1.778c-.39.526-.831 1.027-1.318 1.496l-.086.079-1.561-.837.14-.138c.522-.513.967-1.014 1.317-1.487.5-.69.885-1.409 1.155-2.142.331-.91.5-1.891.5-2.913v-.149zm-19.311.182v1.592H40.25l-.08 1.877h1.82v1.589h-4.254v.782h5.97v1.588H29.774v-1.588h6.112v-.782h-4.413v-1.59h1.809l-.204-1.876h-1.796v-1.592h10.834zm-3.653 1.592h-3.598l.218 1.877h3.287l.093-1.877z"
                      ></path>
                    </svg>
                  </span>

                  <span className="maturity-graphic">
                    <svg
                      id="maturity-advisory-8786"
                      viewBox="0 0 100 100"
                      className="svg-icon h-6 w-6"
                    >
                      <path
                        id="FIll---Black"
                        fill="#000"
                        d="M88.729 100h-77.46C5.044 100 0 94.955 0 88.723v-77.45C0 5.05 5.044 0 11.269 0h77.46C94.958 0 100 5.05 100 11.273v77.45C100 94.955 94.958 100 88.729 100"
                      ></path>
                      <path
                        id="icon"
                        fill="#FFFFFE"
                        d="M74.21 47.67c3.437-4.279 5.495-9.563 5.495-15.306 0-14.205-12.428-25.718-27.76-25.718-13.074 0-24.006 8.38-26.954 19.65l-.028.01-4.59 18.54c-.238.956.533 1.87 1.59 1.898l4.65.11v9.286c-.004 2.075 1.796 3.757 4.035 3.794l5.373.059c1.337.02 2.459.932 2.653 2.158v5.867s0 5.424 15.281 5.424c14.529 0 15.327-5.424 15.327-5.424s-.354-13.119 4.95-20.322l-.021-.026zM52.06 63.037c-1.84 0-3.328-1.38-3.328-3.087 0-1.709 1.488-3.09 3.328-3.09 1.842 0 3.336 1.381 3.336 3.09 0 1.706-1.494 3.087-3.336 3.087zM66.47 36.22c-1.017 1.86-2.625 3.534-4.772 4.976-2.067 1.386-6.875 5.11-6.875 9.668 0 1.417-1.233 2.56-2.762 2.56-1.523 0-2.759-1.143-2.759-2.56 0-6.665 5.74-11.51 9.157-13.808 1.43-.965 2.473-2.025 3.091-3.15a9.246 9.246 0 001.096-5.379c-.443-4.548-4.466-8.355-9.36-8.853-3.075-.326-6.025.55-8.308 2.443-2.25 1.867-3.543 4.542-3.543 7.34 0 1.41-1.233 2.555-2.76 2.555-1.524 0-2.76-1.144-2.76-2.555 0-4.248 1.963-8.316 5.38-11.147 3.41-2.837 8.004-4.2 12.597-3.724 7.571.774 13.564 6.443 14.252 13.474a14.003 14.003 0 01-1.674 8.16z"
                      ></path>
                      <path
                        id="type"
                        fill="#FFFFFE"
                        d="M63.222 79.132v13.286h-1.819V79.132h1.819zm-12.897 6.526v1.587H44.4v5.083h-1.847v-5.083h-6.16v-1.587h13.932zm10.26-6.011v11.571h-1.74v-5.704h-1.784v-1.667h1.784v-4.2h1.74zm-2.682.398v1.667h-2.031c.016 1.408.287 2.774.799 4.056a9.873 9.873 0 001.83 2.998l.14.158-.2.077c-.251.098-.492.218-.71.365a5.128 5.128 0 00-.636.513l-.127.126-.108-.143a12.661 12.661 0 01-1.174-1.893 13.47 13.47 0 01-.787-1.92 11.105 11.105 0 01-.955 1.942c-.48.77-1.014 1.423-1.583 1.939l-.113.102-.246-.25-.264-.272-.075-.074-.024-.022a3.988 3.988 0 00-.657-.471l-.176-.107.158-.13c.813-.68 1.521-1.625 2.103-2.81.663-1.357 1.01-2.763 1.031-4.184h-2.443v-1.667h6.248zm-9.293-.227v1.633h-4.12c.197.4.806.81 1.784 1.19 1.074.419 2.224.685 3.418.797l.313.03-.217.219c-.434.446-.729.885-.87 1.298l-.04.118-.128-.017a10.926 10.926 0 01-2.833-.772c-1.058-.445-1.872-.975-2.423-1.587-.52.493-1.3.936-2.332 1.316a14.01 14.01 0 01-3.197.755l-.128.013-.039-.116c-.1-.304-.375-.73-.815-1.262l-.199-.242h.318c1.154 0 2.334-.21 3.511-.621.99-.344 1.62-.72 1.88-1.119h-4.355v-1.633H48.61z"
                      ></path>
                    </svg>
                  </span>

                  <span className="maturity-graphic">
                    <svg
                      id="maturity-advisory-8752"
                      viewBox="0 0 100 100"
                      className="svg-icon h-6 w-6"
                    >
                      <path
                        id="FIll---Black"
                        fill="#000"
                        d="M88.724 100h-77.45C5.047 100 0 94.954 0 88.728V11.276C0 5.05 5.048 0 11.273 0h77.45C94.954 0 100 5.051 100 11.276v77.452C100 94.954 94.952 100 88.724 100"
                      ></path>
                      <path
                        id="icon"
                        fill="#FFFFFE"
                        d="M49.808 10.543c-19.045 0-34.485 10.838-34.485 24.204 0 11.132 10.7 20.501 25.274 23.332.931.18 1.617.955 1.612 1.886l-.003 1.88c-.47 3.867-4.263 8.43-7.383 10.364 0 0 14.712-1.009 20.864-12.359.48-.873 1.382-1.427 2.378-1.598C73.123 55.66 84.294 46.12 84.294 34.747c0-13.366-15.442-24.204-34.486-24.204M33.296 37.809c-1.674 0-3.024-1.324-3.024-2.965 0-1.636 1.35-2.962 3.024-2.962 1.67 0 3.023 1.326 3.023 2.962 0 1.64-1.354 2.965-3.023 2.965m16.512 0c-1.67 0-3.025-1.324-3.025-2.965 0-1.636 1.355-2.962 3.025-2.962s3.024 1.326 3.024 2.962c0 1.64-1.355 2.965-3.024 2.965m16.511 0c-1.67 0-3.02-1.324-3.02-2.965 0-1.636 1.35-2.962 3.02-2.962 1.674 0 3.024 1.326 3.024 2.962 0 1.64-1.35 2.965-3.024 2.965"
                      ></path>
                      <path
                        id="type"
                        fill="#FFFFFE"
                        d="M47.638 79.179v13.288h-1.79v-6.116h-1.103v5.019h-1.752v-2.994l-.262.095a30.41 30.41 0 01-2.91.698l-.535.1c-1.247.224-2.233.339-2.93.339h-.158v-8.741h5.358v1.649h-3.539v5.326c.675-.085 1.308-.18 1.882-.28.88-.161 1.773-.364 2.65-.607l.444-.153V79.77h1.752v4.9h1.104v-5.49h1.789zm13.416-.047V84.9h2.368v1.664h-2.368v5.855h-1.88V79.132h1.88zm-7.567.882c.272 0 .452.027.563.076.146.062.225.174.225.318 0 .028-.003.082-.043.244a1.598 1.598 0 00-.036.194c0 1.358.197 2.622.581 3.756.312.937.76 1.825 1.332 2.643.283.399.803 1.03 1.545 1.874l.11.125-1.566 1.013-.092-.086c-.523-.501-1.064-1.197-1.61-2.069-.489-.78-.898-1.568-1.216-2.346-.256.778-.6 1.556-1.022 2.317-.498.902-1.021 1.637-1.548 2.184l-.089.091-1.54-.965.114-.127a12.08 12.08 0 002.303-3.82c.596-1.58.896-3.354.896-5.272v-.15z"
                      ></path>
                    </svg>
                  </span>
                </div>

                {/* 넷플릭스 순위 표시 */}
                <div className="supplemental-message previewModal--supplemental-message mb-6">
                  <svg
                    viewBox="0 0 28 30"
                    className="svg-icon svg-icon-top-10-badge h-7 w-7 inline-block mr-2"
                  >
                    <rect
                      x="0"
                      width="28"
                      height="30"
                      rx="3"
                      fill="#e50914"
                    ></rect>
                    <text
                      x="14"
                      y="10"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      TOP
                    </text>
                    <path
                      d="M16.8211527,22.1690594 C17.4133103,22.1690594 17.8777709,21.8857503 18.2145345,21.3197261 C18.5512982,20.7531079 18.719977,19.9572291 18.719977,18.9309018 C18.719977,17.9045745 18.5512982,17.1081018 18.2145345,16.5414836 C17.8777709,15.9754594 17.4133103,15.6921503 16.8211527,15.6921503 C16.2289952,15.6921503 15.7645345,15.9754594 15.427177,16.5414836 C15.0904133,17.1081018 14.9223285,17.9045745 14.9223285,18.9309018 C14.9223285,19.9572291 15.0904133,20.7531079 15.427177,21.3197261 C15.7645345,21.8857503 16.2289952,22.1690594 16.8211527,22.1690594 M16.8211527,24.0708533 C15.9872618,24.0708533 15.2579042,23.8605988 14.6324861,23.4406836 C14.0076618,23.0207685 13.5247891,22.4262352 13.1856497,21.6564897 C12.8465103,20.8867442 12.6766436,19.9786109 12.6766436,18.9309018 C12.6766436,17.8921018 12.8465103,16.9857503 13.1856497,16.2118473 C13.5247891,15.4379442 14.0076618,14.8410352 14.6324861,14.4205261 C15.2579042,14.0006109 15.9872618,13.7903564 16.8211527,13.7903564 C17.6544497,13.7903564 18.3844012,14.0006109 19.0098194,14.4205261 C19.6352376,14.8410352 20.1169224,15.4379442 20.4566558,16.2118473 C20.7952012,16.9857503 20.9656618,17.8921018 20.9656618,18.9309018 C20.9656618,19.9786109 20.7952012,20.8867442 20.4566558,21.6564897 C20.1169224,22.4262352 19.6352376,23.0207685 19.0098194,23.4406836 C18.3844012,23.8605988 17.6544497,24.0708533 16.8211527,24.0708533"
                      fill="#FFFFFF"
                    ></path>
                    <polygon
                      fill="#FFFFFF"
                      points="8.86676 23.9094206 8.86676 16.6651418 6.88122061 17.1783055 6.88122061 14.9266812 11.0750267 13.8558085 11.0750267 23.9094206"
                    ></polygon>
                  </svg>
                  <span className="text-white">오늘 시리즈 순위 1위</span>
                </div>

                {/* 에피소드 정보 및 줄거리 */}
                <div className="mb-6">
                  <div className="previewModal-episodeDetails mb-2">
                    <b>시즌 1: 1화</b> "호로록 봄"
                  </div>
                  <div className="ptrack-content text-sm text-[#dfdfdf]">
                    억척스러운 어머니 아래서 야무지고 똘똘하게 자라난 애순. 그
                    작은 마음속에 헤아릴 수 없도록 많은 꿈을 품고 산다. 하지만
                    자꾸 서러운 일들이 닥치며 어린 애순을 힘들게 한다.
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 text-sm w-1/3">
                <div className="whitespace-nowrap">
                  <span className="text-[#bcbcbc]">출연: </span>
                  <span className="text-[#ffffff]">
                    아이유, 박보검, 문소리, <i>더보기</i>
                  </span>
                </div>

                <div className="whitespace-nowrap">
                  <span className="text-[#bcbcbc]">장르: </span>
                  <span className="text-[#ffffff]">
                    로맨틱한 드라마, 드라마, 한국드라마
                  </span>
                </div>

                <div className="whitespace-nowrap">
                  <span className="text-[#bcbcbc]">시리즈 특징: </span>
                  <span className="text-[#ffffff]">
                    향수 자극, 달콤 쌉싸름, 감정을 파고드는
                  </span>
                </div>
              </div>
            </div>

            {/* 회차 섹션 - 전체 너비로 배치 */}
            <div className="w-full mt-8 px-2">
              <div className="episodeSelector-header flex justify-between items-center mb-4 px-2">
                <div className="ltr-1fttcpj">
                  <h3 className="previewModal--section-header episodeSelector-label show-single-season text-xl font-semibold">
                    회차
                  </h3>
                </div>
                <div className="episodeSelector-season-name text-sm text-[#bcbcbc]">
                  리미티드 시리즈
                </div>
              </div>

              {/* 에피소드 목록 */}
              <div className="episodeSelector-container px-2">
                <div className="flex items-center p-3 mb-4 bg-[#333333] rounded-md cursor-pointer px-12 py-6">
                  <div className="titleCard-title_index text-lg mr-8 font-semibold">
                    1
                  </div>
                  <div className="w-40 h-24 relative mr-4">
                    <img
                      src="https://occ-0-4284-395.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABWTnqYkRomlIviiMVdqcknvQF43OeYs1PQLUQfZD7iwt_Kokcjn7bPDwOW9i1gTWlubm2c4YxSeHG98Kg64AXb4rXe6elcIOjA4yyqRrZRPmXKqVTF8gwV-q.jpg?r=543"
                      alt="호로록 봄"
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                            fill="white"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                      <span className="font-sm">호로록 봄</span>
                      <span className="text-sm">57분</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      억척스러운 어머니 아래서 야무지고 똘똘하게 자라난 애순. 그
                      작은 마음속에 헤아릴 수 없도록 많은 꿈을 품고 산다.
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 mb-4 hover:bg-[#333] rounded-md cursor-pointer">
                  <div className="titleCard-title_index text-lg mr-4 font-semibold">
                    2
                  </div>
                  <div className="w-40 h-24 relative mr-4">
                    <img
                      src="https://occ-0-4284-395.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABcpQy44E5LW5_7_EAnCj99PIDKoRaRflKk1IzIEhEFwzUWMouI7JQcBKmbNrvYlqkoNshemWPFWq4CYl5fVYqjmymL7w-CXh4XNxUY35qTlAF1L9DwXkZZbm.jpg?r=8d2"
                      alt="요망진 첫사랑"
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                            fill="white"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">요망진 첫사랑</span>
                      <span className="text-sm text-gray-400">54분</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      애순과 관식 사이에 유채꽃처럼 환한 사랑이 피어난다. 인생은
                      낙장불입, 굳게 마음먹고 사랑의 모험을 감행하는 두 청춘.
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 mb-4 hover:bg-[#333] rounded-md cursor-pointer">
                  <div className="titleCard-title_index text-lg mr-4 font-semibold">
                    3
                  </div>
                  <div className="w-40 h-24 relative mr-4">
                    <img
                      src="https://occ-0-4284-395.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABYR42MXeTutllAeC8XiBA9VlsSlReadWYD3ZOq_bmIC3mruZDHKGuzQlvDgSV5cZNZ5-j1gR1IVU4g1N5dRg6KweHQ0qjuDF4gukuvJcHjP5k8nhA6m4Zjwb.jpg?r=665"
                      alt='예스터데이. "그들의 봄은..."'
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                            fill="white"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        예스터데이. "그들의 봄은..."
                      </span>
                      <span className="text-sm text-gray-400">63분</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      떠들썩한 소동 끝에 제주로 돌아온 애순과 관식. 마음대로
                      되는 게 하나 없는 애순은 말도 안 되는 운명에 자신을
                      내맡기려 한다.
                    </p>
                  </div>
                </div>

                <button className="w-full py-3 text-center border border-gray-600 rounded-md hover:bg-[#333] text-gray-400 mt-6 mb-4">
                  더보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  )
}

export default Modal
