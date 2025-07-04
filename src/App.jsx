import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Home from '@/components/pages/Home'
import MathWorld from '@/components/pages/MathWorld'
import ReadingLand from '@/components/pages/ReadingLand'
import MyProgress from '@/components/pages/MyProgress'
import Stories from '@/components/pages/Stories'
import GamePlay from '@/components/pages/GamePlay'
import StoryReader from '@/components/pages/StoryReader'
import ProfileSelector from '@/components/pages/ProfileSelector'
import { ProfileProvider } from '@/hooks/useProfile'

function App() {
  return (
    <ProfileProvider>
      <div className="min-h-screen bg-background font-body">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfileSelector />} />
            <Route path="/math-world" element={<MathWorld />} />
            <Route path="/reading-land" element={<ReadingLand />} />
            <Route path="/my-progress" element={<MyProgress />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/game/:gameId" element={<GamePlay />} />
            <Route path="/story/:storyId" element={<StoryReader />} />
          </Routes>
        </main>
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
          theme="colored"
        />
      </div>
    </ProfileProvider>
  )
}

export default App