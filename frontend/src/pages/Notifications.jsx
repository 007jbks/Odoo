import { useState ,useEffect} from 'react';

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    type: 'swap_request',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    from: {
      name: 'Alice Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    theirItem: {
      name: 'Blue Denim Jacket',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=256&q=80',
      pointsValue: 30,
    },
    yourItem: {
      name: 'Red Hoodie',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&q=80',
      pointsValue: 25,
    },
    pointsOffered: 5,
  },
  {
    id: 2,
    type: 'system',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    message: 'Your item "Green T-shirt" has been approved and is now visible to others!',
  },
  {
    id: 3,
    type: 'swap_request',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    from: {
      name: 'Bob Smith',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    theirItem: {
      name: 'Black Sneakers',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&q=80',
      pointsValue: 40,
    },
    yourItem: {
      name: 'White T-shirt',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=256&q=80',
      pointsValue: 40,
    },
    pointsOffered: 0,
  },
  {
    id: 4,
    type: 'system',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    message: 'Welcome to ReWear! Start swapping to earn points.',
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  // Fetch notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = Cookies.get('jwt_token');
        if (!token) {
          // Optionally handle unauthenticated state
          return;
        }
        const response = await fetch('http://localhost:8000/api/notifications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        // Optionally handle error
        // setError(err.message);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  };

  // Format time to relative time string
  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);

    if (secondsAgo < 60) return 'Just now';
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#1F77B4F2] hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4 text-lg text-gray-600">You don't have any notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${!notification.read ? 'border-l-4 border-[#1F77B4F2]' : ''}`}
              >
                {notification.type === 'swap_request' && (
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={notification.from.avatar}
                          alt={notification.from.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            <span className="font-semibold">{notification.from.name}</span> wants to swap with you
                          </p>
                          <p className="text-xs text-gray-500">{getRelativeTime(notification.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-gray-500 hover:text-[#1F77B4F2]"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 p-3 rounded-lg mt-3 mb-3">
                      <div className="flex-1 flex items-center">
                        <img
                          src={notification.theirItem.image}
                          alt={notification.theirItem.name}
                          className="w-14 h-14 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="text-xs font-medium">Their item:</p>
                          <p className="text-sm">{notification.theirItem.name}</p>
                          <p className="text-sm text-[#1F77B4F2]">{notification.theirItem.pointsValue} pts</p>
                        </div>
                      </div>

                      <div className="px-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>

                      <div className="flex-1 flex items-center">
                        <img
                          src={notification.yourItem.image}
                          alt={notification.yourItem.name}
                          className="w-14 h-14 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="text-xs font-medium">Your item:</p>
                          <p className="text-sm">{notification.yourItem.name}</p>
                          <p className="text-sm text-[#1F77B4F2]">{notification.yourItem.pointsValue} pts</p>
                        </div>
                      </div>
                    </div>

                    {/* Point difference */}
                    {notification.pointsOffered > 0 && (
                      <p className="text-sm text-green-600 mb-3">
                        + {notification.pointsOffered} points offered
                      </p>
                    )}
                    {notification.pointsOffered < 0 && (
                      <p className="text-sm text-red-600 mb-3">
                        {notification.pointsOffered} points needed
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-3">
                      <button
                        className="flex-1 bg-[#1F77B4F2] text-white py-2 px-4 rounded hover:bg-[#1F77B4] transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {notification.type === 'system' && (
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1F77B4F2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500">{getRelativeTime(notification.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-gray-500 hover:text-[#1F77B4F2]"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;