import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { analyticsService } from '@/services/api/analyticsService'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { toast } from 'react-toastify'

const ParentDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('daily')
  const [progressData, setProgressData] = useState([])
  const [worldDistribution, setWorldDistribution] = useState(null)
  const [topGames, setTopGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [timeFilter])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [progress, distribution, games] = await Promise.all([
        getProgressData(),
        analyticsService.getWorldDistribution(),
        analyticsService.getTopGames()
      ])
      
      setProgressData(progress)
      setWorldDistribution(distribution)
      setTopGames(games)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getProgressData = async () => {
    switch (timeFilter) {
      case 'daily':
        return await analyticsService.getDailyProgress(7)
      case 'weekly':
        return await analyticsService.getWeeklyProgress(4)
      case 'monthly':
        return await analyticsService.getMonthlyProgress(3)
      default:
        return await analyticsService.getDailyProgress(7)
    }
  }

  const getProgressChartOptions = () => ({
    chart: {
      id: 'progress-chart',
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      },
      fontFamily: 'Poppins, sans-serif'
    },
    xaxis: {
      categories: progressData.map(item => item.date || item.week || item.month),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    colors: ['#6B5BCD', '#FF6B9D', '#FFC857'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontWeight: 600,
      markers: {
        width: 8,
        height: 8,
        radius: 4
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif'
      }
    }
  })

  const getProgressChartSeries = () => [
    {
      name: 'Games Completed',
      data: progressData.map(item => item.games)
    },
    {
      name: 'Stories Completed',
      data: progressData.map(item => item.stories)
    },
    {
      name: 'Stars Earned',
      data: progressData.map(item => item.totalStars)
    }
  ]

  const getTimeSpentChartOptions = () => ({
    chart: {
      id: 'time-spent-chart',
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      },
      fontFamily: 'Poppins, sans-serif'
    },
    xaxis: {
      categories: progressData.map(item => item.date || item.week || item.month),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      title: {
        text: 'Minutes',
        style: {
          color: '#6B7280',
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    colors: ['#4ECB71'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif'
      }
    }
  })

  const getTimeSpentChartSeries = () => [
    {
      name: 'Time Spent (min)',
      data: progressData.map(item => item.estimatedTime)
    }
  ]

  const getWorldDistributionChartOptions = () => ({
    chart: {
      id: 'world-distribution-chart',
      type: 'donut',
      height: 300,
      fontFamily: 'Poppins, sans-serif'
    },
    colors: ['#6B5BCD', '#FF6B9D'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontWeight: 600,
      markers: {
        width: 8,
        height: 8,
        radius: 4
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#374151'
            }
          }
        }
      }
    },
    labels: ['Math World', 'Reading Land'],
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif'
      }
    }
  })

  const getWorldDistributionChartSeries = () => {
    if (!worldDistribution) return []
    return [
      worldDistribution.mathWorld.timeSpent,
      worldDistribution.readingLand.timeSpent
    ]
  }

  const timeFilterOptions = [
    { value: 'daily', label: 'Daily', icon: 'Calendar' },
    { value: 'weekly', label: 'Weekly', icon: 'CalendarDays' },
    { value: 'monthly', label: 'Monthly', icon: 'CalendarRange' }
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Parent Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Track your child's learning progress and achievements
              </p>
            </div>
            
            {/* Time Filter */}
            <div className="flex gap-2 bg-white rounded-xl p-2 shadow-kids">
              {timeFilterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeFilter(option.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${timeFilter === option.value
                      ? 'bg-primary text-white shadow-button'
                      : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                    }
                  `}
                >
                  <ApperIcon name={option.icon} size={16} />
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="card-kids">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-primary">
                  {progressData.reduce((sum, item) => sum + item.games + item.stories, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Trophy" size={24} className="text-primary" />
              </div>
            </div>
          </div>
          
          <div className="card-kids">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stars Earned</p>
                <p className="text-2xl font-bold text-accent">
                  {progressData.reduce((sum, item) => sum + item.totalStars, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Star" size={24} className="text-accent" />
              </div>
            </div>
          </div>
          
          <div className="card-kids">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-success">
                  {progressData.reduce((sum, item) => sum + item.estimatedTime, 0)}m
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" size={24} className="text-success" />
              </div>
            </div>
          </div>
          
          <div className="card-kids">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-secondary">
                  {progressData.filter(item => item.games > 0 || item.stories > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Flame" size={24} className="text-secondary" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:col-span-2 card-kids"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              Learning Progress
            </h3>
            <Chart
              options={getProgressChartOptions()}
              series={getProgressChartSeries()}
              type="line"
              height={350}
            />
          </motion.div>

          {/* World Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-kids"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ApperIcon name="PieChart" size={20} className="text-secondary" />
              Learning Worlds
            </h3>
            <Chart
              options={getWorldDistributionChartOptions()}
              series={getWorldDistributionChartSeries()}
              type="donut"
              height={300}
            />
          </motion.div>
        </div>

        {/* Time Spent Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card-kids mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ApperIcon name="Clock" size={20} className="text-success" />
            Time Spent Learning
          </h3>
          <Chart
            options={getTimeSpentChartOptions()}
            series={getTimeSpentChartSeries()}
            type="bar"
            height={300}
          />
        </motion.div>

        {/* Top Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card-kids"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ApperIcon name="Trophy" size={20} className="text-accent" />
            Most Played Games
          </h3>
          <div className="space-y-3">
            {topGames.map((game, index) => (
              <div key={game.gameId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 capitalize">
                      {game.gameId.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {game.timesPlayed} times played
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Star" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-gray-700">
                    {game.averageStars}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ParentDashboard