import React from 'react';
import { getUserProfile, getTierInfo, getNextTierProgress } from '../services/loyaltyService';
import { formatCurrency } from '../services/budgetService';

const LoyaltyDashboard: React.FC = () => {
  const profile = getUserProfile();
  const tierInfo = getTierInfo(profile.loyaltyTier);
  const progress = getNextTierProgress();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-amber-500';
      case 'Silver': return 'bg-gray-400';
      case 'Gold': return 'bg-yellow-500';
      case 'Platinum': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return '🥉';
      case 'Silver': return '🥈';
      case 'Gold': return '🥇';
      case 'Platinum': return '💎';
      default: return '🏆';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Loyalty Dashboard</h2>

      {/* Current Tier Display */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg border border-emerald-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{getTierIcon(profile.loyaltyTier)}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Current Tier: {profile.loyaltyTier}</h3>
                <p className="text-gray-600">Discount: {Math.round(tierInfo.discount * 100)}% off future trips</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You've earned {profile.totalPoints} total points across {profile.totalTrips} trips
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">{profile.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {profile.loyaltyTier !== 'Platinum' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress to Next Tier</span>
            <span className="text-sm text-gray-600">
              {profile.totalPoints} / {progress.next} points
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getTierColor(profile.loyaltyTier)}`}
              style={{ width: `${progress.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress.next - profile.totalPoints} more points needed for next tier
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{profile.totalTrips}</div>
          <div className="text-sm text-green-700">Total Trips</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(profile.totalSpent)}</div>
          <div className="text-sm text-emerald-700">Total Spent</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{Math.round(profile.totalSpent / Math.max(profile.totalTrips, 1))}</div>
          <div className="text-sm text-green-700">Avg. Trip Cost</div>
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Tier Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🥉</span>
              <span className="font-semibold text-amber-800">Bronze (0+ points)</span>
            </div>
            <p className="text-sm text-amber-700">5% discount on future trips</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🥈</span>
              <span className="font-semibold text-gray-800">Silver (500+ points)</span>
            </div>
            <p className="text-sm text-gray-700">10% discount on future trips</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🥇</span>
              <span className="font-semibold text-yellow-800">Gold (1500+ points)</span>
            </div>
            <p className="text-sm text-yellow-700">15% discount on future trips</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💎</span>
              <span className="font-semibold text-blue-800">Platinum (3000+ points)</span>
            </div>
            <p className="text-sm text-blue-700">20% discount on future trips</p>
          </div>
        </div>
      </div>

      {/* How to Earn Points */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3">How to Earn Points</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>100 points per trip</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>25 points per day of travel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>50 bonus points for sustainable travel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>25 bonus points for using AI companions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Budget-friendly trips earn more points!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDashboard;
