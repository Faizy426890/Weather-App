"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Clock, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2 } from "lucide-react"

const sports = ["Football", "Cricket", "Badminton", "Basketball", "Tennis", "Table Tennis", "Volleyball", "Hockey"]

// Helper function to format dates consistently
const formatTournamentDate = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    dateOnly: date.toDateString(),
  }
}

interface Friend {
  _id: string
  clerkId: string
  firstName: string
  lastName: string
  email: string
  profileImageUrl?: string
}

interface Tournament {
  _id: string
  userId: string
  tournamentName: string
  maxPlayers: number
  location: string
  startDate: string
  endDate: string
  sport: string
  members: string[]
  createdAt: string
  updatedAt: string
}

interface TournamentData {
  createdTournaments: Tournament[]
  invitedTournaments: Tournament[]
}

interface TournamentForm {
  tournamentName: string
  location: string
  sport: string
  maxPlayers: string
  startDate: string
  endDate: string
}

export default function EventManagement() {
  const { user } = useUser()

  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [availableFriends, setAvailableFriends] = useState<Friend[]>([])
  const [loadingFriends, setLoadingFriends] = useState(false)
  const [creatingTournament, setCreatingTournament] = useState(false)
  const [friendsLoaded, setFriendsLoaded] = useState(false)
  const [tournamentData, setTournamentData] = useState<TournamentData>({
    createdTournaments: [],
    invitedTournaments: [],
  })
  const [loadingTournaments, setLoadingTournaments] = useState(true)
  const [dateErrors, setDateErrors] = useState({
    startDate: "",
    endDate: "",
  })

  const [formData, setFormData] = useState<TournamentForm>({
    tournamentName: "",
    location: "",
    sport: "",
    maxPlayers: "",
    startDate: "",
    endDate: "",
  })

  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)
  const [deletingTournament, setDeletingTournament] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Fetch tournaments on mount
  const fetchTournaments = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/get/tournaments?clerkId=${user.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tournaments")
      }
      const data = await response.json()
      setTournamentData(data)
    } catch (error) {
      console.error("Error fetching tournaments:", error)
      toast.error("Failed to load tournaments", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setLoadingTournaments(false)
    }
  }
  useEffect(() => {

    if (user?.id) {
      fetchTournaments()
    }
  }, [user?.id])

  // Get minimum date (current date and time)
  const getMinDateTime = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  }

  // Validate dates with inline error messages
  const validateDates = (startDate: string, endDate: string) => {
    const errors = { startDate: "", endDate: "" }
    let isValid = true

    if (!startDate || !endDate) return false

    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()

    // Check if dates are in the future
    if (start <= now) {
      errors.startDate = "Please select a future date and time"
      isValid = false
    }

    if (end <= now) {
      errors.endDate = "Please select a future date and time"
      isValid = false
    }

    // Check if start and end times are different
    if (start.getTime() === end.getTime()) {
      errors.endDate = "End time cannot be the same as start time"
      isValid = false
    }

    // Check if start is before end
    if (start >= end) {
      errors.endDate = "End date must be after start date"
      isValid = false
    }

    setDateErrors(errors)
    return isValid
  }

  // Fetch available friends
  const fetchAvailableFriends = async (startTime: string, endTime: string) => {
    if (!user?.id) return

    setLoadingFriends(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_URL}/api/get/availableFriends?userId=${user.id}&startTime=${startTime}&endTime=${endTime}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch available friends")
      }

      const data = await response.json()
      setAvailableFriends(data.availableFriends || [])
      setFriendsLoaded(true)
    } catch (error) {
      console.error("Error fetching friends:", error)
      setAvailableFriends([])
      setFriendsLoaded(true)
    } finally {
      setLoadingFriends(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: keyof TournamentForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Reset friends when dates change
    if (field === "startDate" || field === "endDate") {
      setFriendsLoaded(false)
      setAvailableFriends([])
      setSelectedMembers([])

      // Clear date errors when user starts typing
      if (field === "startDate") {
        setDateErrors((prev) => ({ ...prev, startDate: "" }))
      } else {
        setDateErrors((prev) => ({ ...prev, endDate: "" }))
      }
    }
  }

  // Handle date change and fetch friends
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      if (validateDates(formData.startDate, formData.endDate)) {
        const startTime = new Date(formData.startDate).toISOString()
        const endTime = new Date(formData.endDate).toISOString()
        fetchAvailableFriends(startTime, endTime)
      }
    }
  }, [formData.startDate, formData.endDate, user?.id])

  const addMember = (friendClerkId: string) => {
    if (friendClerkId && !selectedMembers.includes(friendClerkId)) {
      setSelectedMembers([...selectedMembers, friendClerkId])
    }
  }

  const removeMember = (memberToRemove: string) => {
    setSelectedMembers(selectedMembers.filter((member) => member !== memberToRemove))
  }

  // Get friend name by clerk ID
  const getFriendName = (clerkId: string) => {
    const friend = availableFriends.find((f) => f.clerkId === clerkId)
    return friend ? `${friend.firstName} ${friend.lastName}` : clerkId
  }

  // Get tournament status
  const getTournamentStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    // If tournament has ended
    if (now > end) {
      return { status: "Completed", color: "bg-gray-500/20 text-gray-300" }
    }

    // If tournament is currently running
    if (now >= start && now <= end) {
      return { status: "Live Now", color: "bg-green-500/20 text-green-300" }
    }

    // If tournament is upcoming
    const diffTime = start.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

    if (diffHours <= 24) {
      return { status: "Starting Soon", color: "bg-yellow-500/20 text-yellow-300" }
    }
    if (diffDays <= 7) {
      return { status: "This Week", color: "bg-blue-500/20 text-blue-300" }
    }

    return { status: "Upcoming", color: "bg-purple-500/20 text-purple-300" }
  }

  // Create or Edit tournament
  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      toast.error("Please sign in to create a tournament", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    if (
      !formData.tournamentName ||
      !formData.location ||
      !formData.sport ||
      !formData.maxPlayers ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Please fill all required fields", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    if (!validateDates(formData.startDate, formData.endDate)) {
      return
    }

    setCreatingTournament(true)

    try {
      const tournamentData = {
        userId: user.id,
        tournamentName: formData.tournamentName,
        maxPlayers: Number.parseInt(formData.maxPlayers),
        location: formData.location,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        sport: formData.sport,
        members: selectedMembers,
      }

      let response
      if (isEditMode && editingTournament) {
        // Edit existing tournament
        response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/edit/tournament/${editingTournament._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tournamentData),
        })
      } else {
        // Create new tournament
        response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/create/tournament`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tournamentData),
        })
      }

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} tournament`)
      }

      const result = await response.json()

      toast.success(`${formData.tournamentName} has been ${isEditMode ? "updated" : "created"} successfully`, {
        position: "top-right",
        autoClose: 3000,
      })

      // Update state immediately
      if (isEditMode && editingTournament) {
        // Update existing tournament in state
        const updatedTournament = { ...editingTournament, ...tournamentData, _id: editingTournament._id }

        setTournamentData((prev) => ({
          ...prev,
          createdTournaments: prev.createdTournaments.map((t) =>
            t._id === editingTournament._id ? updatedTournament : t,
          ),
          invitedTournaments: prev.invitedTournaments.map((t) =>
            t._id === editingTournament._id ? updatedTournament : t,
          ),
        }))
      } else {
        // Add new tournament to state
        const newTournament = { ...result, ...tournamentData }
        setTournamentData((prev) => ({
          ...prev,
          createdTournaments: [...prev.createdTournaments, newTournament],
        }))
      }

      // Reset form and edit mode
      setFormData({
        tournamentName: "",
        location: "",
        sport: "",
        maxPlayers: "",
        startDate: "",
        endDate: "",
      })
      setSelectedMembers([]) 
      fetchTournaments()
      setAvailableFriends([])
      setFriendsLoaded(false)
      setDateErrors({ startDate: "", endDate: "" })
      setIsEditMode(false)
      setEditingTournament(null)
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} tournament:`, error)
      toast.error(`Failed to ${isEditMode ? "update" : "create"} tournament. Please try again.`, {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setCreatingTournament(false)
    }
  }

  // Handle edit tournament
  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament)
    setIsEditMode(true)

    // Pre-fill form with tournament data
    setFormData({
      tournamentName: tournament.tournamentName,
      location: tournament.location,
      sport: tournament.sport,
      maxPlayers: tournament.maxPlayers.toString(),
      startDate: new Date(tournament.startDate).toISOString().slice(0, 16),
      endDate: new Date(tournament.endDate).toISOString().slice(0, 16),
    })

    setSelectedMembers(tournament.members || [])

    // Scroll to form
    const formElement = document.getElementById("tournament-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    toast.info("Form loaded with tournament data. Make your changes and submit.", {
      position: "top-right",
      autoClose: 3000,
    })
  }

  // Handle delete tournament
  const handleDeleteTournament = async (tournamentId: string) => {
    if (!user?.id) return

    setDeletingTournament(tournamentId)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_URL}/api/delete/tournament/${tournamentId}?clerkId=${user.id}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to delete tournament")
      }

      toast.success("Tournament deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      })

      // Remove tournament from state immediately
      setTournamentData((prev) => ({
        ...prev,
        createdTournaments: prev.createdTournaments.filter((t) => t._id !== tournamentId),
        invitedTournaments: prev.invitedTournaments.filter((t) => t._id !== tournamentId),
      }))
    } catch (error) {
      console.error("Error deleting tournament:", error)
      toast.error("Failed to delete tournament. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setDeletingTournament(null)
    }
  }

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditingTournament(null)
    setFormData({
      tournamentName: "",
      location: "",
      sport: "",
      maxPlayers: "",
      startDate: "",
      endDate: "",
    })
    setSelectedMembers([])
    setAvailableFriends([])
    setFriendsLoaded(false)
    setDateErrors({ startDate: "", endDate: "" })
  }

  // Render tournament card
  const renderTournamentCard = (tournament: Tournament, index: number, isCreatedByUser = false) => {
    const { status, color } = getTournamentStatus(tournament.startDate, tournament.endDate)

    return (
      <motion.div
       key={tournament._id || Math.random().toString(36).substr(2, 9)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 group"
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{tournament.tournamentName}</h3>
              <span className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                {tournament.sport}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${color}`}>{status}</span>
              {isCreatedByUser && (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditTournament(tournament)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors"
                    title="Edit Tournament"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-colors"
                        title="Delete Tournament"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Tournament</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          Are you sure you want to delete "{tournament.tournamentName}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTournament(tournament._id)}
                          disabled={deletingTournament === tournament._id}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deletingTournament === tournament._id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{tournament.location}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium">
                  {new Date(tournament.startDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(tournament.startDate).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    -{" "}
                    {new Date(tournament.endDate).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                {/* Show end date if different from start date */}
                {new Date(tournament.startDate).toDateString() !== new Date(tournament.endDate).toDateString() && (
                  <div className="text-xs text-gray-500 mt-1">
                    Ends:{" "}
                    {new Date(tournament.endDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Users className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span>
                    {tournament.members?.length || 0}/{tournament.maxPlayers} members
                  </span>
                  <span className="text-gray-400">
                    {Math.round(((tournament.members?.length || 0) / tournament.maxPlayers) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((tournament.members?.length || 0) / tournament.maxPlayers) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 
            border border-white/10 rounded-xl text-white font-medium
            transition-colors duration-200"
          >
            View Details
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 mb-8 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Sports Events
            </h1>
            <p className="text-gray-400 mt-2">Manage and track your sports tournaments</p>
            {user && <p className="text-gray-300 mt-1">Welcome, {user.firstName || user.username}!</p>}
          </div>
        </div>

        {loadingTournaments ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading tournaments...</span>
          </div>
        ) : (
          <>
            {/* Invited Tournaments Section */}
            {tournamentData.invitedTournaments && tournamentData.invitedTournaments.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Upcoming Tournaments (Invited)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tournamentData.invitedTournaments.map((tournament, index) =>
                    renderTournamentCard(tournament, index),
                  )}
                </div>
              </div>
            )}

            {/* Created Tournaments Section */}
            {tournamentData.createdTournaments && tournamentData.createdTournaments.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">My Created Tournaments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tournamentData.createdTournaments.map((tournament, index) =>
                    renderTournamentCard(tournament, index, true),
                  )}
                </div>
              </div>
            )}

            {/* No tournaments message */}
            {!tournamentData.invitedTournaments?.length && !tournamentData.createdTournaments?.length && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No tournaments found. Create your first tournament below!</p>
              </div>
            )}
          </>
        )}

        {/* Create Tournament Form */}
        <motion.div
          id="tournament-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {isEditMode ? "Edit Tournament" : "Create New Tournament"}
              </h2>
              {isEditMode && (
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  Cancel Edit
                </Button>
              )}
            </div>

            <form onSubmit={handleCreateTournament} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Tournament Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.tournamentName}
                    onChange={(e) => handleInputChange("tournamentName", e.target.value)}
                    placeholder="Enter tournament name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter tournament location"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sport" className="text-gray-300">
                    Sport *
                  </Label>
                  <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-gray-300">
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 text-white border-white/10">
                      {sports.map((sport) => (
                        <SelectItem className="text-white" key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers" className="text-gray-300">
                    Maximum Players *
                  </Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    min="2"
                    value={formData.maxPlayers}
                    onChange={(e) => handleInputChange("maxPlayers", e.target.value)}
                    placeholder="Enter maximum players"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-300">
                    Start Date & Time *
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    min={getMinDateTime()}
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                  {dateErrors.startDate && <p className="text-red-400 text-sm mt-1">{dateErrors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-300">
                    End Date & Time *
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    min={formData.startDate || getMinDateTime()}
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                  {dateErrors.endDate && <p className="text-red-400 text-sm mt-1">{dateErrors.endDate}</p>}
                </div>
              </div>

              {/* Friends Selection Section */}
              <div className="md:col-span-2 space-y-4">
                <Label className="text-gray-300">
                  Invite Friends (Optional)
                  {!friendsLoaded && (
                    <span className="text-gray-500 text-sm ml-2">(Select both start and end dates first)</span>
                  )}
                </Label>

                {loadingFriends && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading available friends...</span>
                  </div>
                )}

                {friendsLoaded && !loadingFriends && (
                  <Select onValueChange={addMember} disabled={!friendsLoaded || availableFriends.length === 0}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-gray-300">
                      <SelectValue
                        placeholder={
                          availableFriends.length === 0 ? "No available friends found" : "Select a friend to invite"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {availableFriends
                        .filter((friend) => !selectedMembers.includes(friend.clerkId))
                        .map((friend) => (
                          <SelectItem key={friend.clerkId} value={friend.clerkId}>
                            {friend.firstName} {friend.lastName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}

                {selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMembers.map((memberClerkId) => (
                      <div
                        key={memberClerkId}
                        className="flex items-center bg-white/10 rounded-full px-3 py-1 text-sm text-white"
                      >
                        {getFriendName(memberClerkId)}
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-white"
                          onClick={() => removeMember(memberClerkId)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={creatingTournament || !user}
                  className="w-full py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 
                    hover:to-purple-500/30 rounded-xl text-white font-medium border border-white/10 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingTournament ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {isEditMode ? "Updating Tournament..." : "Creating Tournament..."}
                    </>
                  ) : isEditMode ? (
                    "Update Tournament"
                  ) : (
                    "Create Tournament"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

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
