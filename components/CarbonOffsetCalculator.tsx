"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TreePine,
  Leaf,
  Calculator,
  Car,
  DollarSign,
  Plus,
  Minus,
  Calendar,
  Award,
} from "lucide-react";

interface PlantedTree {
  id: string;
  plantingDate: Date;
  ageInDays: number;
  cumulativeOffset: number;
}

interface CarbonOffsetCalculatorProps {
  carbonEmissions: number; // in kg CO₂e
}

export function CarbonOffsetCalculator({
  carbonEmissions,
}: CarbonOffsetCalculatorProps) {
  const [userTrees, setUserTrees] = useState<PlantedTree[]>([]);
  const [newTreeDate, setNewTreeDate] = useState("");
  const [showAddTree, setShowAddTree] = useState(false);

  // Constants based on guidelines
  const TREE_LIFETIME_OFFSET = 4.6; // tCO₂e per tree over lifetime
  const OFFSET_COST_PER_TON = 14; // USD per tCO₂e
  const DAILY_OFFSET_RATE = 0.000063; // tCO₂e per day
  const MILES_PER_KG = 0.4; // kg CO₂e per mile
  const KM_PER_KG = 0.248; // kg CO₂e per km

  // Convert emissions to tons
  const emissionsInTons = carbonEmissions / 1000;

  // Calculate required trees
  const treesRequired = Math.ceil(emissionsInTons / TREE_LIFETIME_OFFSET);

  // Calculate total user tree offset
  const totalUserOffset = userTrees.reduce(
    (sum, tree) => sum + tree.cumulativeOffset,
    0
  );

  // Calculate net emissions
  const netEmissions = emissionsInTons - totalUserOffset;

  // Calculate costs
  const offsetCost = emissionsInTons * OFFSET_COST_PER_TON;
  const surplusValue =
    netEmissions < 0 ? Math.abs(netEmissions) * OFFSET_COST_PER_TON : 0;

  // Calculate car equivalences
  const milesEquivalent = Math.round(carbonEmissions / MILES_PER_KG);
  const kmEquivalent = Math.round(carbonEmissions / KM_PER_KG);

  // Update tree ages and offsets
  useEffect(() => {
    const updateTrees = () => {
      const now = new Date();
      setUserTrees((prev) =>
        prev.map((tree) => {
          const ageInDays = Math.floor(
            (now.getTime() - tree.plantingDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const cumulativeOffset = ageInDays * DAILY_OFFSET_RATE;
          return { ...tree, ageInDays, cumulativeOffset };
        })
      );
    };

    updateTrees();
    const interval = setInterval(updateTrees, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  const addTree = () => {
    if (!newTreeDate) return;

    const plantingDate = new Date(newTreeDate);
    const now = new Date();
    const ageInDays = Math.floor(
      (now.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const cumulativeOffset = ageInDays * DAILY_OFFSET_RATE;

    const newTree: PlantedTree = {
      id: Date.now().toString(),
      plantingDate,
      ageInDays,
      cumulativeOffset,
    };

    setUserTrees((prev) => [...prev, newTree]);
    setNewTreeDate("");
    setShowAddTree(false);
  };

  const removeTree = (id: string) => {
    setUserTrees((prev) => prev.filter((tree) => tree.id !== id));
  };

  const formatTreeAge = (days: number) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    if (years > 0) {
      return `${years}y ${months}m`;
    }
    return `${months}m`;
  };

  const getClimateStatus = () => {
    if (netEmissions < 0) {
      return {
        status: "Climate Positive",
        color: "text-green-400",
        icon: <Award className="w-5 h-5" />,
        message: `You offset ${Math.abs(netEmissions).toFixed(
          2
        )} tons more CO₂ than you emit!`,
      };
    } else if (netEmissions === 0) {
      return {
        status: "Carbon Neutral",
        color: "text-blue-400",
        icon: <Leaf className="w-5 h-5" />,
        message: "You've perfectly offset your emissions!",
      };
    } else {
      return {
        status: "Carbon Positive",
        color: "text-orange-400",
        icon: <Calculator className="w-5 h-5" />,
        message: `You need ${
          treesRequired - userTrees.length
        } more trees to offset emissions.`,
      };
    }
  };

  const climateStatus = getClimateStatus();

  return (
    <Card className="bg-slate-800/50 border border-slate-700 shadow-xl">
      <CardHeader className="flex-row items-center space-x-3">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <TreePine className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
        </div>
        <CardTitle className="text-lg lg:text-xl font-semibold text-white">
          CO₂ Offset Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="text-center p-4 bg-slate-900/50 rounded-lg">
          <div
            className={`flex items-center justify-center gap-2 mb-2 ${climateStatus.color}`}
          >
            {climateStatus.icon}
            <h3 className="text-lg font-semibold">{climateStatus.status}</h3>
          </div>
          <p className="text-white/80 text-sm">{climateStatus.message}</p>
          {surplusValue > 0 && (
            <p className="text-green-400 text-sm mt-1">
              Worth ${surplusValue.toFixed(2)} in carbon credits!
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-900/30 rounded-lg">
            <TreePine className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-sm text-white/60">Trees Required</p>
            <p className="text-lg font-bold text-white">{treesRequired}</p>
          </div>
          <div className="text-center p-3 bg-slate-900/30 rounded-lg">
            <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-sm text-white/60">Offset Cost</p>
            <p className="text-lg font-bold text-white">
              ${offsetCost.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 bg-slate-900/30 rounded-lg">
            <Car className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-sm text-white/60">Miles Driven</p>
            <p className="text-lg font-bold text-white">
              {milesEquivalent.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-slate-900/30 rounded-lg">
            <Car className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <p className="text-sm text-white/60">Kilometers</p>
            <p className="text-lg font-bold text-white">
              {kmEquivalent.toLocaleString()}
            </p>
          </div>
        </div>

        {/* User Trees Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-400" />
              Your Trees ({userTrees.length})
            </h4>
            <Button
              onClick={() => setShowAddTree(!showAddTree)}
              size="sm"
              variant="outline"
              className="bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Tree
            </Button>
          </div>

          {showAddTree && (
            <div className="flex gap-2 mb-3 p-3 bg-slate-900/30 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="tree-date" className="text-white/80 text-sm">
                  Planting Date
                </Label>
                <Input
                  id="tree-date"
                  type="date"
                  value={newTreeDate}
                  onChange={(e) => setNewTreeDate(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={addTree} size="sm" disabled={!newTreeDate}>
                  Add
                </Button>
                <Button
                  onClick={() => setShowAddTree(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {userTrees.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {userTrees.map((tree) => (
                <div
                  key={tree.id}
                  className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <TreePine className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-white text-sm font-medium">
                        Oak Tree • {formatTreeAge(tree.ageInDays)} old
                      </p>
                      <p className="text-white/60 text-xs">
                        Offset: {(tree.cumulativeOffset * 1000).toFixed(1)} kg
                        CO₂
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeTree(tree.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-white/60">
              <TreePine className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No trees planted yet</p>
              <p className="text-xs">
                Add your trees to track your carbon offset!
              </p>
            </div>
          )}
        </div>

        {/* Total Offset Summary */}
        <div className="p-3 bg-slate-900/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Total Tree Offset:</span>
            <span className="text-green-400 font-semibold">
              {(totalUserOffset * 1000).toFixed(1)} kg CO₂
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-white/80">Net Emissions:</span>
            <span
              className={
                netEmissions < 0 ? "text-green-400" : "text-orange-400"
              }
            >
              {netEmissions < 0 ? "-" : ""}
              {Math.abs(netEmissions * 1000).toFixed(1)} kg CO₂
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
