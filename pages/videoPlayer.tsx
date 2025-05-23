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
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [autoplayAttempted, setAutoplayAttempted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLIFrameElement>(null)
  const [playerReady, setPlayerReady] = useState(false)

  // 기기 타입 감지 (모바일, 태블릿 분리)
  useEffect(() => {
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase()

      // 태블릿 감지 (iPad 명시적 감지 추가)
      const isTabletDevice =
        /ipad/i.test(userAgent) ||
        (navigator.maxTouchPoints &&
          navigator.maxTouchPoints > 2 &&
          /macintosh/i.test(userAgent)) || // iPad Pro with iPadOS
        (/android/i.test(userAgent) && !/mobile/i.test(userAgent))

      // 모바일 감지
      const isMobileDevice =
        /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        ) && !isTabletDevice

      setIsTablet(isTabletDevice)
      setIsMobile(isMobileDevice)

      console.log('디바이스 감지:', {
        isTablet: isTabletDevice,
        isMobile: isMobileDevice,
        userAgent,
      })

      // Safari 브라우저에서 스크롤 방지
      if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
        // Safari 브라우저일 경우 body에 overflow hidden 추가
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        document.body.style.height = '100%'
      }
    }

    detectDeviceType()

    return () => {
      // 컴포넌트 언마운트 시 스타일 초기화
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [])

  useEffect(() => {
    // Vimeo Player SDK 초기화
    let player: any = null

    // 플레이어가 준비되고 SDK가 로드되면 화질 설정
    if (playerReady && playerRef.current && window.Vimeo) {
      try {
        // @ts-ignore
        player = new window.Vimeo.Player(playerRef.current)

        // 자동 재생 시도 표시
        setAutoplayAttempted(true)

        // 이중 안전장치: iframe이 로드된 후 명시적으로 재생 시도
        setTimeout(() => {
          if (player) {
            console.log('강제 재생 시도')
            player
              .setMuted(true)
              .then(() => player.play())
              .catch((err: any) => console.error('강제 재생 실패:', err))
          }
        }, 1000)

        // 이후 처음부터 자동 재생 시도
        player.play().catch((err: any) => {
          console.error('자동 재생 실패:', err)

          // 태블릿에서는 자동 재생 실패해도 재생 중으로 간주 (버튼 숨김 유지)
          if (!isTablet) {
            setIsPlaying(false)
          }

          // 태블릿에서 재생이 실패한 경우 무음으로 다시 시도
          if (isTablet) {
            player.setMuted(true).then(() => {
              player
                .play()
                .then(() => {
                  setIsPlaying(true)
                  console.log('무음 모드로 재생 성공')
                })
                .catch((e: any) =>
                  console.error('무음으로도 자동 재생 실패:', e)
                )
            })
          }
        })

        // 페이지 로드된 이벤트
        player.on('loaded', () => {
          // 로드된 후 다시 한번 재생 시도
          player.setMuted(true).then(() => {
            player
              .play()
              .then(() => console.log('로드 후 재생 시도 성공'))
              .catch((err: any) =>
                console.error('로드 후 재생 시도 실패:', err)
              )
          })

          // 가능한 최고 화질로 설정
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

        // 재생 시작된 경우
        player.on('playing', () => {
          setIsPlaying(true)
          setIsLoading(false)
          console.log('비디오 재생 시작됨')

          // 재생 시작 후 1.5초 뒤에 소리 자동 활성화 시도
          setTimeout(() => {
            player
              .setMuted(false)
              .then(() => {
                player
                  .setVolume(1)
                  .then(() => console.log('소리 자동 활성화 성공'))
                  .catch((err: any) => console.error('볼륨 설정 실패:', err))
              })
              .catch((err: any) => console.error('음소거 해제 실패:', err))
          }, 1500)
        })

        // 에러 처리
        player.on('error', (err: any) => {
          console.error('Vimeo 플레이어 에러:', err)
          setIsLoading(false)
          setIsPlaying(false) // 에러 발생 시 isPlaying을 false로 설정
        })
      } catch (error) {
        console.error('Vimeo Player 초기화 에러:', error)
        setIsLoading(false)
        setIsPlaying(false) // 초기화 실패 시 isPlaying을 false로 설정
      }
    }

    // 로딩 상태 타이머 (백업)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    // 터치/클릭 이벤트로 컨트롤 토글 또는 비디오 재생
    const toggleControls = () => {
      if ((isMobile || isTablet) && !isPlaying && player) {
        // 모바일/태블릿에서 첫 클릭 시 비디오 재생 시도
        player
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err: any) => {
            console.error('클릭 후 재생 실패:', err)
          })
      }

      setShowControls(true)
      // 3초 후 컨트롤 숨기기
      setTimeout(() => setShowControls(false), 3000)
    }

    // 마우스 움직임 감지 (데스크톱)
    const handleMouseMove = () => {
      if (!isMobile && !isTablet) {
        setShowControls(true)
        // 3초 후 컨트롤 숨기기
        setTimeout(() => setShowControls(false), 3000)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('click', toggleControls)
      container.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      clearTimeout(timer)
      if (container) {
        container.removeEventListener('click', toggleControls)
        container.removeEventListener('mousemove', handleMouseMove)
      }
      // 플레이어 정리
      if (player) {
        player.unload()
      }
    }
  }, [
    showControls,
    playerReady,
    isMobile,
    isTablet,
    isPlaying,
    autoplayAttempted,
  ])

  const handleBack = () => {
    router.back()
  }

  // 아이패드에서 Vimeo 앱으로 열기
  const openInVimeoApp = () => {
    if (isTablet) {
      // Vimeo 앱 URL 스키마 또는 웹 URL
      const vimeoAppUrl = `vimeo://1077598545`
      const vimeoWebUrl = `https://vimeo.com/1077598545/d079ea1a03`

      // 앱 열기 시도 (앱이 설치되어 있지 않으면 웹으로 이동)
      window.location.href = vimeoAppUrl

      // 타임아웃으로 앱이 열리지 않았을 경우 웹 버전으로 이동
      setTimeout(() => {
        window.location.href = vimeoWebUrl
      }, 500)
    }
  }

  // 비디오 재생 시작하기 (모바일/태블릿용)
  const startPlayback = () => {
    if (playerRef.current && window.Vimeo) {
      try {
        const player = new window.Vimeo.Player(playerRef.current)
        player
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err: any) => {
            console.error('수동 재생 시도 실패:', err)

            // iPad에서 재생 실패 시 새로운 접근 시도
            if (isTablet) {
              // 직접 네이티브 비디오 재생 트리거
              const videoEl = document.querySelector('iframe')
              if (videoEl) {
                videoEl.setAttribute(
                  'src',
                  videoEl.getAttribute('src') + '&autoplay=1'
                )
                setTimeout(() => setIsPlaying(true), 500)
              }
            }
          })
      } catch (err) {
        console.error('재생 시도 중 예외 발생:', err)
      }
    }
  }

  // iframe URL 생성: 기기 타입에 따라 다른 설정 적용
  const getVideoSrc = () => {
    const baseUrl = 'https://player.vimeo.com/video/1077598545?h=d079ea1a03'
    const commonParams =
      '&title=0&byline=0&portrait=0&transparent=0&dnt=1&quality=1080p'

    if (isTablet) {
      // 태블릿: 넷플릭스 스타일 - 컨트롤 없음, 풀스크린 최적화 (자동재생을 위해 muted 먼저 배치)
      return `${baseUrl}&muted=1&autoplay=1${commonParams}&playsinline=1&controls=0&autopause=0&background=1`
    } else if (isMobile) {
      // 모바일: 넷플릭스 스타일 - 컨트롤 최소화 (자동재생을 위해 muted 먼저 배치)
      return `${baseUrl}&muted=1&autoplay=1${commonParams}&playsinline=1&controls=0`
    } else {
      // 데스크톱: 처음에는 무음으로 자동 재생하고 나중에 소리 활성화
      return `${baseUrl}&muted=1&autoplay=1${commonParams}&controls=0`
    }
  }

  return (
    <>
      {/* Vimeo Player SDK 로드 */}
      <Script
        src="https://player.vimeo.com/api/player.js"
        onLoad={() => setPlayerReady(true)}
        strategy="beforeInteractive"
      />

      <div
        ref={containerRef}
        className="w-full h-screen bg-black relative flex items-center justify-center overflow-hidden"
        style={{
          touchAction: 'none', // 터치 스크롤 방지
          WebkitOverflowScrolling: 'touch' as any, // Safari 스크롤 제어
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* 모바일에서만 비디오가 자동 재생되지 않을 때 표시할 재생 버튼 (태블릿 제외) */}
        {isMobile && !isTablet && !isPlaying && !isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-30 bg-black/70"
            onClick={startPlayback}
          >
            <div className="p-6 rounded-full bg-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <p className="absolute bottom-40 text-white text-lg font-bold">
              탭하여 재생하기
            </p>
          </div>
        )}

        <div className="w-full h-full overflow-hidden">
          <iframe
            ref={playerRef}
            src={getVideoSrc()}
            className="w-full h-full object-cover"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '100vh',
              maxWidth: 'none',
              maxHeight: 'none',
              objectFit: 'cover',
            }}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* 소리 켜기 버튼 (재생 중이고 탭/클릭 시) */}
        {isPlaying && showControls && (
          <button
            onClick={() => {
              if (playerRef.current && window.Vimeo) {
                try {
                  const player = new window.Vimeo.Player(playerRef.current)
                  player.setMuted(false)
                  player.setVolume(1)
                } catch (err) {
                  console.error('음소거 해제 에러:', err)
                }
              }
            }}
            className="absolute bottom-20 right-5 p-3 rounded-full bg-black/30 text-white z-30 backdrop-blur-sm"
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
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>
        )}

        {/* 넷플릭스 스타일 미니멀 UI - 뒤로가기 버튼만 표시 */}
        {showControls && (
          <button
            onClick={handleBack}
            className="absolute top-5 left-5 p-3 rounded-full bg-black/30 text-white z-30 backdrop-blur-sm transition-opacity duration-300"
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
        )}
      </div>
    </>
  )
}
