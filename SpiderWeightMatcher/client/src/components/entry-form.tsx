import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, PlusCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertEntrySchema } from "@shared/schema";

const formSchema = insertEntrySchema;

type FormData = z.infer<typeof formSchema>;

const teamColors = [
  { value: "red", label: "🔴 Red Team", color: "red" },
  { value: "blue", label: "🔵 Blue Team", color: "blue" },
  { value: "green", label: "🟢 Green Team", color: "green" },
  { value: "yellow", label: "🟡 Yellow Team", color: "yellow" },
  { value: "purple", label: "🟣 Purple Team", color: "purple" },
  { value: "orange", label: "🟠 Orange Team", color: "orange" },
  { value: "pink", label: "🩷 Pink Team", color: "pink" },
  { value: "cyan", label: "🩵 Cyan Team", color: "cyan" },
  { value: "lime", label: "🟢 Lime Team", color: "lime" },
  { value: "indigo", label: "🟦 Indigo Team", color: "indigo" },
  { value: "teal", label: "🔹 Teal Team", color: "teal" },
  { value: "emerald", label: "💚 Emerald Team", color: "emerald" },
  { value: "rose", label: "🌹 Rose Team", color: "rose" },
  { value: "amber", label: "🟨 Amber Team", color: "amber" },
  { value: "violet", label: "🟪 Violet Team", color: "violet" },
  { value: "sky", label: "🩵 Sky Team", color: "sky" },
  { value: "slate", label: "⬜ Slate Team", color: "slate" },
  { value: "zinc", label: "⚫ Zinc Team", color: "zinc" },
  { value: "stone", label: "🪨 Stone Team", color: "stone" },
  { value: "neutral", label: "⚪ Neutral Team", color: "neutral" },
  { value: "fuchsia", label: "💜 Fuchsia Team", color: "fuchsia" },
  { value: "crimson", label: "❤️ Crimson Team", color: "crimson" },
  { value: "maroon", label: "🟤 Maroon Team", color: "maroon" },
  { value: "navy", label: "🔷 Navy Team", color: "navy" },
  { value: "gold", label: "🟨 Gold Team", color: "gold" },
];

export default function EntryForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [entryCount, setEntryCount] = useState(0);
  const [currentNameCount, setCurrentNameCount] = useState(0);
  const [lastSubmittedName, setLastSubmittedName] = useState("");
  const [lastSubmittedColor, setLastSubmittedColor] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      teamColor: "",
      weight: "" as any,
      isPriority: 0,
    },
  });

  // Watch for form changes to retain name and color
  const watchedName = form.watch("name");
  const watchedColor = form.watch("teamColor");

  useEffect(() => {
    // Check if name or color changed from last submission
    if (watchedName !== lastSubmittedName || watchedColor !== lastSubmittedColor) {
      setCurrentNameCount(0);
    }
  }, [watchedName, watchedColor, lastSubmittedName, lastSubmittedColor]);

  const createEntryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/entries", data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      
      const newCount = currentNameCount + 1;
      setCurrentNameCount(newCount);
      setLastSubmittedName(variables.name);
      setLastSubmittedColor(variables.teamColor);
      
      // Only reset if we've reached 20 entries with same name/color
      if (newCount >= 20) {
        form.reset();
        setCurrentNameCount(0);
        setLastSubmittedName("");
        setLastSubmittedColor("");
        toast({
          title: "Maximum Reached",
          description: "20 entries with same name/color reached. Form reset for new fighter.",
        });
      } else {
        // Only reset weight, keep name and color
        form.setValue("weight", "" as any);
        form.clearErrors("weight");
      }
      
      setEntryCount((prev) => prev + 1);
      toast({
        title: "Entry Added",
        description: `Fighter entry added (${newCount}/20 for this name/color).`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Validate weight has exactly 3 digits
    const weightStr = data.weight.toString();
    if (weightStr.length !== 3) {
      toast({
        title: "Invalid Weight",
        description: "Weight must be exactly 3 digits (100-999).",
        variant: "destructive",
      });
      return;
    }
    
    createEntryMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <PlusCircle className="text-primary mr-2" />
          Add New Entry
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{entryCount} total entries</span>
          {lastSubmittedName && (
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {currentNameCount}/20 for "{lastSubmittedName}"
            </span>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Entry Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Fighter Name</Label>
            <Input
              id="name"
              placeholder="Enter fighter name"
              maxLength={20}
              {...form.register("name")}
            />
            <p className="text-xs text-gray-500">
              {form.watch("name")?.length || 0}/20 characters
            </p>
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Team Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="teamColor">Team Color</Label>
            <Select onValueChange={(value) => form.setValue("teamColor", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select team color" />
              </SelectTrigger>
              <SelectContent>
                {teamColors.map((team) => (
                  <SelectItem key={team.value} value={team.value}>
                    {team.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.teamColor && (
              <p className="text-sm text-red-600">{form.formState.errors.teamColor.message}</p>
            )}
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (3 digits only)</Label>
            <Input
              id="weight"
              type="number"
              min="100"
              max="999"
              placeholder="e.g., 456"
              {...form.register("weight", { valueAsNumber: true })}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                const value = target.value;
                // Prevent input longer than 3 digits
                if (value.length > 3) {
                  target.value = value.slice(0, 3);
                }
                // Prevent input shorter than 3 digits if not empty
                if (value.length > 0 && value.length < 3) {
                  target.setCustomValidity("Weight must be exactly 3 digits");
                } else {
                  target.setCustomValidity("");
                }
              }}
            />
            <p className="text-xs text-gray-500">Weight must be exactly 3 digits (100-999)</p>
            {form.formState.errors.weight && (
              <p className="text-sm text-red-600">{form.formState.errors.weight.message}</p>
            )}
          </div>

          {/* Priority Bet Toggle */}
          <div className="space-y-2">
            <Label htmlFor="isPriority" className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Priority Bet</span>
            </Label>
            <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
              <Switch
                id="isPriority"
                checked={form.watch("isPriority") === 1}
                onCheckedChange={(checked) => form.setValue("isPriority", checked ? 1 : 0)}
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {form.watch("isPriority") === 1 ? "HIGH BET" : "Normal Bet"}
                </div>
                <div className="text-xs text-gray-600">
                  {form.watch("isPriority") === 1 
                    ? "Will be prioritized for matching" 
                    : "Standard matching priority"
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Entry Button */}
        <Button
          type="submit"
          className="w-full md:w-auto bg-primary text-white hover:bg-blue-700"
          disabled={createEntryMutation.isPending}
        >
          <Plus className="mr-2 w-4 h-4" />
          {createEntryMutation.isPending ? "Adding..." : "Add Entry"}
        </Button>
      </form>
    </div>
  );
}
