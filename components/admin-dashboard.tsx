export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administrative overview and platform management
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
          <p className="text-sm text-gray-500">+12% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Services</h3>
          <p className="text-3xl font-bold text-green-600">56</p>
          <p className="text-sm text-gray-500">+3 new this week</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$12,456</p>
          <p className="text-sm text-gray-500">+8% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Support Tickets</h3>
          <p className="text-3xl font-bold text-orange-600">23</p>
          <p className="text-sm text-gray-500">5 pending review</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm">New user registration</span>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm">Service deployment completed</span>
            <span className="text-xs text-gray-500">15 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm">Support ticket resolved</span>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}