---
name: Finance Track Design System
description: Modern dual-theme design system for personal financial tracking (Forest Wealth & Forest Obsidian)
colors:
  primary: "#059669"
  primary-dark: "#10b981"
  emerald-50: "#ecfdf5"
  emerald-500: "#10b981"
  emerald-600: "#059669"
  emerald-700: "#047857"
  expense: "#dc2626"
  expense-dark: "#ef4444"
  neutral-bg-light: "#f8fafc"
  neutral-bg-dark: "#090d16"
  surface-light: "#ffffff"
  surface-dark: "#131b2e"
  surface-secondary-light: "#f1f5f9"
  surface-secondary-dark: "#1e293b"
  border-light: "#e2e8f0"
  border-dark: "#1e293b"
  text-primary-light: "#0f172a"
  text-primary-dark: "#f8fafc"
  text-secondary-light: "#64748b"
  text-secondary-dark: "#94a3b8"
  text-muted-light: "#94a3b8"
  text-muted-dark: "#64748b"
typography:
  display:
    fontFamily: "System"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.5px"
  headline:
    fontFamily: "System"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.3px"
  title:
    fontFamily: "System"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "System"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "System"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.4px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
components:
  card:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text-primary-light}"
    rounded: "{rounded.xl}"
    padding: "20px"
  card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.xl}"
    padding: "20px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "10px 18px"
  badge-income:
    backgroundColor: "{colors.emerald-50}"
    textColor: "{colors.emerald-600}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Finance Track

## Overview

**Creative North Star: "Forest Sanctuary & Obsidian Vault"**

Finance Track pairs the calm reassurance of natural emerald greens with the razor-sharp legibility of modern Swiss financial typography. The design system lives in two deliberate atmospheres: **Forest Wealth** (Light Mode) provides crisp, daylight-clear balance accounting on clean alabaster surfaces; **Forest Obsidian** (Dark Mode) immerses the user into a distraction-free, OLED-deep vault where high-contrast neon emerald and coral accents illuminate cash flows without visual fatigue.

The interface prioritizes **Operate** mode: high scanability, tabular numerical alignment, tactile haptic button responses, and zero decorative fluff. Every element has semantic financial intent.

**Key Characteristics:**
- **Strict Dual-Theme Parity**: Every screen, card, modal, and badge has a 1:1 tailored rendering in Light and Dark mode.
- **Tabular Precision**: Monospaced tabular numeral variants (`fontVariant: ["tabular-nums"]`) ensure amounts never jitter or shift columns.
- **Progressive Disclosure**: Compact hero KPI cards expandable to detailed breakdowns and granular category leaderboards.
- **Glanceable Thresholds**: Color-coded budget feedback: Safe Emerald (0-75%), Warning Amber (75-99%), and Critical Coral (100%+).

## Colors

The palette is anchored by deep emerald greens symbolizing financial vitality, paired with cool slates and vibrant category accents:

- **Primary / Brand**:
  - Light: Emerald 600 (`#059669`) / Emerald 700 (`#047857`)
  - Dark: Emerald 500 (`#10b981`) with luminous subtle glow
- **Backgrounds & Surfaces**:
  - Light: Screen Background `#f8fafc`, Card Surface `#ffffff`, Secondary Wells `#f1f5f9`
  - Dark: Screen Background `#090d16` (deep obsidian slate), Card Surface `#131b2e`, Secondary Wells `#1e293b`
- **Semantic Cash Flows**:
  - Income (+): Emerald 600 (`#059669`) / Emerald 500 (`#10b981`), Soft Well `#dcfce7` / `rgba(16, 185, 129, 0.15)`
  - Expense (-): Crimson Red 600 (`#dc2626`) / Red 500 (`#ef4444`), Soft Well `#fee2e2` / `rgba(239, 68, 68, 0.15)`
- **Category Accents**:
  - Logement / Bureau: Indigo `#6366f1`
  - Alimentation / Restaurants: Amber `#f59e0b`
  - Transports: Blue `#3b82f6`
  - Loisirs & Sorties: Purple `#8b5cf6`
  - Santé & Bien-être: Rose `#f43f5e`
  - Shopping: Teal `#14b8a6`
  - Salaire & Investissement: Emerald `#10b981`

## Typography

- **Display Numbers (Balance & Totals)**: 32px / 800 (Bold/Extrabold), Tabular Figures, `-0.5px` letter spacing.
- **Section Titles**: 20px / 700 (Bold), `-0.3px` letter spacing.
- **Card Subheadings & Headers**: 15px-16px / 700 (Bold).
- **Body Text**: 14px / 400-500 (Regular/Medium), 1.45 line-height.
- **Labels, Dates & Footers**: 11px-12px / 600 (Semibold), uppercase or muted slate.
- **Rule**: All currency values (`€`) must use `fontVariant: ["tabular-nums"]`.

## Layout

- **Grid & Margins**: 16px horizontal screen padding on mobile viewports.
- **Card Spacing**: 12px to 16px vertical gap between content cards.
- **Safe Areas**: Strict inclusion of `react-native-safe-area-context` for edge-to-edge status bars and Home Indicator bars.
- **Period Segmentation**: Pinned `[Jour | Semaine | Mois]` segment controller at top of screen for continuous temporal switching.

## Elevation & Depth

- **Light Mode**:
  - Low-contrast border (`#e2e8f0`, 1px).
  - Ambient diffuse drop shadow (`shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2`).
- **Dark Mode**:
  - Border-defined structure (`#1e293b`, 1px) without harsh outlines.
  - Deep OLED elevation: layered surfaces (`#090d16` -> `#131b2e` -> `#1e293b`).

## Shapes

- **Hero Balance Card**: 20px border radius with subtle internal borders.
- **Category & Metric Cards**: 16px to 20px border radius.
- **Badges & Pills**: 9999px (full pill) for status tags, period pills, and action chips.
- **Category Icons**: 36px x 36px or 40px x 40px rounded squares (12px radius) with 15% opacity background matching the category hue.

## Components

1. **PeriodSelector**: Segmented control pill with sliding or active pill backdrop; indicates current range with previous/next date chevron controls.
2. **BalanceCard**: Hero element displaying net balance, savings rate badge, total income (down arrow in soft green circle) and total expense (up arrow in soft red circle).
3. **FinanceChart**: Responsive bar chart comparing period bars with dynamic highlight on the highest expenditure day/period.
4. **CategoryBreakdownCard**: Progress track showing spending by category with percentage and count.
5. **BudgetProgressCard**: Multi-tier threshold indicator with remaining allowance or over-budget warning.
6. **TransactionItem**: High-density transaction row with category badge, bold title, date/time sub-line, payment method tag, and formatted signed amount.
7. **Modal Sheet (New Transaction)**: Big tabular numeral input, expense/income toggle switch, grid of category icons, payment method chips, and high-contrast submit button.

## Do's and Don'ts

- **DO** always support instantaneous Light/Dark theme switching without page reloads.
- **DO** format all numbers with French locale formatting (`1 250,00 €`) and signed prefixes (`+` for income, `-` for expense).
- **DO** provide clear empty states when zero transactions exist, offering a quick action to add an expense or income.
- **DON'T** use harsh pure blacks (`#000000`) or generic default blues; use Forest Obsidian (`#090d16`, `#131b2e`).
- **DON'T** jitter layout when numbers change; always use tabular numerals.
- **DON'T** hide critical balance information behind nested menus; keep the core KPIs on the dashboard viewport.
