"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TreePine,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Leaf,
  Star,
  Trophy,
} from "lucide-react";

interface TreeTracker {
  totalTrees: number;
  totalOffset: number; // in kg CO₂
  streak: number; // consecutive days with tree activity
  badges: string[];
  level: number;
  nextLevelTrees: number;
}

interface TreeGamificationProps {
  userTrees: any[];
  onPlantTree: () => void;
}

export function TreeGamification({ userTrees, onPlantTree }: TreeGamificationProps) {
  const [trackerData, setTrackerData] = useState<TreeTracker>({
    totalTrees: 0,
    totalOffset: 0,
    streak: 0,
    badges: [],
    level: 1,
    nextLevelTrees: 5,
  });

  // Calculate gamification data
  useEffect(() => {
    const totalTrees = userTrees.length;
    const totalOffset = userTrees.reduce((sum, tree) => sum + tree.cumulativeOffset * 1000, 0);
    
    // Calculate level (every 5 trees = new level)
    const level = Math.floor(totalTrees / 5) + 1;
    const nextLevelTrees = level * 5;
    
    // Calculate streak (simplified - consecutive days with trees)
    let streak = 0;
    if (userTrees.length > 0) {
      const sortedTrees = [...userTrees].sort(
        (a, b) => new Date(b.plantingDate).getTime() - new Date(a.plantingDate).getTime()
      );
      
      // Simple streak calculation
      const today = new Date();
      const lastPlantDate = new Date(sortedTrees[0].plantingDate);
      const daysDiff = Math.floor((today.getTime() - lastPlantDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) { // Active within last week
        streak = Math.min(totalTrees, 30); // Cap at 30 days
      }
    }
    
    // Award badges based on achievements
    const badges = [];
    if (totalTrees >= 1) badges.push("First Tree 🌱");
    if (totalTrees >= 5) badges.push("Grove Starter 🌳");
    if (totalTrees >= 10) badges.push("Forest Guardian 🏞️");
    if (totalTrees >= 25) badges.push("Eco Warrior 🛡️");
    if (totalOffset >= 1000) badges.push("Ton Offsetter ⚖️");
    if (streak >= 7) badges.push("Tree Streak 🔥");
    if (level >= 5) badges.push("Green Champion 🏆");
    
    setTrackerData({
      totalTrees,
      totalOffset,
      streak,
      badges,
      level,
      nextLevelTrees,
    });
  }, [userTrees]);

  const progressToNextLevel = ((trackerData.totalTrees % 5) / 5) * 100;

  const getLevelBadge = (level: number) => {
    if (level >= 10) return { emoji: "🏆", title: "Legend", color: "bg-yellow-500" };
    if (level >= 7) return { emoji: "👑", title: "Master", color: "bg-purple-500" };
    if (level >= 5) return { emoji: "🥇", title: "Expert", color: "bg-blue-500" };
    if (level >= 3) return { emoji: "🥈", title: "Pro", color: "bg-gray-400" };
    if (level >= 2) return { emoji: "🥉", title: "Novice", color: "bg-orange-500" };
    return { emoji: "🌱", title: "Beginner", color: "bg-green-500" };
  };

  const levelBadge = getLevelBadge(trackerData.level);

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30 shadow-xl">
      <CardHeader className="flex-row items-center space-x-3">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
        </div>
        <CardTitle className="text-lg lg:text-xl font-semibold text-white">
          Tree Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${levelBadge.color}/20 rounded-full border ${levelBadge.color}/50 mb-3`}>
            <span className="text-2xl">{levelBadge.emoji}</span>
            <div>
              <p className="text-white font-semibold">Level {trackerData.level}</p>
              <p className="text-white/60 text-xs">{levelBadge.title}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/80">
              <span>Progress to Level {trackerData.level + 1}</span>
              <span>{trackerData.totalTrees % 5}/5 trees</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-900/30 rounded-lg">
            <TreePine className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-sm text-white/60">Total Trees</p>
            <p className="text-xl font-bold text-white">{trackerData.totalTrees}</p>
          </div>
          <div className="text-center p-3 bg-slate-900/30 rounded-lg">
            <Leaf className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-sm text-white/60">CO₂ Offset</p>
            <p className="text-xl font-bold text-white">
              {trackerData.totalOffset.toFixed(0)}
              <span className="text-xs text-white/60 ml-1">g</span>
            </p>
          </div>
          <div className="text-center p-3 bg-slate-900/30 rounded-lg">
            <Calendar className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-sm text-white/60">Activity Streak</p>
            <p className="text-xl font-bold text-white">
              {trackerData.streak}
              <span className="text-xs text-white/60 ml-1">days</span>
            </p>
          </div>
          <div className="text-center p-3 bg-slate-900/30 rounded-lg">
            <Award className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <p className="text-sm text-white/60">Badges</p>
            <p className="text-xl font-bold text-white">{trackerData.badges.length}</p>
          </div>
        </div>

        {/* Badges */}
        {trackerData.badges.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Your Badges
            </h4>
            <div className="flex flex-wrap gap-2">
              {trackerData.badges.map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-slate-700/50 text-white border border-slate-600 text-xs"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Goals & Milestones */}
        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-600">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-400" />
            Next Goals
          </h4>
          <div className="space-y-2 text-sm">
            {trackerData.totalTrees < 5 && (
              <div className="flex justify-between">
                <span className="text-white/80">🌳 Plant 5 trees</span>
                <span className="text-orange-400 font-semibold">
                  {5 - trackerData.totalTrees} to go
                </span>
              </div>
            )}
            {trackerData.totalTrees >= 5 && trackerData.totalTrees < 10 && (
              <div className="flex justify-between">
                <span className="text-white/80">🏞️ Create a grove (10 trees)</span>
                <span className="text-orange-400 font-semibold">
                  {10 - trackerData.totalTrees} to go
                </span>
              </div>
            )}
            {trackerData.totalOffset < 1000 && (
              <div className="flex justify-between">
                <span className="text-white/80">⚖️ Offset 1kg CO₂</span>
                <span className="text-orange-400 font-semibold">
                  {(1000 - trackerData.totalOffset).toFixed(0)}g to go
                </span>
              </div>
            )}
            {trackerData.level < 5 && (
              <div className="flex justify-between">
                <span className="text-white/80">🏆 Reach Level 5</span>
                <span className="text-orange-400 font-semibold">
                  {25 - trackerData.totalTrees} trees to go
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onPlantTree}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
        >
          <TreePine className="w-4 h-4 mr-2" />
          Plant Another Tree
        </Button>

        {/* Motivational Message */}
        <div className="text-center p-3 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg">
          <p className="text-green-400 text-sm font-medium">
            {trackerData.totalTrees === 0 && "🌱 Plant your first tree and start your climate journey!"}
            {trackerData.totalTrees === 1 && "🎉 Great start! Your tree is already working to clean the air."}
            {trackerData.totalTrees >= 2 && trackerData.totalTrees < 5 && 
              `🌳 Amazing! Your ${trackerData.totalTrees} trees are making a real difference.`
            }
            {trackerData.totalTrees >= 5 && trackerData.totalTrees < 10 && 
              "🏞️ You're creating a mini forest! Keep up the excellent work."
            }
            {trackerData.totalTrees >= 10 && 
              "🌍 You're a true environmental champion! Your forest is thriving."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}