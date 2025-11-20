/**
 * XP Notification Component
 *
 * Displays floating notifications when XP is gained or level ups occur.
 */

import { useEffect, useState } from 'react';
import { useProgress } from '../contexts/ProgressContext';

interface Notification {
  id: string;
  amount: number;
  source: string;
  levelUp?: boolean;
  newLevel?: number;
  timestamp: number;
}

export function XPNotification() {
  const { recentXPGains } = useProgress();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (recentXPGains.length > 0) {
      const newNotifications = recentXPGains.map((xpGain) => ({
        id: `${xpGain.timestamp}-${Math.random()}`,
        amount: xpGain.amount,
        source: xpGain.source,
        levelUp: xpGain.levelUp,
        newLevel: xpGain.newLevel,
        timestamp: xpGain.timestamp,
      }));

      setNotifications((prev) => [...prev, ...newNotifications]);

      // Remove notifications after animation completes
      const timer = setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => !newNotifications.find((nn) => nn.id === n.id))
        );
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [recentXPGains]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="animate-slide-in-right"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Level Up Notification */}
          {notification.levelUp && (
            <div className="bg-gradient-to-r from-primary-red to-warning border-2 border-warning rounded-lg p-4 shadow-lg mb-2 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎉</div>
                <div>
                  <div className="font-bold text-white text-lg">LEVEL UP!</div>
                  <div className="text-sm text-white/90">
                    You reached Level {notification.newLevel}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* XP Gain Notification */}
          <div className="bg-gray-900 border-2 border-success rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⭐</div>
              <div>
                <div className="font-bold text-success">+{notification.amount} XP</div>
                <div className="text-xs text-metallic">{notification.source}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
