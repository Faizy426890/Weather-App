"use client"
import { useState, useEffect, useRef } from "react"
import {
  Search,
  UserPlus,
  Award,
  Calendar,
  Trophy,
  Star,
  Target,
  Zap,
  Users,
  Check,
  X,
  Loader2,
  UserCheck,
  Mail,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useDebounce } from "./hooks/useDebounce"
import SearchResults from "../Components/SearchResults"

interface Achievement {
  icon: string
  name: string
  color: string
  _id: string
}

interface FriendSuggestion {
  _id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
  bio: string
  achievements: Achievement[]
  hasRequested: boolean
}

interface SearchUser {
  _id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
  bio: string
  achievements: Achievement[]
}

interface UserInfo {
  _id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
  bio: string
  achievements: Achievement[]
  friendRequests: any[]
  friends: any[]
  sentRequests: {
    clerkId: string
    email: string
    firstName: string
    lastName: string
    profileImageUrl: string
    role: string
    isCoach: string
    bio: string
    achievements: Achievement[]
  }[]
  isCoach: string
  role: string
}

// Icon mapping for achievements
const iconMap: { [key: string]: any } = {
  Award: Award,
  Calendar: Calendar,
  Trophy: Trophy,
  Star: Star,
  Target: Target,
  Zap: Zap,
}

