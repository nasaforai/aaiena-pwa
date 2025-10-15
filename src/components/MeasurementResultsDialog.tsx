import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { UserMeasurements } from "@/lib/sizingApi";

// Extended type to handle both direct measurements and API response object
interface MeasurementsContainer {
  measurements?: UserMeasurements;
  height?: number;
  chest?: number;
  waist?: number;
  Butt?: number;
  shoulder_width?: number;
  neck?: number;
  inseam?: number;
  body_length?: number;
}

interface MeasurementResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  measurements: MeasurementsContainer | null;
  isSaving: boolean;
  recommendedSize: string | null;
  fitScore: number | null;
  alternativeSizes: Record<string, number> | null;
}

export function MeasurementResultsDialog({
  isOpen,
  onClose,
  onSave,
  measurements,
  isSaving,
  recommendedSize,
  fitScore,
  alternativeSizes,
}: MeasurementResultsDialogProps) {
  // Debug logging with full measurements object
  console.log("MeasurementResultsDialog props:", {
    isOpen,
    measurements: measurements,
    recommendedSize,
    fitScore
  });
  
  // If no measurements, don't render
  if (!measurements) return null;
  
  // Log raw measurements object for debugging
  console.log("Raw measurements object:", JSON.stringify(measurements));
  
  // CRITICAL FIX: Extract the actual measurements from the object
  // The measurements object appears to be the entire API response, not just the measurements
  let actualMeasurements = measurements;
  
  // Check if this is the full API response object instead of just measurements
  if (measurements.measurements) {
    console.log("Found nested measurements object, using that instead");
    actualMeasurements = measurements.measurements;
  }
  
  // Force values to be treated as numbers
  const height = Number(actualMeasurements.height);
  const chest = Number(actualMeasurements.chest);
  const waist = Number(actualMeasurements.waist);
  const butt = Number(actualMeasurements.Butt);
  const shoulder = Number(actualMeasurements.shoulder_width);
  const neck = Number(actualMeasurements.neck);
  const inseam = Number(actualMeasurements.inseam);
  const bodyLength = Number(actualMeasurements.body_length);
  
  // Format values with fallbacks
  const safeHeight = !isNaN(height) ? height.toFixed(1) : "N/A";
  const safeChest = !isNaN(chest) ? chest.toFixed(1) : "N/A";
  const safeWaist = !isNaN(waist) ? waist.toFixed(1) : "N/A";
  const safeButtHip = !isNaN(butt) ? butt.toFixed(1) : "N/A";
  const safeShoulder = !isNaN(shoulder) ? shoulder.toFixed(1) : "N/A";
  const safeNeck = !isNaN(neck) ? neck.toFixed(1) : "N/A";
  const safeInseam = !isNaN(inseam) ? inseam.toFixed(1) : "N/A";
  const safeBodyLength = !isNaN(bodyLength) ? bodyLength.toFixed(1) : "N/A";
  
  // Log the actual values for debugging
  console.log("Measurement values:", {
    height: safeHeight,
    chest: safeChest,
    waist: safeWaist,
    hip: safeButtHip,
    shoulder: safeShoulder,
    neck: safeNeck,
    inseam: safeInseam,
    bodyLength: safeBodyLength
  });

  console.log("Rendering dialog with isOpen:", isOpen);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Your Body Measurements</DialogTitle>
          <DialogDescription>
            We've analyzed your measurements for this product.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <h3 className="font-medium text-gray-900 mb-3">Measurements</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium text-gray-500">Height:</div>
              <div>{safeHeight} cm</div>
              
              <div className="font-medium text-gray-500">Chest:</div>
              <div>{safeChest}"</div>
              
              <div className="font-medium text-gray-500">Waist:</div>
              <div>{safeWaist}"</div>
              
              <div className="font-medium text-gray-500">Hip:</div>
              <div>{safeButtHip}"</div>

              <div className="font-medium text-gray-500">Shoulder:</div>
              <div>{safeShoulder}"</div>

              <div className="font-medium text-gray-500">Neck:</div>
              <div>{safeNeck}"</div>

              <div className="font-medium text-gray-500">Inseam:</div>
              <div>{safeInseam}"</div>

              <div className="font-medium text-gray-500">Body Length:</div>
              <div>{safeBodyLength}"</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={onSave} 
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save to My Profile</span>
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Save these measurements to your profile for future recommendations
            </p>
          </motion.div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Close
          </Button>
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save to Profile</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
