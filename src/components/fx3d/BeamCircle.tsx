"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface BeamNode { id: string; label: string; icon: IconName; sub?: string }
