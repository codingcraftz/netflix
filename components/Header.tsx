import Image from 'next/image'
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all lg:px-10 lg:py-6 ${
        isScrolled
          ? 'bg-black'
          : 'bg-gradient-to-t from-transparent via-black/80 to-black'
      }`}
    >
      <div className="flex items-center space-x-2 md:space-x-10">
        <Image
          src="/netflix_logo.svg"
          width={100}
          height={100}
          className="cursor-pointer object-contain"
          alt="netflix logo"
        />

        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">홈</li>
          <li className="headerLink">시리즈</li>
          <li className="headerLink">영화</li>
          <li className="headerLink">NEW! 요즘 대세 콘텐츠</li>
          <li className="headerLink">내가 찜한 리스트</li>
          <li className="headerLink">언어별로 찾아보기</li>
        </ul>
      </div>

      <div className="flex items-center space-x-4 text-sm font-light">
        <MagnifyingGlassIcon className="hidden h-6 w-6 sm:inline" />
        <p className="hidden lg:inline">키즈</p>
        <BellIcon className="h-6 w-6" />
        <div className="account-dropdown-button flex items-center">
          <a
            onClick={logout}
            href="#"
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded="false"
            aria-label="계정 & 설정"
            className="flex items-center cursor-pointer"
          >
            <span className="profile-link" role="presentation">
              <Image
                src="/profile.png"
                alt="프로필 이미지"
                width={32}
                height={32}
                className="profile-icon rounded"
              />
            </span>
            <ChevronDownIcon className="h-4 w-4 ml-1 text-white" />
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
