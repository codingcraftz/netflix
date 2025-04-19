import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Script from 'next/script'

// Vimeo Player API에 대한 타입 정의
declare global {
  interface Window {
    Vimeo?: {
      Player: any
    }
  }
}

export default function VideoPlayer() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLIFrameElement>(null)
  const [playerReady, setPlayerReady] = useState(false)

  useEffect(() => {
    // Vimeo Player SDK 초기화
    let player: any = null

    // 플레이어가 준비되고 SDK가 로드되면 화질 설정
    if (playerReady && playerRef.current && window.Vimeo) {
      // @ts-ignore
      player = new window.Vimeo.Player(playerRef.current)

      // 가능한 최고 화질로 설정 (1080p)
      player.on('loaded', () => {
        player
          .getQualities()
          .then((qualities: any) => {
            // 사용 가능한 가장 높은 화질 찾기
            const highestQuality = qualities[qualities.length - 1]
            if (highestQuality) {
              player.setQuality(highestQuality)
              console.log('화질 설정됨:', highestQuality)
            }
          })
          .catch((err: any) => console.error('화질 설정 에러:', err))
      })

      // 버퍼링 완료시 로딩 상태 해제
      player.on('playing', () => {
        setIsLoading(false)
      })
    }

    // 로딩 상태 타이머 (백업)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    // 터치/클릭 이벤트로 컨트롤 토글
    const toggleControls = () => {
      setShowControls((prev) => !prev)
      // 3초 후 컨트롤 숨기기
      if (!showControls) {
        setTimeout(() => setShowControls(false), 3000)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('click', toggleControls)
    }

    return () => {
      clearTimeout(timer)
      if (container) {
        container.removeEventListener('click', toggleControls)
      }
      // 플레이어 정리
      if (player) {
        player.unload()
      }
    }
  }, [showControls, playerReady])

  const handleBack = () => {
    router.back()
  }

  return (
    <>
      {/* Vimeo Player SDK 로드 */}
      <Script
        src="https://player.vimeo.com/api/player.js"
        onLoad={() => setPlayerReady(true)}
      />

      <div
        ref={containerRef}
        className="w-full h-screen bg-black relative flex items-center justify-center overflow-hidden"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        )}

        <div className="w-full h-full">
          <iframe
            ref={playerRef}
            src="https://player.vimeo.com/video/1076878012?h=d0a1cf5fc4&autoplay=1&title=0&byline=0&portrait=0&background=1&controls=0&dnt=1&quality=1080p&transparent=0"
            className="w-[calc(100%+240px)] h-[calc(100%+150px)] absolute -top-[75px] -left-[120px]"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* 커스텀 네이티브 스타일 컨트롤 */}
        {showControls && (
          <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-8 z-10 transition-opacity duration-300 px-8">
            <button className="bg-white/20 p-4 rounded-full text-white backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
            <button className="bg-white/20 p-5 rounded-full text-white backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </button>
            <button className="bg-white/20 p-4 rounded-full text-white backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path>
                <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path>
                <path d="M12 20v2"></path>
                <path d="M12 14v2"></path>
                <path d="M12 8v2"></path>
                <path d="M12 2v2"></path>
              </svg>
            </button>
          </div>
        )}

        <button
          onClick={handleBack}
          className="absolute top-5 left-5 p-2 rounded-full bg-black/50 text-white z-30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </>
  )
}
