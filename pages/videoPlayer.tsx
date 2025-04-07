import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch((err) => {
        console.log('재생 실패:', err)
      })
    }
  }, [])

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="w-full h-screen bg-black relative">
      <video
        ref={videoRef}
        src="/test.mp4"
        controls
        className="w-full h-full object-contain"
        preload="auto"
      />
      <button
        onClick={handleBack}
        className="absolute top-5 left-5 p-2 rounded-full bg-black/50 text-white"
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
  )
}