export default function FindFriends() {
  const { user } = useUser()
  const [friendSuggestions, setFriendSuggestions] = useState<FriendSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null)
  const [deletingRequest, setDeletingRequest] = useState<string | null>(null)
  const [sendingRequest, setSendingRequest] = useState<string | null>(null)

  // New states for search functionality
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Carousel state
  const [scrollPosition, setScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Debounce the search term to avoid making too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Add this state for mobile detection
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchFriendSuggestions()
      fetchUserInfo()
    }
  }, [user?.id])

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      searchUsers()
    } else {
      setSearchResults([])
      setHasSearched(false)
    }
  }, [debouncedSearchTerm])

  // Add this useEffect after existing useEffects
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const searchUsers = async () => {
    if (!user?.id || debouncedSearchTerm.length < 2) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/search-users`, {
        params: {
          clerkId: user.id,
          letters: debouncedSearchTerm,
        },
      })

      setSearchResults(response.data.users || [])
    } catch (error) {
      console.error("Error searching users:", error)
      toast.error("Failed to search for users")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const fetchFriendSuggestions = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEATHER_URL}/api/friend-suggestions?clerkId=${user?.id}`,
      )
      setFriendSuggestions(response.data)
    } catch (error) {
      console.error("Error fetching friend suggestions:", error)
      toast.error("Failed to load friend suggestions")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/user-info?clerkId=${user?.id}`)
      setUserInfo(response.data)
    } catch (error) {
      console.error("Error fetching user info:", error)
      toast.error("Failed to load user information")
    }
  }

  const sendFriendRequest = async (toClerkId: string) => {
    try {
      setSendingRequest(toClerkId)
      await axios.post(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/send-friend-request`, {
        fromClerkId: user?.id,
        toClerkId: toClerkId,
      })

      // Refresh user info to get updated sentRequests
      await fetchUserInfo()

      toast.success("Friend request sent successfully!")
    } catch (error) {
      console.error("Error sending friend request:", error)
      toast.error("Failed to send friend request")
    } finally {
      setSendingRequest(null)
    }
  }

  const cancelFriendRequest = async (toClerkId: string) => {
    try {
      setSendingRequest(toClerkId)
      await axios.post(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/cancel-friend-request`, {
        fromClerkId: user?.id,
        toClerkId: toClerkId,
      })

      // Refresh user info to get updated sentRequests
      await fetchUserInfo()

      toast.success("Friend request cancelled successfully!")
    } catch (error) {
      console.error("Error cancelling friend request:", error)
      toast.error("Failed to cancel friend request")
    } finally {
      setSendingRequest(null)
    }
  }

  const acceptFriendRequest = async (fromClerkId: string) => {
    try {
      setAcceptingRequest(fromClerkId)
      await axios.post(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/accept-friend-request`, {
        fromClerkId: fromClerkId,
        toClerkId: user?.id,
      })

      // Refresh user info to get updated friend requests
      await fetchUserInfo()

      toast.success("Friend request accepted!")
    } catch (error) {
      console.error("Error accepting friend request:", error)
      toast.error("Failed to accept friend request")
    } finally {
      setAcceptingRequest(null)
    }
  }

  const deleteFriendRequest = async (fromClerkId: string) => {
    try {
      setDeletingRequest(fromClerkId)
      await axios.post(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/delete-friend-request`, {
        fromClerkId: fromClerkId,
        toClerkId: user?.id,
      })

      // Refresh user info to get updated friend requests
      await fetchUserInfo()

      toast.success("Friend request deleted!")
    } catch (error) {
      console.error("Error deleting friend request:", error)
      toast.error("Failed to delete friend request")
    } finally {
      setDeletingRequest(null)
    }
  }

  const hasRequestBeenSent = (friendClerkId: string) => {
    return userInfo?.sentRequests?.some((request) => request.clerkId === friendClerkId) || false
  }

  const getAchievementIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Award
    return IconComponent
  }

  const truncateBio = (bio: string, maxLength = 50) => {
    if (!bio) return ""
    return bio.length > maxLength ? bio.substring(0, maxLength) + "..." : bio
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  const filteredSuggestions = friendSuggestions.filter(
    (friend) =>
      friend.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.bio.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Determine what to show: search results or friend suggestions
  const showSearchResults = debouncedSearchTerm.length >= 2

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft - carouselRef.current.offsetWidth,
        behavior: "smooth",
      })
      setScrollPosition(carouselRef.current.scrollLeft - carouselRef.current.offsetWidth)
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft + carouselRef.current.offsetWidth,
        behavior: "smooth",
      })
      setScrollPosition(carouselRef.current.scrollLeft + carouselRef.current.offsetWidth)
    }
  }

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollability()
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollability)
      window.addEventListener("resize", checkScrollability)
      return () => {
        carousel.removeEventListener("scroll", checkScrollability)
        window.removeEventListener("resize", checkScrollability)
      }
    }
  }, [filteredSuggestions])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl p-8 mb-8 border border-purple-500/20 shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-3">
              <div className="p-3 bg-[#1877f2] rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Find Friends</h1>
                <p className="text-[#b0b3b8] mt-1">Discover and connect with amazing people in your network</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${isSearching ? "text-purple-400 animate-pulse" : "text-gray-300"}`}
                />
                <input
                  type="text"
                  placeholder="Search for friends by name, email, or bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Section - Show when search is active */}
        {showSearchResults && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[#1877f2] rounded-lg shadow-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Search Results
                {!isSearching && searchResults.length > 0 && (
                  <span className="ml-2 px-3 py-1 bg-[#1877f2]/20 text-[#1877f2] text-sm rounded-full border border-[#1877f2]/30">
                    {searchResults.length}
                  </span>
                )}
              </h2>
            </div>

            <SearchResults
              searchResults={searchResults}
              isSearching={isSearching}
              hasSearched={hasSearched}
              sendingRequest={sendingRequest}
              hasRequestBeenSent={hasRequestBeenSent}
              sendFriendRequest={sendFriendRequest}
              cancelFriendRequest={cancelFriendRequest}
              userInfo={userInfo}
              acceptingRequest={acceptingRequest}
              deletingRequest={deletingRequest}
              acceptFriendRequest={acceptFriendRequest}
              deleteFriendRequest={deleteFriendRequest}
            />
          </div>
        )}

        {/* Pending Friend Requests Section - Always Show */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-[#42b883] rounded-lg shadow-lg">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Pending Friend Requests
              {userInfo?.friendRequests && userInfo.friendRequests.length > 0 && (
                <span className="ml-2 px-3 py-1 bg-[#42b883]/20 text-[#42b883] text-sm rounded-full border border-[#42b883]/30">
                  {userInfo.friendRequests.length}
                </span>
              )}
            </h2>
          </div>

          {userInfo?.friendRequests && userInfo.friendRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {userInfo.friendRequests.map((request) => (
                <div
                  key={request.clerkId}
                  className="group relative bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden"
                >
                  {/* Card Content Container with fixed height and flex layout */}
                  <div className="h-[200px] flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 flex-shrink-0">
                      {/* Profile Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-16 w-16 ring-2 ring-purple-500/30 shadow-lg">
                            <AvatarImage src={request.profileImageUrl || "/placeholder.svg"} alt={request.firstName} />
                            <AvatarFallback className="bg-purple-500 text-white font-bold text-lg">
                              {getInitials(request.firstName, request.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-gray-900/50 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg leading-tight mb-1">
                            {request.firstName} {request.lastName}
                          </h3>
                          <p className="text-[#b0b3b8] text-sm flex items-center mb-1">
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{request.email}</span>
                          </p>
                          {request.bio && (
                            <p className="text-gray-300 text-xs leading-relaxed">{truncateBio(request.bio, 20)}</p>
                          )}
                          <div className="flex items-center text-[#b0b3b8] text-xs mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>2 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section - Flexible height */}
                    <div className="px-6 flex-1 flex flex-col">
                      {/* Bio */}
                      {/* {request.bio && (
                        <div className="mb-4">
                          <p className="text-[#e4e6ea] text-sm leading-relaxed bg-[#3a3b3c] rounded-lg p-3 border border-[#4e4f50]">
                            {truncateBio(request.bio, 20)}
                          </p>
                        </div>
                      )} */}
                    </div>

                    {/* Action Buttons - Fixed at bottom with 20px margin */}
                    <div className="p-6 pt-0 mt-auto">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => acceptFriendRequest(request.clerkId)}
                          disabled={acceptingRequest === request.clerkId}
                          className="flex-1 bg-[#42b883] hover:bg-[#369870] text-white font-semibold py-2 px-4 text-sm rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#42b883]/25 hover:scale-105"
                        >
                          {acceptingRequest === request.clerkId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Accept
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => deleteFriendRequest(request.clerkId)}
                          disabled={deletingRequest === request.clerkId}
                          className="flex-1 bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6ea] hover:text-white font-semibold py-2 px-4 text-sm rounded-lg transition-all duration-300 flex items-center justify-center border border-[#4e4f50] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                          {deletingRequest === request.clerkId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl p-12 border border-purple-500/20 text-center shadow-lg">
              <div className="w-16 h-16 bg-[#3a3b3c] rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-[#b0b3b8]" />
              </div>
              <h3 className="text-xl font-semibold text-[#e4e6ea] mb-2">No Pending Requests</h3>
              <p className="text-[#b0b3b8]">You don't have any friend requests at the moment.</p>
            </div>
          )}
        </div>

        {/* Friend Suggestions Section - Show when not searching or search term is too short */}
        {!showSearchResults && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[#1877f2] rounded-lg shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Friend Suggestions</h2>
            </div>

            {loading ? (
              <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl p-6 animate-pulse border border-purple-500/20 h-[240px] w-[280px] shrink-0 snap-start"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-16 w-16 bg-[#3a3b3c] rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-[#3a3b3c] rounded mb-2"></div>
                        <div className="h-4 bg-[#3a3b3c] rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-[#3a3b3c] rounded mb-4"></div>
                    <div className="h-10 bg-[#3a3b3c] rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl p-12 border border-purple-500/20 text-center shadow-lg">
                <div className="w-16 h-16 bg-[#3a3b3c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-[#b0b3b8]" />
                </div>
                <h3 className="text-xl font-semibold text-[#e4e6ea] mb-2">No Friend Suggestions Found</h3>
                <p className="text-[#b0b3b8]">
                  Try adjusting your search criteria or check back later for new suggestions.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide touch-pan-x"
                >
                  {filteredSuggestions.map((friend) => (
                    <div
                      key={friend._id}
                      className="group relative bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden h-[220px] w-[320px] min-w-[320px] shrink-0 snap-start"
                    >
                      {/* Card Content Container with fixed height and flex layout */}
                      <div className="h-full flex flex-col">
                        {/* Header Section */}
                        <div className="p-6 flex-shrink-0">
                          {/* Profile Header */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="relative flex-shrink-0">
                              <Avatar className="h-16 w-16 ring-2 ring-purple-500/30 shadow-lg">
                                <AvatarImage
                                  src={friend.profileImageUrl || "/placeholder.svg"}
                                  alt={friend.firstName}
                                />
                                <AvatarFallback className="bg-purple-500 text-white font-bold text-lg">
                                  {getInitials(friend.firstName, friend.lastName)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white text-lg leading-tight mb-1">
                                {friend.firstName} {friend.lastName}
                              </h3>
                              <p className="text-[#b0b3b8] text-sm flex items-center mb-1">
                                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span>{friend.email}</span>
                              </p>
                              {friend.bio && (
                                <p className="text-gray-300 text-xs leading-relaxed">{truncateBio(friend.bio, 20)}</p>
                              )}
                              <div className="flex items-center text-[#b0b3b8] text-xs mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>Suggested for you</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button - Fixed at bottom with 20px margin */}
                        <div className="p-6 pt-0 mt-auto">
                          {hasRequestBeenSent(friend.clerkId) ? (
                            <button
                              onClick={() => cancelFriendRequest(friend.clerkId)}
                              disabled={sendingRequest === friend.clerkId}
                              className="w-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6ea] hover:text-white font-semibold py-3 px-4 text-sm rounded-lg transition-all duration-300 flex items-center justify-center border border-[#4e4f50] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                            >
                              {sendingRequest === friend.clerkId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Request
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => sendFriendRequest(friend.clerkId)}
                              disabled={sendingRequest === friend.clerkId}
                              className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold py-3 px-4 text-sm rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#1877f2]/25 hover:scale-105"
                            >
                              {sendingRequest === friend.clerkId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Add Friend
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {!isMobile && canScrollLeft && (
                  <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 -ml-4 backdrop-blur-sm border border-white/10"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}
                {!isMobile && canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 -mr-4 backdrop-blur-sm border border-white/10"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Load More Section */}
        {!loading && !showSearchResults && filteredSuggestions.length > 0 && (
          <div className="text-center">
            <button
              onClick={fetchFriendSuggestions}
              className="bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 hover:bg-gray-700 text-[#e4e6ea] hover:text-white px-8 py-4 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/30 font-medium shadow-lg hover:shadow-xl hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Refresh Suggestions</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="mt-16"
        toastClassName="bg-[#242526] backdrop-blur-lg border border-[#3a3b3c]"
      />
    </div>
  )
}
