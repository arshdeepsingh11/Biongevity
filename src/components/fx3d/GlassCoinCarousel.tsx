"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface Coin { id: string; icon: IconName; title: string; value: string; back: string }
