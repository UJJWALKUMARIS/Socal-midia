import React, { useEffect, useState, useRef } from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { HiOutlineSearch } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { url } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchData, setSuggestedUser } from '../redux/userSlice'
import OtherUser from '../componesnsts/OtherUser'
import { ClipLoader } from 'react-spinners'

function Surch() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userData, searchData } = useSelector(state => state.user)
  const searchResults = searchData?.users || []

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [randomUsers, setRandomUsers] = useState([])
  
  // ✅ Use ref to cancel outdated requests
  const abortControllerRef = useRef(null)

  // ================= SEARCH USERS =================
  const handleSearch = async (value) => {
    // ✅ Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (value.trim().length < 1) {
      dispatch(setSearchData({ users: [] }))
      setLoading(false)
      return
    }

    setLoading(true)
    
    // ✅ Create new abort controller for this request
    abortControllerRef.current = new AbortController()
    
    try {
      const res = await axios.get(
        `${url}/api/user/search?keyWord=${value}`,
        { 
          withCredentials: true,
          signal: abortControllerRef.current.signal
        }
      )
      dispatch(setSearchData(res.data))
    } catch (err) {
      // ✅ Don't log aborted requests
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('Search error:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  // ================= DEBOUNCE =================
  useEffect(() => {
    if (input.trim().length < 2) {
      dispatch(setSearchData({ users: [] }))
      setLoading(false)
      return
    }

    setLoading(true) // ✅ Set loading immediately when user types
    const timer = setTimeout(() => {
      handleSearch(input)
    }, 400)

    return () => {
      clearTimeout(timer)
      // ✅ Cancel request on cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [input, dispatch]) // ✅ Added dispatch to dependencies

  // ================= SUGGESTED USERS =================
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await axios.get(
          `${url}/api/user/suggested`,
          { withCredentials: true }
        )

        const users = res.data.filter(
          u => u._id !== userData?._id
        )

        dispatch(setSuggestedUser(users))

        const shuffled = [...users].sort(() => 0.5 - Math.random())
        setRandomUsers(shuffled.slice(0, 3))
      } catch (err) {
        console.error('Suggested users error:', err)
      }
    }

    if (userData) fetchSuggested()
  }, [dispatch, userData])

  return (
    <div className='w-full min-h-screen bg-black text-white flex flex-col'>

      {/* ================= HEADER ================= */}
      <div className='h-[64px] flex items-center gap-3 px-4 border-b border-gray-800'>
        <button
          onClick={() => navigate(-1)}
          className='p-2 rounded-full hover:bg-gray-800 transition'
        >
          <MdOutlineKeyboardBackspace size={26} />
        </button>
        <h1 className='text-lg font-semibold'>Search</h1>
      </div>

      {/* ================= SEARCH INPUT ================= */}
      <div className='px-4 mt-6'>
        <div className='relative max-w-[500px] mx-auto'>
          <HiOutlineSearch
            size={22}
            className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Search users...'
            className='w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-full
                       border border-gray-800 focus:border-blue-500 outline-none'
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className='flex-1 px-4 mt-6'>

        {/* ===== Suggested Users ===== */}
        {input.length === 0 && (
          <>
            <h2 className='text-lg font-semibold mb-3'>
              Suggested Users
            </h2>

            <div className='flex flex-col gap-2'>
              {randomUsers.length > 0 ? (
                randomUsers.map(user => (
                  <OtherUser key={user._id} user={user} />
                ))
              ) : (
                <p className='text-gray-400 text-sm'>
                  No suggestions available
                </p>
              )}
            </div>
          </>
        )}

        {/* ===== Search Results ===== */}
        {input.length > 0 && (
          <>
            {loading ? (
              <div className='flex justify-center mt-10'>
                <ClipLoader color='white' size={30} />
              </div>
            ) : searchResults.length > 0 ? (
              <div className='flex flex-col gap-2'>
                {searchResults
                  .filter(u => u._id !== userData?._id)
                  .map(user => (
                    <OtherUser key={user._id} user={user} />
                  ))}
              </div>
            ) : (
              <p className='text-gray-400 text-center mt-10'>
                No users found 😕
              </p>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default Surch;